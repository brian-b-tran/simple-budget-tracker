import { z } from 'zod';
import { currencies } from '../constants/currencies';

const currencyCodes = Object.keys(currencies) as [string, ...string[]];
export const expenseBaseSchema = z.object({
  categoryId: z.uuid().min(1),
  date: z.date(),
  time: z.date(),
  type: z.enum(['EXPENSE', 'INCOME']),
  currencyOriginal: z.enum(currencies),
  budgetId: z.string().optional(),
  recurringExpenseId: z.string().optional(),
  notes: z.string().optional(),
});

export const filterExpenseSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  range: z.enum(['today', 'week', 'month', 'year']).optional(),
  timeZone: z.string().optional(),
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

export const createExpenseFrontendSchema = expenseBaseSchema.extend({
  amountOriginal: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => {
      const parsed = parseFloat(val);
      return !isNaN(parsed) && parsed !== 0;
    }),
});

export const createExpenseBackendSchema = expenseBaseSchema.extend({
  amountOriginal: z
    .number()
    .refine((val) => val !== 0, { message: 'Amount cannot be zero' }),
  date: z.coerce.date(),
  time: z.coerce.date(),
  amountBase: z.number().optional(),
  exchangeRateUsed: z.number().optional(),
});

export const updateExpenseBackendSchema = createExpenseBackendSchema.partial();
export const updateExpenseFrontendSchema =
  createExpenseFrontendSchema.partial();

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
