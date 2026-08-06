import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middleware/validateRequest.middleware';
import { createPaymentOrderSchema } from './payment.validation';
import { createPaymentOrderController } from './payment.controller';

/**
 * Mounted at /payments — POST /orders (initiate a purchase for one
 * report tier). Currently always backed by the placeholder
 * PaymentProvider (see payment.service.ts); a real gateway's
 * order-creation and verify/webhook routes will be added here later
 * without changing this route's shape for the "create order" step.
 */
export const paymentRouter = Router();

paymentRouter.post(
  '/orders',
  validateRequest(createPaymentOrderSchema),
  asyncHandler(createPaymentOrderController)
);
