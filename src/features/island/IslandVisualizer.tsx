'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, ISLAND_LEVELS } from '@/store/useStore';
import { IslandCharacter } from './IslandCharacter';

// 날씨 상태에 따른 색상
const weatherColors = {
  sunny: {
    sky: ['#87CEEB', '#E0F7FA'],
    water: '#4FC3F7',
  },
  cloudy: {
    sky: ['#90A4AE', '#CFD8DC'],
    water: '#78909C',
  },
  storm: {
    sky: ['#37474F', '#546E7A'],
    water: '#455A64',
  },
  sunk: {
    sky: ['#1a1a2e', '#16213e'],
    water: '#0f3460',
  },
};

function getWeather(ratio: number) {
  if (ratio >= 1) return 'sunk';
  if (ratio >= 0.7) return 'storm';
  if (ratio >= 0.4) return 'cloudy';
  return 'sunny';
}

// 공통 섬 베이스 (모래/땅)
function IslandBase() {
  return (
    <>
      <rect x="30" y="50" width="60" height="20" fill="#D4A574" />
      <rect x="25" y="55" width="70" height="15" fill="#C4956A" />
      <rect x="20" y="60" width="80" height="15" fill="#B8865A" />
      {/* 모래 디테일 */}
      <circle cx="40" cy="62" r="1" fill="#E8D4B8" />
      <circle cx="70" cy="65" r="1.5" fill="#E8D4B8" />
      <circle cx="55" cy="68" r="1" fill="#E8D4B8" />
    </>
  );
}

// 공통 야자수
function PalmTree() {
  return (
    <>
      <rect x="55" y="25" width="10" height="30" fill="#8B4513" />
      <rect x="57" y="20" width="6" height="10" fill="#9B5523" />
      <polygon points="60,10 45,25 55,22" fill="#228B22" />
      <polygon points="60,10 75,25 65,22" fill="#228B22" />
      <polygon points="60,8 50,18 58,18" fill="#32CD32" />
      <polygon points="60,8 70,18 62,18" fill="#32CD32" />
      <polygon points="60,5 55,15 65,15" fill="#3CB371" />
      <circle cx="58" cy="22" r="3" fill="#8B4513" />
      <circle cx="64" cy="24" r="2.5" fill="#8B4513" />
    </>
  );
}

// Lv.0 무인도: 빈 섬 + 야자수 + 풀
function IslandLevel0() {
  return (
    <>
      <IslandBase />
      <PalmTree />
      <ellipse cx="35" cy="52" rx="8" ry="5" fill="#228B22" />
      <ellipse cx="85" cy="54" rx="6" ry="4" fill="#2E8B57" />
    </>
  );
}

// Lv.1 텐트: + 텐트 + 모닥불
function IslandLevel1() {
  return (
    <>
      <IslandBase />
      <PalmTree />
      <ellipse cx="35" cy="52" rx="8" ry="5" fill="#228B22" />
      <ellipse cx="85" cy="54" rx="6" ry="4" fill="#2E8B57" />
      {/* 텐트 */}
      <polygon points="30,52 38,38 46,52" fill="#E67E22" />
      <polygon points="30,52 38,38 38,52" fill="#D35400" />
      <rect x="35" y="46" width="6" height="6" fill="#4A3728" />
      {/* 모닥불 */}
      <circle cx="80" cy="56" r="3" fill="#8B4513" />
      <circle cx="77" cy="56" r="1.5" fill="#6D3A1A" />
      <circle cx="83" cy="56" r="1.5" fill="#6D3A1A" />
      {/* 불꽃 */}
      <ellipse cx="80" cy="52" rx="2" ry="4" fill="#FF6600" />
      <ellipse cx="80" cy="53" rx="1.2" ry="2.5" fill="#FFD700" />
      <ellipse cx="80" cy="54" rx="0.6" ry="1.2" fill="#FFFF00" />
    </>
  );
}

// Lv.2 오두막: + 오두막 + 울타리 + 깃발
function IslandLevel2() {
  return (
    <>
      <IslandBase />
      <PalmTree />
      <ellipse cx="85" cy="54" rx="6" ry="4" fill="#2E8B57" />
      {/* 오두막 */}
      <rect x="26" y="42" width="22" height="14" fill="#A0522D" />
      <polygon points="24,42 37,30 50,42" fill="#8B0000" />
      <rect x="32" y="46" width="6" height="10" fill="#4A3728" />
      {/* 창문 */}
      <rect x="40" y="44" width="5" height="5" fill="#87CEEB" />
      <rect x="41" y="45" width="1.5" height="3" fill="#6B4226" />
      <rect x="40.5" y="45.5" width="4" height="1" fill="#6B4226" />
      {/* 울타리 */}
      <rect x="50" y="52" width="2" height="6" fill="#DEB887" />
      <rect x="55" y="52" width="2" height="6" fill="#DEB887" />
      <rect x="60" y="52" width="2" height="6" fill="#DEB887" />
      <rect x="49" y="53" width="14" height="1.5" fill="#DEB887" />
      <rect x="49" y="56" width="14" height="1.5" fill="#DEB887" />
      {/* 깃발 */}
      <rect x="90" y="38" width="2" height="20" fill="#8B4513" />
      <polygon points="92,38 105,42 92,46" fill="#FF4444" />
    </>
  );
}

