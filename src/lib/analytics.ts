import type { Transaction } from '@/store/useStore';

export type Period = 'week' | 'month';

export function filterTransactionsByPeriod(
  transactions: Transaction[],
  period: Period
): Transaction[] {
  const now = Date.now();
  const cutoff = period === 'week' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
  
  return transactions.filter((tx) => {
    const txDate = new Date(tx.occurred_at).getTime();
    return now - txDate <= cutoff;
  });
}

export function getCategoryData(transactions: Transaction[]) {
  const expenses = transactions.filter((tx) => tx.type === 'expense');
  const byCategory: Record<string, number> = {};

  expenses.forEach((tx) => {
    byCategory[tx.category] = (byCategory[tx.category] || 0) + tx.amount;
  });

  return Object.entries(byCategory).map(([name, value]) => ({ name, value }));
}

export function getDailyData(transactions: Transaction[]) {
  const expenses = transactions.filter((tx) => tx.type === 'expense');
  const byDate: Record<string, number> = {};

  expenses.forEach((tx) => {
    const date = tx.occurred_at.slice(5, 10); // MM-DD
    byDate[date] = (byDate[date] || 0) + tx.amount;
  });

  return Object.entries(byDate)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
