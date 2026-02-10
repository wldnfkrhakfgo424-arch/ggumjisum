import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSupabase, isSupabaseEnabled } from '@/lib/supabase';

export type IslandStatus = 'safe' | 'warning' | 'sunk';

// 섬 발전 단계 정의
export const ISLAND_LEVELS = [
  { level: 0, name: '무인도', requiredExp: 0 },
  { level: 1, name: '텐트', requiredExp: 3 },
  { level: 2, name: '오두막', requiredExp: 7 },
  { level: 3, name: '작은 집', requiredExp: 14 },
  { level: 4, name: '마을', requiredExp: 30 },
] as const;

export function calculateIslandLevel(exp: number): number {
  for (let i = ISLAND_LEVELS.length - 1; i >= 0; i--) {
    if (exp >= ISLAND_LEVELS[i].requiredExp) return i;
  }
  return 0;
}

export function getNextLevelInfo(exp: number) {
  const currentLevel = calculateIslandLevel(exp);
  const current = ISLAND_LEVELS[currentLevel];
  const next = ISLAND_LEVELS[currentLevel + 1];
  if (!next) return { current, next: null, remaining: 0, progress: 1 };
  const remaining = next.requiredExp - exp;
  const rangeTotal = next.requiredExp - current.requiredExp;
  const rangeCurrent = exp - current.requiredExp;
  const progress = rangeTotal > 0 ? rangeCurrent / rangeTotal : 1;
  return { current, next, remaining, progress };
}

export interface User {
  id: string;
  nickname: string;
  goal?: string;
  budget_limit: number;
  reset_day: number;
}

export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description: string;
  original_input: string;
  occurred_at: string;
}

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Island state (일일 예산 모델)
  today_spend: number;
  last_spend_date: string;
  island_status: IslandStatus;
  island_exp: number;
  island_level: number;
  justLeveledUp: boolean;
  // Streak
  currentStreak: number;
  bestStreak: number;
  lastStreakUpdatedDate: string;
  streakRewards: {
    threeDaysUnlocked: boolean;
    sevenDaysUnlocked: boolean;
  };
  justStreakReward: '3' | '7' | null;
  resetSpend: () => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'occurred_at'>) => void;
  updateTransaction: (id: string, updates: Partial<Pick<Transaction, 'category' | 'description'>>) => void;
  deleteTransaction: (id: string) => void;

  // UI state
  isQuizOpen: boolean;
  setQuizOpen: (open: boolean) => void;
  lastMessage: string;
  setLastMessage: (msg: string) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Computed
  getDailyBudget: () => number;
  getRatio: () => number;
  getWaterLevel: () => number;
  getRemainingBudget: () => number;
  getIslandLevelInfo: () => ReturnType<typeof getNextLevelInfo>;

  // Actions
  restoreIsland: () => void;
  checkAndUpdateStatus: () => void;
  ensureTodayReset: () => void;
  clearLevelUp: () => void;
  clearStreakReward: () => void;

  // Supabase 동기화
  syncToSupabase: () => Promise<void>;
  lastSyncedAt: string | null;
}

function calculateStatus(ratio: number): IslandStatus {
  if (ratio >= 1) return 'sunk';
  if (ratio >= 0.7) return 'warning';
  return 'safe';
}

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function recalculateTodaySpend(transactions: Transaction[], today: string): number {
  return transactions
    .filter((tx) => tx.occurred_at.startsWith(today))
    .reduce((sum, tx) => {
      if (tx.type === 'expense') {
        return sum + tx.amount;
      } else {
        return sum - tx.amount;
      }
    }, 0);
}

