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
  recurringExpense?: { frequency: string; interval: number };
}

export interface ExpenseTotals {
  today: { income: number; expense: number; net: number };
  week: { income: number; expense: number; net: number };
  month: { income: number; expense: number; net: number };
  year: { income: number; expense: number; net: number };
}
export type PaginatedExpense = PaginatedResponse<Expense>;
