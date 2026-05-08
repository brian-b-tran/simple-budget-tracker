import { PaginatedResponse } from '@expense-app/types';

export interface Expense {
  id: string;
  userId: string;
  amountOriginal: number;
  currencyOriginal: string;
  amountBase?: number;
  exchangeRateUsed?: number;
  categoryId: string;
  budgetId?: string;
  recurringExpenseId?: string;
  notes?: string;
  date: string;
  time: string;
  type: 'EXPENSE' | 'INCOME';
  createdAt: string;
  updatedAt: string;
  category?: { name: string };
  budget?: { name: string };
}

export interface ExpenseTotals {
  today: number;
  week: number;
  month: number;
  year: number;
}
export type PaginatedExpense = PaginatedResponse<Expense>;
