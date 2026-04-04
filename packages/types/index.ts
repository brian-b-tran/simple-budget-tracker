export * from './schemas/expense';
export * from './schemas/budget';
export * from './schemas/recurringExpense';
export * from './schemas/reminder';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