// Lv.3 작은 집: + 나무집 + 우물 + 꽃밭
function IslandLevel3() {
  return (
    <>
      <IslandBase />
      <PalmTree />
      {/* 나무집 */}
      <rect x="24" y="38" width="26" height="18" fill="#CD853F" />
      <polygon points="22,38 37,26 52,38" fill="#A0522D" />
      {/* 굴뚝 */}
      <rect x="42" y="28" width="5" height="10" fill="#696969" />
      <rect x="41" y="26" width="7" height="3" fill="#808080" />
      {/* 문 */}
      <rect x="32" y="44" width="8" height="12" fill="#6B4226" />
      <circle cx="38" cy="50" r="1" fill="#FFD700" />
      {/* 창문 2개 */}
      <rect x="26" y="42" width="5" height="5" fill="#87CEEB" />
      <rect x="43" y="42" width="5" height="5" fill="#87CEEB" />
      <rect x="27.5" y="43" width="0.8" height="3" fill="#6B4226" />
      <rect x="26.5" y="43.5" width="4" height="0.8" fill="#6B4226" />
      {/* 우물 */}
      <ellipse cx="80" cy="54" rx="6" ry="3" fill="#808080" />
      <ellipse cx="80" cy="53" rx="5" ry="2.5" fill="#404040" />
      <rect x="77" y="46" width="2" height="8" fill="#8B4513" />
      <rect x="81" y="46" width="2" height="8" fill="#8B4513" />
      <rect x="76" y="45" width="8" height="2" fill="#8B4513" />
      {/* 꽃밭 */}
      <circle cx="64" cy="54" r="2" fill="#FF69B4" />
      <circle cx="68" cy="55" r="1.8" fill="#FFB6C1" />
      <circle cx="72" cy="54" r="2" fill="#FF1493" />
      <circle cx="66" cy="57" r="1.5" fill="#FF69B4" />
      <circle cx="70" cy="56.5" r="1.8" fill="#FFB6C1" />
      {/* 꽃 줄기 */}
      <rect x="63.5" y="54" width="0.8" height="4" fill="#228B22" />
      <rect x="67.5" y="55" width="0.8" height="3" fill="#228B22" />
      <rect x="71.5" y="54" width="0.8" height="4" fill="#228B22" />
    </>
  );
}

