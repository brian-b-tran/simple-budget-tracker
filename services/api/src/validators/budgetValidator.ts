import { z } from 'zod';
export const createBudgetSchema = z.object({
  name: z.string(),
  type: z.enum(['MONTHLY', 'YEARLY', 'QUARTERLY', 'VACATION', 'EVENT']),
  currency: z.string().length(3),
  totalAmount: z.number().positive(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export const updateBudgetSchema = z.object({
  name: z.string().optional(),
  type: z
    .enum(['MONTHLY', 'YEARLY', 'QUARTERLY', 'VACATION', 'EVENT'])
    .optional(),
  currency: z.string().length(3).optional(),
  totalAmount: z
    .number()
    .refine((val) => val !== 0, { message: 'Amount cannot be zero' })
    .optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  notes: z.string().optional(),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
