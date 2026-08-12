import { z } from 'zod';

export const createPaymentOrderSchema = z.object({
  assessmentId: z.string().uuid('Invalid assessment id.'),
  tier: z.enum(['summary', 'full']),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().uuid('Invalid order id.'),
});

/** :orderId on GET /payments/payu/redirect/:orderId. PayU's own success/failure POST bodies are intentionally NOT schema-validated here — hash authentication (see payuHash.ts) is what validates them. */
export const payuRedirectParamsSchema = z.object({
  orderId: z.string().uuid('Invalid order id.'),
});
