'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Flame, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSupabase, UserIsland } from '@/lib/supabase';
import { useStore, ISLAND_LEVELS } from '@/store/useStore';

type LeaderboardTab = 'level' | 'streak' | 'savings';

export default function LeaderboardPage() {
  const router = useRouter();
  const { user } = useStore();
  const [tab, setTab] = useState<LeaderboardTab>('level');
  const [islands, setIslands] = useState<UserIsland[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [tab]);

  const loadLeaderboard = async () => {
    setLoading(true);
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      let query = supabase.from('user_islands').select('*');
      
      // 탭에 따라 정렬 기준 변경
      if (tab === 'level') {
        query = query.order('island_level', { ascending: false })
                     .order('island_exp', { ascending: false });
      } else if (tab === 'streak') {
        query = query.order('best_streak', { ascending: false });
      } else if (tab === 'savings') {
        query = query.order('savings_rate', { ascending: false });
      }
      
      query = query.limit(50);
      
      const { data, error } = await query;
      
      if (error) throw error;
      setIslands(data || []);
    } catch (err) {
      console.error('[Leaderboard] Load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) {
      return (
        <motion.span
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl"
        >
          👑
        </motion.span>
      );
    }
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="text-sm font-semibold text-gray-600">{rank}위</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-200">
      <div className="max-w-md mx-auto min-h-screen bg-gradient-to-b from-sky-100 to-blue-200 pb-4">
        {/* Header */}
        <header className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          리더보드
        </h1>
        <div className="w-10" />
      </header>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="bg-white/60 backdrop-blur rounded-full p-1 flex gap-1">
          <button
            onClick={() => setTab('level')}
            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === 'level'
                ? 'bg-purple-500 text-white'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            섬 레벨
          </button>
          <button
            onClick={() => setTab('streak')}
            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === 'streak'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            최고 스트릭
          </button>
          <button
            onClick={() => setTab('savings')}
            className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === 'savings'
                ? 'bg-emerald-500 text-white'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            절약률
          </button>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="px-4 space-y-2">
        {loading ? (
          <div className="text-center py-8 text-gray-600">로딩 중...</div>
        ) : islands.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            아직 데이터가 없습니다
          </div>
        ) : (
          islands.map((island, idx) => {
            const isMe = user?.id === island.user_id;
            const rank = idx + 1;
            
            return (
              <motion.div
                key={island.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-white/80 backdrop-blur rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:bg-white/90 transition ${
                  isMe ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => router.push(`/island/${island.user_id}`)}
              >
                <div className="w-12 flex items-center justify-center">
                  {getRankIcon(rank)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-800">
                      {island.nickname}
                      {isMe && <span className="text-xs text-purple-600 ml-1">(나)</span>}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">
                    Lv.{island.island_level} {ISLAND_LEVELS[island.island_level]?.name}
                  </p>
                </div>
                <div className="text-right">
                  {tab === 'level' && (
                    <div>
                      <p className="text-lg font-bold text-purple-700">
                        Lv.{island.island_level}
                      </p>
                      <p className="text-xs text-gray-500">
                        EXP {island.island_exp}
                      </p>
                    </div>
                  )}
                  {tab === 'streak' && (
                    <div>
                      <p className="text-lg font-bold text-orange-600 flex items-center justify-end">
                        <Flame className="w-4 h-4 mr-1" />
                        {island.best_streak}일
                      </p>
                    </div>
                  )}
                  {tab === 'savings' && (
                    <div>
                      <p className="text-lg font-bold text-emerald-600 flex items-center justify-end">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {island.savings_rate.toFixed(0)}%
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
      </div>
    </div>
  );
}