// Lv.4 마을: + 집 + 등대 + 보트 + 정원
function IslandLevel4() {
  return (
    <>
      {/* 확장된 섬 베이스 */}
      <rect x="15" y="48" width="90" height="22" fill="#D4A574" />
      <rect x="10" y="53" width="100" height="17" fill="#C4956A" />
      <rect x="5" y="58" width="110" height="17" fill="#B8865A" />
      <circle cx="30" cy="62" r="1" fill="#E8D4B8" />
      <circle cx="60" cy="65" r="1.5" fill="#E8D4B8" />
      <circle cx="90" cy="63" r="1" fill="#E8D4B8" />

      <PalmTree />

      {/* 집 (큰 버전) */}
      <rect x="22" y="36" width="28" height="18" fill="#CD853F" />
      <polygon points="20,36 36,24 52,36" fill="#A0522D" />
      <rect x="40" y="26" width="5" height="10" fill="#696969" />
      <rect x="39" y="24" width="7" height="3" fill="#808080" />
      <rect x="31" y="42" width="8" height="12" fill="#6B4226" />
      <circle cx="37" cy="48" r="1" fill="#FFD700" />
      <rect x="24" y="40" width="5" height="5" fill="#87CEEB" />
      <rect x="43" y="40" width="5" height="5" fill="#87CEEB" />

      {/* 등대 */}
      <rect x="93" y="22" width="10" height="32" fill="#FFFFFF" />
      <rect x="93" y="22" width="10" height="5" fill="#FF0000" />
      <rect x="93" y="32" width="10" height="5" fill="#FF0000" />
      <rect x="93" y="42" width="10" height="5" fill="#FF0000" />
      {/* 등대 빛 */}
      <polygon points="91,20 98,18 105,20 98,22" fill="#FFD700" />
      <rect x="95" y="16" width="6" height="6" fill="#FFFF00" opacity="0.7" />
      <circle cx="98" cy="19" r="2" fill="#FFFFFF" />

      {/* 보트 (물 위) */}
      <ellipse cx="10" cy="68" rx="10" ry="3" fill="#8B4513" />
      <polygon points="10,62 10,68 6,68" fill="#FFFFFF" />
      <rect x="9" y="58" width="2" height="10" fill="#A0522D" />
      <polygon points="11,58 11,66 18,62" fill="#EEEEEE" />

      {/* 정원 */}
      <rect x="56" y="52" width="20" height="1" fill="#8B4513" />
      <ellipse cx="60" cy="50" rx="3" ry="4" fill="#228B22" />
      <ellipse cx="66" cy="49" rx="3.5" ry="4.5" fill="#2E8B57" />
      <ellipse cx="72" cy="50" rx="3" ry="4" fill="#228B22" />
      {/* 꽃 */}
      <circle cx="60" cy="48" r="1.5" fill="#FF69B4" />
      <circle cx="66" cy="47" r="1.5" fill="#FFD700" />
      <circle cx="72" cy="48" r="1.5" fill="#FF1493" />
      {/* 돌담 길 */}
      <circle cx="53" cy="56" r="1.5" fill="#A9A9A9" />
      <circle cx="56" cy="57" r="1.5" fill="#A9A9A9" />
      <circle cx="53" cy="59" r="1.5" fill="#A9A9A9" />
      <circle cx="56" cy="60" r="1.5" fill="#A9A9A9" />
    </>
  );
}

const islandComponents = [IslandLevel0, IslandLevel1, IslandLevel2, IslandLevel3, IslandLevel4];

