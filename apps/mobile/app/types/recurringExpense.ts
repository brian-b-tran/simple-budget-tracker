import { PaginatedResponse } from '@expense-app/types';

export interface RecurringExpense {
  id: string;
  userId: string;
  amountOriginal: number;
  currencyOriginal: string;
  categoryId: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number;
  startDate: string;
  endDate: string;
  nextRunDate: string;
  budgetId?: string;
  notes?: string;
  category?: { name: string };
  budget?: { name: string };
  createdAt: string;
  updatedAt: string;
  type: 'EXPENSE' | 'INCOME';
}
export type PaginatedRecurringExpense = PaginatedResponse<RecurringExpense>;
