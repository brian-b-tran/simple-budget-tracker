import { Budget } from '../../generated/prisma/client';
export type BudgetSummary = {
  budget: Budget;
  totalSpent: number;
  remaining: number;
  percentageUsed: number;
};
