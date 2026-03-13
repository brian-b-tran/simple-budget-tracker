import { Expense } from '../../generated/prisma/client';
export type PaginatedExpenses = {
  expenses: Expense[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
