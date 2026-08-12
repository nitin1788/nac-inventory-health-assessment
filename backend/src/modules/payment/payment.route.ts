import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middleware/validateRequest.middleware';
import { createPaymentOrderSchema, verifyPaymentSchema } from './payment.validation';
import { createPaymentOrderController, verifyPaymentController } from './payment.controller';

/**
 * Mounted at /payments.
 *
 * - POST /orders — initiate a purchase for one report tier.
 * - POST /verify — client-triggered, server-side payment confirmation
 *   (see payment.service.ts's verifyAndFulfillOrder).
 *
 * No real gateway is currently wired in (see payment.service.ts) — a
 * future gateway's own redirect/callback routes get added back here
 * alongside it (typically a public GET redirect route plus
 * provider-specific callback routes), once one is integrated.
 */
export const paymentRouter = Router();

paymentRouter.post(
  '/orders',
  validateRequest(createPaymentOrderSchema),
  asyncHandler(createPaymentOrderController)
);

paymentRouter.post(
  '/verify',
  validateRequest(verifyPaymentSchema),
  asyncHandler(verifyPaymentController)
);
