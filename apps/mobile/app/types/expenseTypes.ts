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
}

export type PaginatedExpenses = PaginatedResponse<Expense>;
