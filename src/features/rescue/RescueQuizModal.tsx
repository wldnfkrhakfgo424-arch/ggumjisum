'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

// Quiz pool (15 questions across categories)
const quizPool = [
  // Coffee (3)
  {
    category: 'coffee',
    question: '다음 중 가장 저렴한 커피 옵션은?',
    correctAnswer: '편의점 커피',
    wrongAnswers: ['스타벅스 아메리카노', '카페 라떼', '프라푸치노'],
    explanation: '편의점 커피가 보통 1,500원 정도로 가장 저렴해요!',
  },
  {
    category: 'coffee',
    question: '카페 지출을 줄이는 가장 효과적인 방법은?',
    correctAnswer: '텀블러 지참 할인 활용',
    wrongAnswers: ['매일 프리미엄 음료 주문', '카페 구독 서비스 가입', '디저트 세트로 주문'],
    explanation: '텀블러를 가져가면 300~500원 할인을 받을 수 있어요!',
  },
  {
    category: 'coffee',
    question: '커피값 절약을 위한 최선의 방법은?',
    correctAnswer: '집에서 커피 내려먹기',
    wrongAnswers: ['더 비싼 카페 가기', '하루 3잔 이상 마시기', '항상 벤티 사이즈'],
    explanation: '집에서 커피를 내려 먹으면 한 달에 10만원 이상 절약할 수 있어요!',
  },
  // Food (3)
  {
    category: 'food',
    question: '식비를 절약하는 가장 좋은 방법은?',
    correctAnswer: '집에서 도시락 싸가기',
    wrongAnswers: ['매일 배달음식', '편의점에서 3끼', '외식 늘리기'],
    explanation: '도시락을 싸면 한 끼당 3,000~5,000원 절약할 수 있어요!',
  },
  {
    category: 'food',
    question: '배달 앱 사용 시 절약 팁은?',
    correctAnswer: '최소 주문 금액 맞춰 배달비 무료',
    wrongAnswers: ['1인분만 시키기', '새벽 배달 이용', '매일 다른 앱 사용'],
    explanation: '배달비 3,000원을 아끼면 한 달에 9만원 절약!',
  },
  {
    category: 'food',
    question: '편의점 이용 시 절약 방법은?',
    correctAnswer: '1+1, 2+1 행사 상품 이용',
    wrongAnswers: ['신상품만 구매', '포인트 쌓지 않기', '정가 상품만 구매'],
    explanation: '행사 상품을 활용하면 최대 50% 절약할 수 있어요!',
  },
  // Transport (3)
  {
    category: 'transport',
    question: '한 달 교통비를 줄이는 가장 좋은 방법은?',
    correctAnswer: '정기권 구매하기',
    wrongAnswers: ['매일 택시 타기', '자가용 출퇴근', '킥보드 대여'],
    explanation: '정기권을 사면 교통비를 30% 이상 절약할 수 있어요!',
  },
  {
    category: 'transport',
    question: '택시비를 줄이는 방법은?',
    correctAnswer: '버스나 지하철 이용',
    wrongAnswers: ['심야 택시 자주 이용', '카카오 블랙 타기', '공항 리무진 이용'],
    explanation: '대중교통은 택시의 1/10 가격이에요!',
  },
  {
    category: 'transport',
    question: '출퇴근 교통비 절약 팁은?',
    correctAnswer: '한 정거장 걸어서 환승',
    wrongAnswers: ['택시 호출', '고속버스 이용', '렌터카 빌리기'],
    explanation: '조금만 걸으면 건강도 챙기고 돈도 아껴요!',
  },
  // Shopping (3)
  {
    category: 'shopping',
    question: '충동구매를 막는 좋은 습관은?',
    correctAnswer: '24시간 기다려보기',
    wrongAnswers: ['바로 결제하기', '친구한테 자랑하기', '더 비싼 거 사기'],
    explanation: '24시간 기다리면 충동이 사라지는 경우가 많아요!',
  },
  {
    category: 'shopping',
    question: '온라인 쇼핑 절약 팁은?',
    correctAnswer: '장바구니에 담고 할인 기다리기',
    wrongAnswers: ['신상품 바로 구매', '최고가 상품만', '쿠폰 사용 안 하기'],
    explanation: '세일 기간을 기다리면 최대 70% 할인받을 수 있어요!',
  },
  {
    category: 'shopping',
    question: '의류 구매 시 절약 방법은?',
    correctAnswer: '시즌 오프 세일 이용',
    wrongAnswers: ['신상 출시 즉시 구매', '백화점 VIP 라운지', '명품만 구매'],
    explanation: '시즌이 지나면 50~70% 할인된 가격에 살 수 있어요!',
  },
  // General (3)
  {
    category: 'general',
    question: '매달 고정 지출을 줄이는 방법은?',
    correctAnswer: '구독 서비스 정리하기',
    wrongAnswers: ['구독 더 늘리기', '프리미엄 플랜 업그레이드', '자동결제 추가'],
    explanation: '안 쓰는 구독을 정리하면 월 3~5만원 절약!',
  },
  {
    category: 'general',
    question: '예산 관리의 기본 원칙은?',
    correctAnswer: '수입의 50% 이하로 소비',
    wrongAnswers: ['수입보다 많이 쓰기', '저축 안 하기', '카드 빚 늘리기'],
    explanation: '수입의 50%는 생활비, 30%는 저축, 20%는 여가가 이상적이에요!',
  },
  {
    category: 'general',
    question: '소비 습관 개선을 위한 첫 단계는?',
    correctAnswer: '지출 기록 시작하기',
    wrongAnswers: ['영수증 버리기', '통장 확인 안 하기', '현금 인출 늘리기'],
    explanation: '지출을 기록하면 불필요한 소비를 40% 줄일 수 있어요!',
  },
];

