'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getSupabase, isSupabaseEnabled, type UserIsland } from '@/lib/supabase';
import { useStore } from '@/store/useStore';

export function NeighborIslands() {
  const router = useRouter();
  const { user } = useStore();
  const [neighbors, setNeighbors] = useState<UserIsland[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNeighbors();
  }, [user]);

  const loadNeighbors = async () => {
    if (!isSupabaseEnabled || !user) {
      console.log('[NeighborIslands] Supabase not enabled or no user');
      setLoading(false);
      return;
    }

    try {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data, error } = await supabase
        .from('user_islands')
        .select('*')
        .neq('user_id', user.id) // 내 섬 제외
        .order('island_level', { ascending: false })
        .limit(4); // 최대 4개

      if (error) throw error;
      console.log('[NeighborIslands] Loaded neighbors:', data?.length);
      setNeighbors(data || []);
    } catch (err) {
      console.error('[NeighborIslands] Failed to load:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (neighbors.length === 0) {
    console.log('[NeighborIslands] No neighbors found');
    return null;
  }

  // 고정 위치: 왼쪽 하단에 가로 한 줄로 배치 (일정한 간격)
  const getFixedPosition = (index: number) => {
    const startLeft = 3; // 시작 위치
    const gap = 11; // 일정한 간격
    return {
      bottom: '15%',
      left: `${-1 + index * gap}%`, // 3%, 14%, 25%, 36%
    };
  };

  return (
    <>
      {neighbors.map((neighbor, index) => {
        const position = getFixedPosition(index);
        
        return (
          <motion.div
            key={neighbor.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.15 }}
            transition={{ 
              opacity: { duration: 0.3, delay: index * 0.1 },
              scale: { duration: 0.2 }
            }}
            className="absolute cursor-pointer group z-20"
            style={position}
            onClick={() => router.push(`/island/${neighbor.user_id}`)}
        >
          <div className="relative flex flex-col items-center">
            {/* 섬 아이콘 - 크고 명확하게 */}
            <div className="text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform">
              {neighbor.island_level >= 4 ? '🏘️' :
               neighbor.island_level >= 3 ? '🏠' :
               neighbor.island_level >= 2 ? '🏕️' :
               neighbor.island_level >= 1 ? '⛺' : '🏝️'}
            </div>
            
            {/* 이름표 - 호버 시에만 선명하게 */}
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-white/95 backdrop-blur rounded-full px-1 py-1 text-xs text-small text-gray-800 shadow-lg whitespace-nowrap border-1 border-blue-200">
                {neighbor.nickname} Lv.{neighbor.island_level}
              </div>
            </div>
          </div>
          </motion.div>
        );
      })}
    </>
  );
}
