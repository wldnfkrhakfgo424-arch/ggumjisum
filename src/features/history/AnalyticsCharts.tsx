'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { categoryNames } from '@/utils/mock-nlp';
import type { Transaction } from '@/store/useStore';
import { getCategoryData, getDailyData } from '@/lib/analytics';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

interface AnalyticsChartsProps {
  transactions: Transaction[];
}

export function AnalyticsCharts({ transactions }: AnalyticsChartsProps) {
  const categoryData = getCategoryData(transactions);
  const dailyData = getDailyData(transactions);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>데이터가 충분하지 않아요</p>
        <p className="text-sm mt-1">더 많은 거래를 입력해주세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 카테고리별 파이차트 */}
      {categoryData.length > 0 && (
        <div className="bg-white/60 backdrop-blur rounded-xl p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-4">카테고리별 지출</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => {
                  const n = String(name ?? '');
                  return `${categoryNames[n] || n || '기타'} ${((percent ?? 0) * 100).toFixed(0)}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number | undefined) => `${(value ?? 0).toLocaleString()}원`}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* 범례 */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-700">
                  {categoryNames[item.name] || item.name}: {item.value.toLocaleString()}원
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 일별 지출 바차트 */}
      {dailyData.length > 0 && (
        <div className="bg-white/60 backdrop-blur rounded-xl p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-4">일별 지출 추이</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                formatter={(value: number | undefined) => `${(value ?? 0).toLocaleString()}원`}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
