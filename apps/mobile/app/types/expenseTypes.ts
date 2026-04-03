import { PaginatedResponse } from './apiTypes';

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
  date: Date;
  time: Date;
  type: 'EXPENSE' | 'INCOME';
}
export interface Filter {
  page: number;
  limit: number;
  startDate?: Date;
  endDate?: Date;
  categoryId?: string;
  budgetId?: string;
  type?: 'EXPENSE' | 'INCOME';
  minAmount?: number;
  maxAmount?: number;
}

export type PaginatedExpenses = PaginatedResponse<Expense>;
