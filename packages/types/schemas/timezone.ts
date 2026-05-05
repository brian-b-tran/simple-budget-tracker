import z from 'zod';

export const getExpenseTotalsQuerySchema = z.object({
  timeZone: z.string().min(1),
});
