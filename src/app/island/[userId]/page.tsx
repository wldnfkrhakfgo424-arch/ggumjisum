'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Eye, Heart, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSupabase, UserIsland } from '@/lib/supabase';
import { ISLAND_LEVELS, useStore } from '@/store/useStore';

interface IslandTip {
  id: string;
  from_user_id: string;
  tip_text: string;
  created_at: string;
}

export default function VisitIslandPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const { user } = useStore();
  
  const [island, setIsland] = useState<UserIsland | null>(null);
  const [tips, setTips] = useState<IslandTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [cheered, setCheered] = useState(false);
  const [tipText, setTipText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadIsland();
    loadTips();
  }, [userId]);

  const loadIsland = async () => {
    setLoading(true);
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_islands')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      setIsland(data);
    } catch (err) {
      console.error('[Visit] Load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTips = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('island_tips' as any)
        .select('*')
        .eq('to_user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      setTips(data || []);
    } catch (err) {
      console.error('[Visit] Load tips failed:', err);
    }
  };

  const handleSendTip = async () => {
    if (!tipText.trim() || !user) return;
    
    setSending(true);
    const supabase = getSupabase();
    if (!supabase) {
      setSending(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('island_tips' as any)
        .insert({
          from_user_id: user.id,
          to_user_id: userId,
          tip_text: tipText.trim(),
        } as any);
      
      if (error) throw error;
      
      setTipText('');
      loadTips(); // 새로고침
      alert('팁을 전달했어요! 💡');
    } catch (err) {
      console.error('[Visit] Send tip failed:', err);
      alert('팁 전달에 실패했어요 😢');
    } finally {
      setSending(false);
    }
  };

  const handleCheer = () => {
    setCheered(true);
    setTimeout(() => setCheered(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-blue-200">
        <div className="max-w-md mx-auto">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!island) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-blue-200">
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-600 mb-4">섬을 찾을 수 없습니다</p>
          <Button onClick={() => router.back()}>돌아가기</Button>
        </div>
      </div>
    );
  }

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
        <div className="text-center">
          <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2 justify-center">
            <Eye className="w-4 h-4" />
            {island.nickname}의 섬
          </h1>
          <p className="text-xs text-gray-600">
            Lv.{island.island_level} {ISLAND_LEVELS[island.island_level]?.name}
          </p>
        </div>
        <div className="w-10" />
      </header>

      {/* Island Stats */}
      <div className="px-4 mb-4">
        <div className="bg-white/60 backdrop-blur rounded-xl p-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600">섬 레벨</p>
            <p className="text-lg font-bold text-purple-700">
              Lv.{island.island_level}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">최고 스트릭</p>
            <p className="text-lg font-bold text-orange-600">
              {island.best_streak}일
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">절약률</p>
            <p className="text-lg font-bold text-emerald-600">
              {island.savings_rate.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Island Visualizer (Simple Version) */}
      <div className="px-4 mb-4">
        <div className="relative">
          <div className="bg-white/60 backdrop-blur rounded-2xl p-8 text-center">
            <p className="text-7xl mb-4">
              {island.island_level === 0 && '🏝️'}
              {island.island_level === 1 && '⛺'}
              {island.island_level === 2 && '🏠'}
              {island.island_level === 3 && '🏡'}
              {island.island_level === 4 && '🏘️'}
            </p>
            <p className="text-gray-700 font-semibold">
              {island.nickname}님의 {ISLAND_LEVELS[island.island_level]?.name}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              누적 {island.total_saved_days}일 동안 절약 중
            </p>
          </div>
        </div>
      </div>

      {/* Achievement Info */}
      <div className="px-4 mb-4">
        <div className="bg-white/60 backdrop-blur rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            성과 정보
          </h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>누적 절약 일수: {island.total_saved_days}일</li>
            <li>현재 연속 스트릭: {island.current_streak}일</li>
            <li>최고 연속 스트릭: {island.best_streak}일</li>
            <li>최근 7일 평균 절약률: {island.savings_rate.toFixed(1)}%</li>
          </ul>
        </div>
      </div>

      {/* Saving Tips */}
      <div className="px-4 mb-4">
        <div className="bg-white/60 backdrop-blur rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            💡 받은 절약 팁
          </h3>
          {tips.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">
              아직 받은 팁이 없어요
            </p>
          ) : (
            <div className="space-y-2">
              {tips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-gray-700"
                >
                  {tip.tip_text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Send Tip */}
      <div className="px-4 mb-4">
        <div className="bg-white/60 backdrop-blur rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            💬 절약 팁 남기기
          </h3>
          <div className="space-y-2">
            <textarea
              value={tipText}
              onChange={(e) => setTipText(e.target.value)}
              placeholder="이 섬 주인에게 도움이 될 절약 팁을 공유해보세요..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              maxLength={200}
            />
            <Button
              onClick={handleSendTip}
              disabled={!tipText.trim() || sending}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {sending ? '전송 중...' : '팁 전달하기'}
            </Button>
          </div>
        </div>
      </div>

      {/* Cheer Button */}
      <div className="px-4">
        <Button
          onClick={handleCheer}
          disabled={cheered}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
        >
          <Heart className={`w-4 h-4 mr-2 ${cheered ? 'fill-white' : ''}`} />
          {cheered ? '응원했어요! 🎉' : '응원하기'}
        </Button>
      </div>
      </div>
    </div>
  );
}