// Supabase 동기화 재시도 로직
async function syncWithRetry(syncFn: () => Promise<void>, maxRetries = 3): Promise<void> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await syncFn();
      return; // 성공 시 종료
    } catch (err) {
      console.error(`[Sync] Attempt ${attempt + 1} failed:`, err);
      if (attempt === maxRetries - 1) {
        console.error('[Sync] All retry attempts failed');
        return;
      }
      // 지수 백오프: 1초, 2초, 4초
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),

      // Island (일일 모델)
      today_spend: 0,
      last_spend_date: getTodayString(),
      island_status: 'safe',
      island_exp: 0,
      island_level: 0,
      justLeveledUp: false,
      currentStreak: 0,
      bestStreak: 0,
      lastStreakUpdatedDate: '',
      streakRewards: {
        threeDaysUnlocked: false,
        sevenDaysUnlocked: false,
      },
      justStreakReward: null,
      resetSpend: () => set({ today_spend: 0, island_status: 'safe' }),

      // Transactions
      transactions: [],
      addTransaction: (tx) => {
        get().ensureTodayReset();
        
        const newTx: Transaction = {
          ...tx,
          id: crypto.randomUUID(),
          occurred_at: new Date().toISOString(),
        };
        
        const { today_spend, user } = get();
        if (!user) return;

        let newSpend = today_spend;
        if (tx.type === 'expense') {
          newSpend += tx.amount;
        } else {
          newSpend = Math.max(0, newSpend - tx.amount);
        }

        const dailyBudget = user.budget_limit / 30;
        const ratio = newSpend / dailyBudget;
        const newStatus = calculateStatus(ratio);

        set((state) => ({
          transactions: [newTx, ...state.transactions].slice(0, 200),
          today_spend: newSpend,
          island_status: newStatus,
          isQuizOpen: newStatus === 'sunk',
        }));

        // 재시도 로직과 함께 동기화 호출 (비동기, 블로킹 안 함)
        setTimeout(() => syncWithRetry(() => get().syncToSupabase()), 0);
      },

      updateTransaction: (id, updates) => {
        const { transactions } = get();
        const updatedTransactions = transactions.map((tx) =>
          tx.id === id ? { ...tx, ...updates } : tx
        );
        set({ transactions: updatedTransactions });
      },

      deleteTransaction: (id) => {
        const { transactions } = get();
        const txToDelete = transactions.find((tx) => tx.id === id);
        if (!txToDelete) return;

        const updatedTransactions = transactions.filter((tx) => tx.id !== id);
        set({ transactions: updatedTransactions });

        // 오늘 거래였으면 today_spend 재계산
        const today = getTodayString();
        if (txToDelete.occurred_at.startsWith(today)) {
          const newTodaySpend = recalculateTodaySpend(updatedTransactions, today);
          const { user } = get();
          if (user) {
            const dailyBudget = user.budget_limit / 30;
            const ratio = newTodaySpend / dailyBudget;
            set({
              today_spend: newTodaySpend,
              island_status: calculateStatus(ratio),
            });
          }
        }
      },

      // UI
      isQuizOpen: false,
      setQuizOpen: (open) => set({ isQuizOpen: open }),
      lastMessage: '',
      setLastMessage: (msg) => set({ lastMessage: msg }),
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),

      // Computed
      getDailyBudget: () => {
        const { user } = get();
        if (!user) return 0;
        return Math.floor(user.budget_limit / 30);
      },
      getRatio: () => {
        const { today_spend, user } = get();
        if (!user) return 0;
        const dailyBudget = Math.floor(user.budget_limit / 30);
        if (dailyBudget === 0) return 0;
        return today_spend / dailyBudget;
      },
      getWaterLevel: () => {
        return Math.min(get().getRatio() * 100, 100);
      },
      getRemainingBudget: () => {
        const { today_spend, user } = get();
        if (!user) return 0;
        const dailyBudget = Math.floor(user.budget_limit / 30);
        return Math.max(0, dailyBudget - today_spend);
      },
      getIslandLevelInfo: () => {
        return getNextLevelInfo(get().island_exp);
      },

      // Actions
      restoreIsland: () => {
        const { user } = get();
        if (!user) return;
        const dailyBudget = user.budget_limit / 30;
        const newSpend = Math.floor(dailyBudget * 0.7);
        set({
          today_spend: newSpend,
          island_status: 'warning',
          isQuizOpen: false,
        });
      },
      checkAndUpdateStatus: () => {
        const { today_spend, user } = get();
        if (!user) return;
        const dailyBudget = user.budget_limit / 30;
        const ratio = today_spend / dailyBudget;
        set({ island_status: calculateStatus(ratio) });
      },
      clearLevelUp: () => set({ justLeveledUp: false }),
      clearStreakReward: () => set({ justStreakReward: null }),

      // Supabase 동기화
      lastSyncedAt: null,
      syncToSupabase: async () => {
        if (!isSupabaseEnabled) return;
        
        const supabase = getSupabase();
        if (!supabase) return;
        
        const { user, island_level, island_exp, currentStreak, bestStreak, transactions } = get();
        if (!user) return;
        
        try {
          // 최근 7일 거래 기반 실제 절약률 계산
          const now = Date.now();
          const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
          
          const last7DaysTransactions = transactions.filter(tx => {
            const txDate = new Date(tx.occurred_at).getTime();
            return txDate >= sevenDaysAgo;
          });
          
          // 7일 동안의 평균 일일 지출
          const totalSpend = last7DaysTransactions.reduce((sum, tx) => {
            return sum + (tx.type === 'expense' ? tx.amount : -tx.amount);
          }, 0);
          
          const dailyBudget = user.budget_limit / 30;
          const avgDailySpend = last7DaysTransactions.length > 0 
            ? totalSpend / 7 
            : dailyBudget; // 거래 없으면 예산과 동일하다고 가정
          
          // 절약률 = (예산 - 실제지출) / 예산 * 100
          const savingsRate = Math.max(0, Math.min(100, 
            ((dailyBudget - avgDailySpend) / dailyBudget) * 100
          ));
          
          const islandData = {
            user_id: user.id,
            nickname: user.nickname,
            budget_limit: user.budget_limit,
            island_level,
            island_exp,
            current_streak: currentStreak,
            best_streak: bestStreak,
            total_saved_days: island_exp, // EXP = 누적 절약 일수
            savings_rate: savingsRate,
            last_synced_at: new Date().toISOString(),
          };
          
          // upsert (insert or update)
          const { error } = await supabase
            .from('user_islands' as any)
            .upsert(islandData as any, { onConflict: 'user_id' });
          
          if (error) {
            console.error('[Supabase] Sync failed:', error);
            throw error; // 재시도를 위해 에러 던지기
          } else {
            set({ lastSyncedAt: new Date().toISOString() });
            console.log('[Supabase] Synced successfully');
          }
        } catch (err) {
          console.error('[Supabase] Sync error:', err);
          throw err; // 재시도 로직에서 처리
        }
      },

      ensureTodayReset: () => {
        const today = getTodayString();
        const {
          last_spend_date,
          today_spend,
          user,
          island_exp,
          island_level,
          currentStreak,
          bestStreak,
          lastStreakUpdatedDate,
          streakRewards,
        } = get();
        if (last_spend_date !== today) {
          // 날짜 차이 계산
          const lastDate = new Date(last_spend_date);
          const todayDate = new Date(today);
          const diffDays = Math.floor(
            (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          // 전날 예산 내 소비였으면 EXP +1
          let newExp = island_exp;
          let newLevel = island_level;
          let leveledUp = false;
          let newStreak = currentStreak;
          let newBestStreak = bestStreak;
          let newStreakRewards = streakRewards;
          let justStreakReward: '3' | '7' | null = null;

          if (user && diffDays === 1) {
            const dailyBudget = user.budget_limit / 30;
            const yesterdayRatio = dailyBudget > 0 ? today_spend / dailyBudget : 0;
            if (yesterdayRatio < 1) {
              newExp = island_exp + 1;
              newLevel = calculateIslandLevel(newExp);
              leveledUp = newLevel > island_level;

              // 스트릭 증가
              if (lastStreakUpdatedDate !== last_spend_date) {
                newStreak = currentStreak + 1;
                newBestStreak = Math.max(bestStreak, newStreak);
              }
            } else {
              // 예산 초과 시 스트릭 리셋
              if (lastStreakUpdatedDate !== last_spend_date) {
                newStreak = 0;
              }
            }
          } else if (!isNaN(diffDays) && diffDays >= 2) {
            // 중간에 아예 방문하지 않은 날이 있는 경우 스트릭 리셋
            newStreak = 0;
          }

          // 스트릭 보상 체크 (3일 / 7일)
          if (newStreak === 3 && !streakRewards.threeDaysUnlocked) {
            newStreakRewards = {
              ...streakRewards,
              threeDaysUnlocked: true,
            };
            justStreakReward = '3';
          }
          if (newStreak === 7 && !streakRewards.sevenDaysUnlocked) {
            newStreakRewards = {
              ...newStreakRewards,
              sevenDaysUnlocked: true,
            };
            justStreakReward = '7';
          }
          set({
            today_spend: 0,
            last_spend_date: today,
            island_status: 'safe',
            island_exp: newExp,
            island_level: newLevel,
            justLeveledUp: leveledUp,
            currentStreak: newStreak,
            bestStreak: newBestStreak,
            lastStreakUpdatedDate: last_spend_date,
            streakRewards: newStreakRewards,
            justStreakReward,
          });

          // 날짜 리셋 후 동기화 (비동기, 블로킹 안 함)
          setTimeout(() => syncWithRetry(() => get().syncToSupabase()), 0);
        }
      },
    }),
    {
      name: 'ggumjisum-storage',
      partialize: (state) => ({
        user: state.user,
        today_spend: state.today_spend,
        last_spend_date: state.last_spend_date,
        island_status: state.island_status,
        island_exp: state.island_exp,
        island_level: state.island_level,
        currentStreak: state.currentStreak,
        bestStreak: state.bestStreak,
        lastStreakUpdatedDate: state.lastStreakUpdatedDate,
        streakRewards: state.streakRewards,
        lastSyncedAt: state.lastSyncedAt,
        transactions: state.transactions,
      }),
    }
  )
);