function shuffleChoices(quiz: typeof quizPool[0]) {
  const choices = [quiz.correctAnswer, ...quiz.wrongAnswers];
  const shuffled = [...choices].sort(() => Math.random() - 0.5);
  const correctIndex = shuffled.indexOf(quiz.correctAnswer);
  return { choices: shuffled, correctIndex };
}

export function RescueQuizModal() {
  const { isQuizOpen, setQuizOpen, restoreIsland, transactions } = useStore();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  // 사용자의 최근 카테고리 기반 퀴즈 선택
  const [quizData] = useState(() => {
    // 최근 거래의 카테고리 추출
    const recentCategories = transactions.slice(0, 10).map(tx => tx.category);
    const categoryCount: Record<string, number> = {};
    recentCategories.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    
    // 가장 많이 사용한 카테고리 찾기
    const topCategory = Object.keys(categoryCount).sort((a, b) => 
      categoryCount[b] - categoryCount[a]
    )[0];
    
    // 해당 카테고리 퀴즈 우선, 없으면 랜덤
    const categoryQuizzes = quizPool.filter(q => q.category === topCategory);
    const selectedQuiz = categoryQuizzes.length > 0 
      ? categoryQuizzes[Math.floor(Math.random() * categoryQuizzes.length)]
      : quizPool[Math.floor(Math.random() * quizPool.length)];
    
    // 보기 셔플
    return {
      quiz: selectedQuiz,
      ...shuffleChoices(selectedQuiz),
    };
  });

  const { quiz, choices, correctIndex } = quizData;
  const isCorrect = selectedAnswer === correctIndex;
  const maxAttempts = 3;

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    setAttempts((prev) => prev + 1);
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleRestore = () => {
    restoreIsland();
    setSelectedAnswer(null);
    setShowResult(false);
    setAttempts(0);
  };

  return (
    <Dialog open={isQuizOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center">🆘 구조 퀴즈!</DialogTitle>
          <DialogDescription className="text-center">
            정답을 맞히면 섬을 복구할 수 있어요
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-lg font-medium mb-4 text-center">{quiz.question}</p>

          <div className="space-y-2">
            {choices.map((choice, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: showResult ? 1 : 1.02 }}
                whileTap={{ scale: showResult ? 1 : 0.98 }}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  showResult
                    ? index === correctIndex
                      ? 'bg-green-100 border-2 border-green-500'
                      : index === selectedAnswer
                      ? 'bg-red-100 border-2 border-red-500'
                      : 'bg-gray-50 border-2 border-transparent'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <span className="font-medium mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {choice}
              </motion.button>
            ))}
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-lg bg-gray-50"
            >
              <p className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '🎉 정답!' : '😢 틀렸어요'}
              </p>
              <p className="text-sm text-gray-600 mt-1">{quiz.explanation}</p>

              <div className="mt-4 flex gap-2">
                {isCorrect ? (
                  <Button onClick={handleRestore} className="w-full">
                    🏝️ 섬 복구하기
                  </Button>
                ) : attempts < maxAttempts ? (
                  <Button onClick={handleRetry} variant="outline" className="w-full">
                    다시 도전 ({maxAttempts - attempts}회 남음)
                  </Button>
                ) : (
                  <div className="w-full text-center text-gray-500 text-sm">
                    ⏰ 잠시 후 다시 시도해주세요
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <p className="text-xs text-center text-gray-400">
          시도: {attempts}/{maxAttempts}
        </p>
      </DialogContent>
    </Dialog>
  );
}
