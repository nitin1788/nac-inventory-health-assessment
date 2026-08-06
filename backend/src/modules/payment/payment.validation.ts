import { z } from 'zod';

export const createPaymentOrderSchema = z.object({
  assessmentId: z.string().uuid('Invalid assessment id.'),
  tier: z.enum(['summary', 'full']),
});
