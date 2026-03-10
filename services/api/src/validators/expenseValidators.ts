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

export type UpdateExpenseInput = z.infer<typeof updateExpenseValidationSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseValidationSchema>;
