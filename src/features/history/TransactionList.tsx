'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Eye, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore, type Transaction } from '@/store/useStore';
import { categoryEmoji, categoryNames } from '@/utils/mock-nlp';

interface TransactionListProps {
  mode?: 'full' | 'compact';
  limit?: number;
}

// 날짜 그룹핑 헬퍼
function groupByDate(transactions: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  
  transactions.forEach((tx) => {
    const date = tx.occurred_at.slice(0, 10);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(tx);
  });

  return groups;
}

function getDateLabel(dateStr: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (dateStr === today) return '오늘';
  if (dateStr === yesterday) return '어제';
  
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const { updateTransaction, deleteTransaction } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [editCategory, setEditCategory] = useState(transaction.category);
  const [editDescription, setEditDescription] = useState(transaction.description);

  const handleSave = () => {
    updateTransaction(transaction.id, {
      category: editCategory,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditCategory(transaction.category);
    setEditDescription(transaction.description);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('이 거래를 삭제하시겠어요?')) {
      deleteTransaction(transaction.id);
    }
  };

  const isIncome = transaction.type === 'income';
  const emoji = categoryEmoji[transaction.category] || '💸';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between gap-2">
        {/* 아이콘 + 내용 */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-2xl">{emoji}</span>
          
          {isEditing ? (
            <div className="flex-1 space-y-2">
              <Input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="내역"
                className="text-sm"
              />
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="text-sm border rounded px-2 py-1 w-full"
              >
                <option value="coffee">☕ 커피</option>
                <option value="food">🍚 식비</option>
                <option value="transport">🚕 교통</option>
                <option value="drink">🍺 술</option>
                <option value="shopping">🛍️ 쇼핑</option>
                <option value="entertainment">🎮 여가</option>
                <option value="health">💊 건강</option>
                <option value="etc">💸 기타</option>
              </select>
            </div>
          ) : (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {transaction.description}
              </p>
              <p className="text-xs text-gray-500">
                {categoryNames[transaction.category] || '기타'}
              </p>
            </div>
          )}
        </div>

        {/* 금액 */}
        <div className="text-right">
          <p
            className={`text-base font-bold ${
              isIncome ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isIncome ? '+' : '-'}
            {transaction.amount.toLocaleString()}원
          </p>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="mt-2 flex items-center gap-2">
        {isEditing ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              className="h-7 px-2"
            >
              <Check className="w-3 h-3 mr-1" />
              저장
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              className="h-7 px-2"
            >
              <X className="w-3 h-3 mr-1" />
              취소
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowOriginal(!showOriginal)}
              className="h-7 px-2 text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              원문
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-7 px-2 text-xs"
            >
              <Edit2 className="w-3 h-3 mr-1" />
              수정
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              삭제
            </Button>
          </>
        )}
      </div>

      {/* 원문 표시 */}
      <AnimatePresence>
        {showOriginal && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
              <span className="font-medium">입력 원문:</span> "{transaction.original_input}"
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function TransactionList({ mode = 'full', limit }: TransactionListProps) {
  const { transactions } = useStore();
  
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  if (displayTransactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>아직 거래 내역이 없어요</p>
        <p className="text-sm mt-1">채팅으로 지출을 입력해보세요!</p>
      </div>
    );
  }

  if (mode === 'compact') {
    // 섬 페이지용 간단한 리스트
    return (
      <div className="space-y-2">
        {displayTransactions.map((tx) => (
          <TransactionItem key={tx.id} transaction={tx} />
        ))}
      </div>
    );
  }

  // 히스토리 페이지용 날짜별 그룹핑
  const grouped = groupByDate(displayTransactions);
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date}>
          <h3 className="text-sm font-bold text-gray-700 mb-2 sticky top-0 bg-gray-50 py-2 px-3 rounded-lg">
            {getDateLabel(date)}
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {grouped[date].map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}
