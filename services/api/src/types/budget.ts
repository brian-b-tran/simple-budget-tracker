import { PaginatedResponse } from '@expense-app/types';
import { Budget, Expense } from '../../generated/prisma/client';
import { ExpenseGroup } from './expense';
export type BudgetSummary = Budget & {
  totalSpent: number;
  remaining: number;
  percentageUsed: number;
  categoryBreakdown: BudgetCategoryBreakdown[];
};

export type BudgetCategoryBreakdown = {
  categoryId: string;
  categoryName: string;
  spent: number;
  percentageOfTotal: number;
};

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
