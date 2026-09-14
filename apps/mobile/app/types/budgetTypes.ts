import { PaginatedResponse } from '@expense-app/types';
import { Expense } from './expenseTypes';

export interface Budget {
  id: string;
  userId: string;
  name: string;
  type: 'MONTHLY' | 'YEARLY' | 'QUARTERLY' | 'VACATION' | 'EVENT';
  currency: string;
  totalAmount: number;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetSummary extends Budget {
  totalSpent: number;
  remaining: number;
  percentageUsed: number;
  categoryBreakdown: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  spent: number;
  percentageOfTotal: number;
}

export type BudgetDetail = BudgetSummary & {
  expenses: PaginatedResponse<Expense>;
};

export type VacationDailyBreakdown = {
  startingCapital: number;
  currency: string;
  totalDays: number;
  dayBuckets: VacationDayBucket[];
};

export type VacationDayBucket = {
  dayLabel: string;
  expenses: Expense[];
  dayNetTotal: number;
  dayBalance: number;
};
