'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TransactionList } from '@/features/history/TransactionList';
import { AnalyticsCharts } from '@/features/history/AnalyticsCharts';
import { useStore } from '@/store/useStore';
import { filterTransactionsByPeriod, type Period } from '@/lib/analytics';

type Tab = 'list' | 'analytics';

export default function HistoryPage() {
  const router = useRouter();
  const { transactions, user, today_spend, getDailyBudget } = useStore();
  
  const [tab, setTab] = useState<Tab>('list');
  const [period, setPeriod] = useState<Period>('week');

  const dailyBudget = getDailyBudget();
  const todayRatio = dailyBudget > 0 ? (today_spend / dailyBudget) * 100 : 0;

  // 기간별 필터링
  const filteredTransactions = tab === 'analytics' 
    ? filterTransactionsByPeriod(transactions, period)
    : transactions;

  // 전체 통계
  const totalExpense = filteredTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-200">
      <div className="max-w-md mx-auto min-h-screen bg-gradient-to-b from-sky-100 to-blue-200">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-gray-800">가계부</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* 탭 */}
        <div className="flex gap-2 px-4 pb-3">
          <Button
            variant={tab === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTab('list')}
            className="flex-1"
          >
            <Calendar className="w-4 h-4 mr-1" />
            거래내역
          </Button>
          <Button
            variant={tab === 'analytics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTab('analytics')}
            className="flex-1"
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            분석
          </Button>
        </div>

        {/* 기간 선택 (분석 탭에서만) */}
        {tab === 'analytics' && (
          <div className="flex gap-2 px-4 pb-3">
            <Button
              variant={period === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('week')}
              className="flex-1"
            >
              주간
            </Button>
            <Button
              variant={period === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('month')}
              className="flex-1"
            >
              월간
            </Button>
          </div>
        )}

        {/* 요약 정보 */}
        {user && (
          <div className="px-4 pb-3 space-y-2">
            <div className="flex gap-2">
              <div className="flex-1 bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600">오늘 지출</p>
                <p className="text-lg font-bold text-blue-900">
                  {today_spend.toLocaleString()}원
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {todayRatio.toFixed(0)}% 사용
                </p>
              </div>
              <div className="flex-1 bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600">일일 예산</p>
                <p className="text-lg font-bold text-green-900">
                  {Math.floor(dailyBudget).toLocaleString()}원
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {Math.max(0, Math.floor(dailyBudget - today_spend)).toLocaleString()}원 남음
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 전체 통계 */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-white/60 backdrop-blur rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-gray-600" />
            <h2 className="text-sm font-bold text-gray-700">
              {tab === 'analytics' 
                ? `${period === 'week' ? '주간' : '월간'} 요약` 
                : '전체 내역'}
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-gray-500">총 기록</p>
              <p className="text-base font-bold text-gray-800">
                {filteredTransactions.length}건
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">총 지출</p>
              <p className="text-base font-bold text-red-600">
                {totalExpense.toLocaleString()}원
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">총 수입</p>
              <p className="text-base font-bold text-green-600">
                {totalIncome.toLocaleString()}원
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 내용 */}
      <div className="px-4 pb-4">
        {tab === 'list' ? (
          <TransactionList mode="full" />
        ) : (
          <AnalyticsCharts transactions={filteredTransactions} />
        )}
      </div>
      </div>
    </div>
  );
}
