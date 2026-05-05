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
