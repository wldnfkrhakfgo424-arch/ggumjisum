'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';

// 픽셀 아트 캐릭터 SVG
function PixelCharacter() {
  return (
    <svg viewBox="0 0 40 60" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
      {/* 머리 */}
      <rect x="14" y="8" width="12" height="12" fill="#FFD700" />
      
      {/* 얼굴 */}
      <rect x="16" y="12" width="8" height="8" fill="#FFA07A" />
      
      {/* 눈 */}
      <rect x="18" y="14" width="2" height="2" fill="#000000" />
      <rect x="24" y="14" width="2" height="2" fill="#000000" />
      
      {/* 입 */}
      <rect x="20" y="18" width="4" height="1" fill="#FF6347" />
      
      {/* 몸통 */}
      <rect x="15" y="20" width="10" height="12" fill="#4169E1" />
      
      {/* 팔 */}
      <rect x="12" y="22" width="3" height="8" fill="#FFA07A" />
      <rect x="25" y="22" width="3" height="8" fill="#FFA07A" />
      
      {/* 다리 */}
      <rect x="16" y="32" width="4" height="10" fill="#2E8B57" />
      <rect x="22" y="32" width="4" height="10" fill="#2E8B57" />
      
      {/* 신발 */}
      <rect x="15" y="42" width="5" height="3" fill="#8B4513" />
      <rect x="22" y="42" width="5" height="3" fill="#8B4513" />
    </svg>
  );
}

// 상태별 대사 풀
const dialogues = {
  sunny: [
    '오늘 완전 알뜰!',
    '섬이 평화롭다~',
    '이 페이스 유지!',
    '완벽한 하루야!',
    '절약왕 등극!',
    '이러다 부자되겠어!',
  ],
  cloudy: [
    '슬슬 지갑 확인해볼까?',
    '아직 괜찮아!',
    '물이 조금 올라왔네',
    '조심하자~',
    '아직 버틸 만해!',
    '오늘 운동 많이 된다',
  ],
  storm: [
    '으으... 바람이 세다',
    '지갑이 위험해!',
    '조금만 참자...',
    '폭풍이 몰아친다!',
    '위험 수위야!',
    '오늘 운동 진짜 많이 된다',
  ],
  sunk: [
    '살려줘!!',
    '수영 못하는데...',
    '퀴즈 풀어줘!!',
    '도와줘!',
    '침몰이다!!',
  ],
  income: [
    '오 용돈이다!',
    '부자 됐다!',
    '섬이 안전해졌어!',
    '고마워!',
    '살았다!',
  ],
};

function getDialogueForRatio(ratio: number): string[] {
  if (ratio >= 1) return dialogues.sunk;
  if (ratio >= 0.7) return dialogues.storm;
  if (ratio >= 0.4) return dialogues.cloudy;
  return dialogues.sunny;
}

interface IslandCharacterProps {
  ratio: number;
  onChatOpen?: () => void;
}

