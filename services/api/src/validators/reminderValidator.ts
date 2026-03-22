import { z } from 'zod';

export const createReminderSchema = z.object({
  title: z.string(),
  dateTime: z.coerce.date(),
  recurring: z.boolean().default(false),
  recurrenceFrequency: z
    .enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'])
    .optional(),
  notes: z.string().optional(),
  interval: z.int().positive().default(1),
});
export const updateReminderSchema = z.object({
  title: z.string().optional(),
  dateTime: z.coerce.date().optional(),
  recurring: z.boolean().optional(),
  recurrenceFrequency: z
    .enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'])
    .optional(),
  notes: z.string().optional(),
  interval: z.int().positive().optional(),
});

export type CreateReminderInput = z.infer<typeof createReminderSchema>;
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>;
