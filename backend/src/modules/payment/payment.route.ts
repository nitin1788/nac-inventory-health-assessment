import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middleware/validateRequest.middleware';
import { createPaymentOrderSchema, verifyPaymentSchema } from './payment.validation';
import { createPaymentOrderController, verifyPaymentController } from './payment.controller';

/**
 * Mounted at /payments — POST /orders (initiate a purchase for one
 * report tier), POST /verify (server-side payment confirmation — see
 * payment.service.ts's verifyAndFulfillOrder). Currently backed by
 * either the placeholder or test-mode PaymentProvider (see
 * payment.service.ts); a real Cashfree webhook route will be added
 * here later without changing either of these two routes' shape.
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