export function IslandCharacter({ ratio, onChatOpen }: IslandCharacterProps) {
  const { transactions, currentStreak } = useStore();
  const [currentDialogue, setCurrentDialogue] = useState('');
  const [showDialogue, setShowDialogue] = useState(true);
  const [streakMessageShownFor, setStreakMessageShownFor] = useState<number | null>(null);
  
  // 물 높이 계산 (IslandVisualizer와 동일)
  const waterHeight = Math.min(70, 12 + Math.pow(ratio, 2) * 58);
  
  // 캐릭터 초기 위치 (섬 위)
  const characterInitialBottom = 26;
  
  // 캐릭터가 물과 함께 떠다니는지 여부
  const isFloating = waterHeight > characterInitialBottom;
  
  // 물이 캐릭터 발에 닿지 않으면 고정, 닿으면 함께 상승 (원래 위치 이하로는 안 내려감)
  const characterBottom = Math.max(
    characterInitialBottom, // 최소 위치 (섬 위 고정)
    waterHeight - 10 // 물과 함께 상승 (몸 절반 잠김)
  );

  // 대사 업데이트 로직
  useEffect(() => {
    const updateDialogue = () => {
      const pool = getDialogueForRatio(ratio);
      const newDialogue = pool[Math.floor(Math.random() * pool.length)];
      setCurrentDialogue(newDialogue);
      setShowDialogue(true);

      // 5초 후 fade out
      setTimeout(() => setShowDialogue(false), 5000);
    };

    // 초기 대사
    updateDialogue();

    // 6초마다 대사 교체
    const interval = setInterval(updateDialogue, 6000);

    return () => clearInterval(interval);
  }, [ratio]);

  // 거래 발생 시 즉시 반응
  useEffect(() => {
    if (transactions.length === 0) return;

    const lastTransaction = transactions[0];
    if (lastTransaction.type === 'income') {
      const incomeDialogue = dialogues.income[Math.floor(Math.random() * dialogues.income.length)];
      setCurrentDialogue(incomeDialogue);
      setShowDialogue(true);

      setTimeout(() => setShowDialogue(false), 4000);
    }
  }, [transactions]);

  // 스트릭 달성 특별 대사
  useEffect(() => {
    if (currentStreak === 3 && streakMessageShownFor !== 3) {
      setCurrentDialogue('와, 3일 연속 절약 성공!');
      setShowDialogue(true);
      setStreakMessageShownFor(3);
      setTimeout(() => setShowDialogue(false), 5000);
    } else if (currentStreak === 7 && streakMessageShownFor !== 7) {
      setCurrentDialogue('7일 스트릭이라니… 대단해!');
      setShowDialogue(true);
      setStreakMessageShownFor(7);
      setTimeout(() => setShowDialogue(false), 5000);
    }
  }, [currentStreak, streakMessageShownFor]);

  return (
    <>
      <div 
        className="absolute cursor-pointer z-0 transition-all duration-1000 ease-out" 
        style={{ 
          left: '60%', 
          bottom: `${characterBottom}%`, 
          width: '50px', 
          height: '75px',
        }} 
        onClick={onChatOpen}
      >
        {/* 캐릭터 - 클릭 시 대화창 열림 */}
        <motion.div
          animate={{
            y: isFloating ? [0, -3, 0] : 0, // 물에 떠다닐 때만 애니메이션
            x: ratio >= 1 ? 300 : 0, // 예산 초과 시 물에 휩쓸림
            rotate: ratio >= 1 ? 360 : 0, // 회전하며 사라짐
            opacity: ratio >= 1 ? 0 : 1, // 페이드아웃
          }}
          transition={{
            duration: ratio >= 1 ? 1.5 : 2,
            repeat: isFloating && ratio < 1 ? Infinity : 0,
            ease: ratio >= 1 ? 'easeIn' : 'easeInOut',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <PixelCharacter />
        </motion.div>
      </div>

      {/* 말풍선 - 독립적으로 렌더링 */}
      <AnimatePresence>
        {showDialogue && currentDialogue && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: ratio >= 0.65 ? -10 : 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: ratio >= 0.65 ? 10 : -10 }}
            transition={{ duration: 0.3 }}
            className="absolute whitespace-nowrap"
            style={{ 
              zIndex: 50,
              left: '60%',
              transform: 'translateX(-50%)',
              bottom: ratio >= 0.8 
                ? `${characterBottom - 8}%`  // 캐릭터 아래
                : `${characterBottom + 25}%`, // 캐릭터 위 (더 위로)
            }}
          >
            <div className="relative bg-white rounded-xl px-3 py-2 shadow-lg border-2 border-gray-300">
              <p className="text-xs font-medium text-gray-800">{currentDialogue}</p>
              {/* 말풍선 꼬리 */}
              {ratio >= 0.8 ? (
                // 아래 위치일 때: 꼬리가 위로 (더 크고 명확하게)
                <>
                  <div
                    className="absolute -top-2 left-0.9/2 -translate-x-1/2 w-0 h-0"
                    style={{
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderBottom: '10px solid white',
                    }}
                  />
                  <div
                    className="absolute -top-3 left-0.9/2 -translate-x-1/2 w-0 h-0"
                    style={{
                      borderLeft: '9px solid transparent',
                      borderRight: '9px solid transparent',
                      borderBottom: '11px solid #d1d5db',
                    }}
                  />
                </>
              ) : (
                // 위 위치일 때: 꼬리가 아래로 (더 크고 명확하게)
                <>
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: '10px solid white',
                    }}
                  />
                  <div
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{
                      borderLeft: '9px solid transparent',
                      borderRight: '9px solid transparent',
                      borderTop: '11px solid #d1d5db',
                    }}
                  />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
