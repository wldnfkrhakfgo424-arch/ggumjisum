'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, RotateCcw, Trophy, Send } from 'lucide-react';
import { IslandVisualizer } from '@/features/island/IslandVisualizer';
import { NeighborIslands } from '@/features/island/NeighborIslands';
import { RescueQuizModal } from '@/features/rescue/RescueQuizModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore, ISLAND_LEVELS } from '@/store/useStore';
import { categoryEmoji } from '@/utils/mock-nlp';

export default function IslandPage() {
  const router = useRouter();
  const {
    user,
    transactions,
    resetSpend,
    setUser,
    getDailyBudget,
    getRemainingBudget,
    island_level,
    getIslandLevelInfo,
    currentStreak,
    bestStreak,
    streakRewards,
    syncToSupabase,
    addTransaction,
    isLoading,
    setLoading,
    island_status,
  } = useStore();

  // Redirect to onboarding if no user
  useEffect(() => {
    if (!user) {
      router.replace('/onboarding');
    }
  }, [user, router]);

  // 앱 시작 시 Supabase 동기화
  useEffect(() => {
    if (user) {
      syncToSupabase().catch(err => {
        console.error('[Island] Initial sync failed:', err);
      });
    }
  }, [user, syncToSupabase]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-blue-200">
        <p>로딩 중...</p>
      </div>
    );
  }

  const handleReset = () => {
    if (confirm('정말 데이터를 초기화하시겠어요?')) {
      resetSpend();
      setUser(null);
      router.replace('/onboarding');
    }
  };

  const [input, setInput] = useState('');

  // 최근 기록 1개만
  const recentTransactions = transactions.slice(0, 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || island_status === 'sunk') return;

    const userInput = input.trim();
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userInput }),
      });

      if (!response.ok) throw new Error('Parse failed');

      const parsed = await response.json();

      if (parsed.error || parsed.needs_clarification) {
        alert('🤔 금액을 이해하지 못했어요. "스타벅스 5000원" 처럼 말해주세요!');
        setLoading(false);
        return;
      }

      addTransaction({
        type: parsed.type,
        amount: parsed.amount,
        category: parsed.category,
        description: parsed.description,
        original_input: userInput,
      });
    } catch (error) {
      console.error('Parse error:', error);
      alert('⚠️ 오류가 발생했어요. 다시 시도해주세요!');
    }

    setLoading(false);
  };
  const dailyBudget = getDailyBudget();
  const remainingBudget = getRemainingBudget();
  const levelInfo = getIslandLevelInfo();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-200">
      <div className="max-w-md mx-auto min-h-screen bg-gradient-to-b from-sky-100 to-blue-200 pb-4">
        {/* Header */}
        <header className="flex items-center justify-between p-4">
        <div className="space-y-1">
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              {user.nickname}의 섬 🏝️
            </h1>
            <p className="text-xs text-gray-600">
              오늘 남은 예산: {Math.floor(remainingBudget).toLocaleString()}원
            </p>
          </div>
          {/* 섬 레벨 / EXP / 스트릭 */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-white/60 backdrop-blur rounded-full px-3 py-1 inline-flex items-center gap-2">
              <span className="text-[10px] font-semibold text-purple-700">
                Lv.{island_level} {ISLAND_LEVELS[island_level]?.name}
              </span>
              {levelInfo.next && (
                <>
                  <div className="w-20 h-1.5 bg-purple-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                      style={{ width: `${Math.min(levelInfo.progress * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-600">
                    다음 단계까지 {levelInfo.remaining}일
                  </span>
                </>
              )}
              {!levelInfo.next && (
                <span className="text-[10px] text-emerald-600">
                  최종 단계 섬이에요 🎉
                </span>
              )}
            </div>
            <div
              className={`rounded-full px-3 py-1 inline-flex items-center gap-2 text-[10px] ${
                currentStreak >= 7
                  ? 'bg-orange-100 text-orange-700'
                  : currentStreak >= 3
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span>
                {currentStreak >= 7
                  ? '🔥'
                  : currentStreak >= 3
                  ? '🌟'
                  : '📅'}
              </span>
              <span>연속 절약 {currentStreak}일</span>
              {bestStreak > 0 && (
                <span className="opacity-70">
                  최고 {bestStreak}일
                </span>
              )}
              {(streakRewards.threeDaysUnlocked || streakRewards.sevenDaysUnlocked) && (
                <span className="opacity-70">
                  {streakRewards.sevenDaysUnlocked ? '스트릭 장식 2개 보유' : '스트릭 장식 1개 보유'}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/leaderboard')}
          >
            <Trophy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/history')}
          >
            <BookOpen className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Island */}
      <main className="px-4 space-y-2">
        <div className="relative min-h-[400px]">
          <IslandVisualizer />
          <NeighborIslands />
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur rounded-xl p-3 shadow">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={island_status === 'sunk' ? '퀴즈를 먼저 풀어주세요!' : '수입-지출 입력하기'}
              disabled={isLoading || island_status === 'sunk'}
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim() || island_status === 'sunk'}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* Recent Transactions - 직전 1개만 */}
        {recentTransactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 backdrop-blur rounded-xl p-3"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">최근 기록</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/history')}
                className="h-7 text-xs"
              >
                전체보기
              </Button>
            </div>
            <div className="space-y-1">
              {recentTransactions.map((tx) => {
                const emoji = categoryEmoji[tx.category] || '💸';
                const isIncome = tx.type === 'income';
                return (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center text-sm py-1"
                  >
                    <div className="flex items-center gap-2">
                      <span>{emoji}</span>
                      <span className="text-gray-600">{tx.description}</span>
                    </div>
                    <span
                      className={`font-medium ${
                        isIncome ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {tx.amount.toLocaleString()}원
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

      </main>

      {/* Quiz Modal */}
      <RescueQuizModal />
      </div>
    </div>
  );
}
