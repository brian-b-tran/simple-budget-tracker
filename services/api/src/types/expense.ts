import { Expense } from '../../generated/prisma/client';
export type PaginatedExpenses = {
  data: Expense[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ExpenseGroup = {
  label: string;
  expenses: Expense[];
};
