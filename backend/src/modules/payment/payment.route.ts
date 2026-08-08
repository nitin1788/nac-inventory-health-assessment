import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middleware/validateRequest.middleware';
import { createPaymentOrderSchema, payuRedirectParamsSchema, verifyPaymentSchema } from './payment.validation';
import { createPaymentOrderController, verifyPaymentController } from './payment.controller';
import {
  payuFailureCallbackController,
  payuRedirectPageController,
  payuSuccessCallbackController,
} from './payment.payu.controller';

/**
 * Mounted at /payments.
 *
 * - POST /orders — initiate a purchase for one report tier.
 * - POST /verify — client-triggered, server-side payment confirmation
 *   (see payment.service.ts's verifyAndFulfillOrder).
 * - GET /payu/redirect/:orderId, POST /payu/success, POST /payu/failure
 *   — PayU-specific: the hosted-checkout redirect page and PayU's own
 *   surl/furl callbacks. All three are public by necessity (PayU calls
 *   them directly, not the frontend) — request authenticity comes from
 *   PayU's hash signature (see payuHash.ts), not from auth middleware.
 *   No validateRequest body schema on the callback routes: PayU controls
 *   that payload's shape, and hash validation *is* the validation.
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

paymentRouter.get(
  '/payu/redirect/:orderId',
  validateRequest(payuRedirectParamsSchema, 'params'),
  asyncHandler(payuRedirectPageController)
);

paymentRouter.post('/payu/success', asyncHandler(payuSuccessCallbackController));

paymentRouter.post('/payu/failure', asyncHandler(payuFailureCallbackController));