function PixelIsland({ sunk, level }: { sunk: boolean; level: number }) {
  const IslandSVG = islandComponents[Math.min(level, 4)];
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      <IslandSVG />
      {sunk && (
        <motion.rect
          x="0"
          y="0"
          width="120"
          height="80"
          fill="rgba(15, 52, 96, 0.6)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </svg>
  );
}

interface IslandVisualizerProps {
  onCharacterClick?: () => void;
}

export function IslandVisualizer({ onCharacterClick }: IslandVisualizerProps = {}) {
  const {
    getRatio,
    island_status,
    today_spend,
    user,
    getDailyBudget,
    getRemainingBudget,
    island_level,
    getIslandLevelInfo,
    justLeveledUp,
    clearLevelUp,
    justStreakReward,
    clearStreakReward,
    streakRewards,
  } = useStore();
  const ratio = getRatio();
  const waterLevel = Math.min(ratio * 100, 100);
  const weather = getWeather(ratio);
  const colors = weatherColors[weather];
  const isSunk = island_status === 'sunk';
  const dailyBudget = getDailyBudget();
  const remainingBudget = getRemainingBudget();
  const levelInfo = getIslandLevelInfo();

  // 남은 시간 계산 (경고용)
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    if (ratio < 0.7) {
      setTimeLeft('');
      return;
    }
    
    const updateTime = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${hours}시간 ${minutes}분`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, [ratio]);

  // 70% 경고 표시 관리
  const [showBigWarning, setShowBigWarning] = useState(false);
  const [hasShownWarning70, setHasShownWarning70] = useState(false);
  
  useEffect(() => {
    // 70% 미만으로 떨어지면 리셋
    if (ratio < 0.7) {
      setHasShownWarning70(false);
      setShowBigWarning(false);
      return;
    }
    
    // 70% 이상이고 아직 경고를 보여주지 않았다면
    if (ratio >= 0.7 && ratio < 1 && !hasShownWarning70) {
      setShowBigWarning(true);
      setHasShownWarning70(true);
      const timer = setTimeout(() => {
        setShowBigWarning(false);
      }, 4000); // 4초 후 큰 경고 사라짐
      return () => clearTimeout(timer);
    }
  }, [ratio]);

  // 예산 초과 안내 오버레이
  const [showOverBudgetMessage, setShowOverBudgetMessage] = useState(false);
  
  useEffect(() => {
    if (ratio >= 1 && !showOverBudgetMessage) {
      setShowOverBudgetMessage(true);
      const timer = setTimeout(() => {
        setShowOverBudgetMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [ratio, showOverBudgetMessage]);

  return (
    <div className="relative w-full aspect-[4/3] max-w-md mx-auto overflow-hidden rounded-2xl shadow-2xl">
      {/* 목표 현수막 - 픽셀 아트 스타일, 화면 하단 */}
      {user?.goal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none"
        >
          {/* 픽셀 아트 현수막 */}
          <div className="relative">
            {/* 끈 - 왼쪽 */}
            <div className="absolute -top-3 left-4 w-0.5 h-3 bg-amber-900"></div>
            {/* 끈 - 오른쪽 */}
            <div className="absolute -top-3 right-4 w-0.5 h-3 bg-amber-900"></div>
            
            {/* 현수막 본체 */}
            <div className="bg-white border-2 border-gray-800 px-3 py-1.5 shadow-lg" style={{ imageRendering: 'pixelated' }}>
              <p className="text-xs font-bold text-gray-800 whitespace-nowrap text-center">
                {user.goal}
              </p>
            </div>
            
            {/* 하단 픽셀 프린지 */}
            <div className="flex justify-around -mt-px">
              <div className="w-1 h-1 bg-gray-800"></div>
              <div className="w-1 h-1 bg-gray-800"></div>
              <div className="w-1 h-1 bg-gray-800"></div>
              <div className="w-1 h-1 bg-gray-800"></div>
              <div className="w-1 h-1 bg-gray-800"></div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 하늘 배경 */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `linear-gradient(to bottom, ${colors.sky[0]}, ${colors.sky[1]})`,
        }}
        transition={{ duration: 1 }}
      />

      {/* 구름 (cloudy/storm 상태) */}
      {(weather === 'cloudy' || weather === 'storm') && (
        <>
          <motion.div
            className="absolute w-20 h-8 bg-gray-300 rounded-full opacity-80"
            style={{ top: '10%', left: '10%' }}
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-16 h-6 bg-gray-400 rounded-full opacity-70"
            style={{ top: '20%', right: '15%' }}
            animate={{ x: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </>
      )}

      {/* 번개 (storm 상태) */}
      {weather === 'storm' && (
        <motion.div
          className="absolute inset-0 bg-yellow-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0, 0, 0.3, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
      )}

      {/* 섬 */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-3/4"
        style={{ bottom: '8%' }}
        animate={{
          y: isSunk ? 60 : 0,
          scale: isSunk ? 0.8 : 1,
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <PixelIsland sunk={isSunk} level={island_level} />
      </motion.div>

      {/* 캐릭터 - 물 위에 떠다님 */}
      {!isSunk && <IslandCharacter ratio={ratio} onChatOpen={onCharacterClick} />}

      {/* 물 - 100% 시 최대 70%, 초반에는 천천히 차오름 (ratio²) */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10"
        animate={{
          height: `${Math.min(70, 12 + Math.pow(ratio, 2) * 58)}%`,
          backgroundColor: colors.water,
        }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <motion.div
          className={`absolute top-0 left-0 right-0 ${ratio >= 0.7 ? 'h-8' : 'h-4'}`}
          style={{
            background: `linear-gradient(to bottom, transparent, ${colors.water})`,
          }}
        >
          <motion.div
            className="absolute top-0 w-full h-full"
            animate={{
              backgroundPosition: ['0% 0%', '100% 0%'],
              y: ratio >= 0.7 ? [0, -2, 0, 2, 0] : 0,
            }}
            transition={{ 
              duration: ratio >= 0.6 ? 1 : 7, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 10'%3E%3Cpath d='M0 5 Q 25 0, 50 5 T 100 5 V 10 H 0 Z' fill='rgba(255,255,255,0.2)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat-x',
              backgroundSize: ratio >= 0.7 ? '100px 20px' : '100px 10px',
            }}
          />
        </motion.div>
      </motion.div>

      {/* 레벨업 축하 오버레이 */}
      <AnimatePresence>
        {justLeveledUp && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={clearLevelUp}
          >
            <motion.div
              className="text-center bg-black/60 backdrop-blur-sm rounded-2xl px-6 py-5"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <motion.p
                className="text-5xl mb-2"
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                🎉
              </motion.p>
              <p className="text-white text-xl font-bold">레벨 업!</p>
              <p className="text-yellow-300 text-lg font-bold mt-1">
                Lv.{island_level} {ISLAND_LEVELS[island_level]?.name}
              </p>
              <p className="text-white/60 text-xs mt-2">탭하여 닫기</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 스트릭 보상 오버레이 */}
      <AnimatePresence>
        {justStreakReward && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={clearStreakReward}
          >
            <motion.div
              className="text-center bg-black/70 backdrop-blur-sm rounded-2xl px-6 py-5 max-w-xs"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ type: 'spring', damping: 16 }}
            >
              <motion.p
                className="text-5xl mb-2"
                animate={{ scale: [1, 1.2, 1], rotate: [0, -8, 8, -8, 0] }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {justStreakReward === '7' ? '🔥' : '🌟'}
              </motion.p>
              <p className="text-white text-xl font-bold">
                {justStreakReward === '7'
                  ? '7일 연속 절약 달성!'
                  : '3일 연속 절약 성공!'}
              </p>
              <p className="text-yellow-200 text-sm font-semibold mt-1">
                새로운 섬 장식 슬롯이 열렸어요
              </p>
              <p className="text-white/70 text-xs mt-2">탭하여 닫기</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 70% 큰 경고 (일시적) */}
      <AnimatePresence>
        {showBigWarning && ratio >= 0.7 && ratio < 1 && (
          <motion.div
            className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: [1, 1.05, 1],
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            {/* 경고 삼각형 아이콘 */}
            <motion.div
              animate={{ 
                rotate: [-2, 2, -2],
              }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
            >
              <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-lg">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <path 
                  d="M50 10 L90 80 L10 80 Z" 
                  fill="#FCD34D" 
                  stroke="#EF4444" 
                  strokeWidth="4"
                  filter="url(#glow)"
                />
                <rect x="47" y="30" width="6" height="30" fill="#1F2937" rx="2"/>
                <circle cx="50" cy="70" r="4" fill="#1F2937"/>
              </svg>
            </motion.div>
            
            {/* 경고 메시지 */}
            <motion.div 
              className="bg-red-600/85 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white shadow-xl border-2 border-red-400"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <p className="text-sm font-bold text-center whitespace-nowrap">
                ⏰ {timeLeft} 동안
              </p>
              <p className="text-lg font-bold text-center whitespace-nowrap mt-1">
                {remainingBudget.toLocaleString()}원만 써야 함!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 70% 작은 표지판 (지속) */}
      <AnimatePresence>
        {!showBigWarning && ratio >= 0.7 && ratio < 1 && (
          <motion.div
            className="absolute top-16 left-3 z-20 pointer-events-none"
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
            }}
            exit={{ opacity: 0, x: -20 }}
          >
            <motion.div
              animate={{ 
                rotate: [-3, 3, -3],
                y: [0, -2, 0],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
            >
              <svg viewBox="0 0 100 100" className="w-10 h-10 drop-shadow-lg">
                <defs>
                  <filter id="glow-small">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <path 
                  d="M50 10 L90 80 L10 80 Z" 
                  fill="#FCD34D" 
                  stroke="#EF4444" 
                  strokeWidth="4"
                  filter="url(#glow-small)"
                />
                <rect x="47" y="30" width="6" height="30" fill="#1F2937" rx="2"/>
                <circle cx="50" cy="70" r="4" fill="#1F2937"/>
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 예산 초과 안내 오버레이 */}
      <AnimatePresence>
        {showOverBudgetMessage && ratio >= 1 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl px-8 py-6 text-center max-w-sm mx-4 shadow-2xl"
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: -50 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <motion.p
                className="text-5xl mb-4"
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                😢
              </motion.p>
              <p className="text-2xl font-bold text-gray-800 mb-2">
                예산을 초과했어요
              </p>
              <div className="h-1 w-20 bg-red-500 mx-auto mb-4 rounded-full"></div>
              <p className="text-lg text-gray-600 leading-relaxed">
                하지만 기록은
                <br />
                계속할 수 있어요!
              </p>
              <motion.div
                className="mt-4 text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                자동으로 닫힙니다...
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 침수 오버레이 */}
      {isSunk && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-center text-white"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-4xl mb-2">🌊</p>
            <p className="text-xl font-bold">섬이 침수됐어요!</p>
            <p className="text-sm opacity-80">퀴즈를 풀어 구조하세요</p>
          </motion.div>
        </motion.div>
      )}

      {/* HP 바 - 맨 위 배치 */}
      <div className="absolute top-3 left-3" style={{ right: '30%' }}>
        <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
          <span className="text-white text-[10px] opacity-80 whitespace-nowrap">
            예산
          </span>
          <div className="flex-1 h-2.5 bg-gray-700/50 rounded-full overflow-hidden border border-gray-600/30 relative">
            <motion.div
              className="h-full rounded-full"
              animate={{
                width: `${Math.max(0, (1 - ratio) * 100)}%`,
                backgroundColor: 
                  ratio >= 1 ? '#dc2626' :
                  ratio >= 0.7 ? '#f59e0b' : 
                  ratio >= 0.4 ? '#facc15' : 
                  '#10b981',
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-white text-xs font-bold whitespace-nowrap">
            {remainingBudget.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
