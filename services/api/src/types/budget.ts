import { Budget } from '../../generated/prisma/client';
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
