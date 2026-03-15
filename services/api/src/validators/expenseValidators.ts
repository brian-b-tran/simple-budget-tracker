import { z } from 'zod';

export const updateExpenseValidationSchema = z.object({
  amountOriginal: z
    .number()
    .refine((val) => val !== 0, { message: 'Amount cannot be zero' })
    .optional(),
  categoryId: z.uuid().optional(),
  date: z.coerce.date().optional(),
  time: z.coerce.date().optional(),
  type: z.enum(['EXPENSE', 'INCOME']).default('EXPENSE').optional(),
  currencyOriginal: z.string().length(3).optional(),
  amountBase: z.number().optional(),
  exchangeRateUsed: z.number().optional(),
  budgetId: z.string().optional(),
  recurringExpenseId: z.string().optional(),
  notes: z.string().optional(),
});
export const createExpenseValidationSchema = z.object({
  amountOriginal: z
    .number()
    .refine((val) => val !== 0, { message: 'Amount cannot be zero' }),
  categoryId: z.uuid(),
  date: z.coerce.date(),
  time: z.coerce.date(),
  type: z.enum(['EXPENSE', 'INCOME']).default('EXPENSE').optional(),
  currencyOriginal: z.string().length(3).default('CAD'),
  amountBase: z.number().optional(),
  exchangeRateUsed: z.number().optional(),
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
});

export type FilterExpenseInput = z.infer<typeof filterExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseValidationSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseValidationSchema>;
