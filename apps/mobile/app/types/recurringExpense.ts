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
  createdAt: string;
  updatedAt: string;
  type: 'EXPENSE' | 'INCOME';
}
