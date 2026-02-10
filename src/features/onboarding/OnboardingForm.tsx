'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useStore } from '@/store/useStore';

export function OnboardingForm() {
  const router = useRouter();
  const { setUser, resetSpend } = useStore();
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [resetDay, setResetDay] = useState('1');
  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');

    if (step === 0) {
      if (!nickname.trim()) {
        setError('닉네임을 입력해주세요');
        return;
      }
      setStep(1);
    } else if (step === 1) {
      const budget = parseInt(budgetLimit.replace(/,/g, ''), 10);
      if (isNaN(budget) || budget < 10000) {
        setError('예산을 10,000원 이상 입력해주세요');
        return;
      }
      setStep(2);
    }
  };

  const handleComplete = () => {
    const budget = parseInt(budgetLimit.replace(/,/g, ''), 10);
    const day = parseInt(resetDay, 10);

    if (isNaN(day) || day < 1 || day > 31) {
      setError('1~31 사이의 날짜를 입력해주세요');
      return;
    }

    // Create user
    const user = {
      id: crypto.randomUUID(),
      nickname: nickname.trim(),
      budget_limit: budget,
      reset_day: day,
    };

    setUser(user);
    resetSpend();
    router.push('/island');
  };

  const formatBudget = (value: string) => {
    const num = value.replace(/[^\d]/g, '');
    if (!num) return '';
    return parseInt(num, 10).toLocaleString();
  };

  const steps = [
    {
      title: '반가워요! 👋',
      description: '꿈지섬에 오신 걸 환영해요',
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              뭐라고 부를까요?
            </label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임"
              maxLength={20}
              autoFocus
            />
          </div>
        </div>
      ),
    },
    {
      title: '예산을 정해볼까요? 💰',
      description: '한 달에 얼마까지 쓸 계획인가요?',
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              월 예산 (원)
            </label>
            <Input
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(formatBudget(e.target.value))}
              placeholder="500,000"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              예산을 넘으면 섬이 물에 잠겨요 🌊
            </p>
          </div>
        </div>
      ),
    },
    {
      title: '마지막으로! 📅',
      description: '매달 예산이 리셋되는 날짜를 정해주세요',
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              리셋 날짜 (1~31)
            </label>
            <Input
              type="number"
              min={1}
              max={31}
              value={resetDay}
              onChange={(e) => setResetDay(e.target.value)}
              placeholder="1"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              월급날이나 원하는 날짜를 입력하세요
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-sky-100 to-blue-200">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
            <CardDescription>{currentStep.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep.content}

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}

            <div className="mt-6 flex gap-2">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  이전
                </Button>
              )}
              {step < steps.length - 1 ? (
                <Button onClick={handleNext} className="flex-1">
                  다음
                </Button>
              ) : (
                <Button onClick={handleComplete} className="flex-1">
                  시작하기 🏝️
                </Button>
              )}
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-4">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === step ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
