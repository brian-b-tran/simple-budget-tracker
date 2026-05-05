import { z } from 'zod';

export const expenseBaseSchema = z.object({
  amountOriginal: z
    .number()
    .refine((val) => val !== 0, { message: 'Amount cannot be zero' }),
  categoryId: z.uuid().min(1),
  date: z.date(),
  time: z.date(),
  type: z.enum(['EXPENSE', 'INCOME']),
  currencyOriginal: z.string().length(3),
  budgetId: z.string().optional(),
  recurringExpenseId: z.string().optional(),
  notes: z.string().optional(),
});

export const filterExpenseSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  categoryId: z.uuid().optional(),
  budgetId: z.string().optional(),
  type: z.enum(['EXPENSE', 'INCOME']).optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  sortBy: z.enum(['date', 'amount', 'createdAt']).optional().default('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const createExpenseFrontendSchema = expenseBaseSchema;
export const createExpenseBackendSchema = expenseBaseSchema.extend({
  date: z.coerce.date(),
  time: z.coerce.date(),
  amountBase: z.number().optional(),
  exchangeRateUsed: z.number().optional(),
});

export const updateExpenseBackendSchema = createExpenseBackendSchema.partial();
export const updateExpenseFrontendSchema = expenseBaseSchema.partial();

export type CreateExpenseFrontendInput = z.infer<
  typeof createExpenseFrontendSchema
>;
export type CreateExpenseBackendInput = z.infer<
  typeof createExpenseBackendSchema
>;
export type UpdateExpenseFrontendInput = z.infer<
  typeof updateExpenseFrontendSchema
>;
export type UpdateExpenseBackendInput = z.infer<
  typeof updateExpenseBackendSchema
>;
export type FilterExpenseInput = z.infer<typeof filterExpenseSchema>;
