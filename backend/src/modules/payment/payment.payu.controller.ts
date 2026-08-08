import type { Request, Response } from 'express';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { logger } from '../../utils/logger';
import { getAssessmentById } from '../assessment/assessment.service';
import { buildPayURedirectFormHtml } from './payment.provider.payu';
import { findPaymentOrderById, findPaymentOrderByProviderOrderId } from './payment.repository';
import { handlePaymentCallback, verifyAndFulfillOrder } from './payment.service';

/**
 * PayU-specific HTTP glue. Everything that decides "was this actually
 * paid" lives in payment.service.ts's verifyAndFulfillOrder (shared by
 * every provider); these handlers only translate PayU's HTTP shapes
 * (a GET redirect page, two form-POST callbacks) into that one call.
 */

/**
 * GET /payments/payu/redirect/:orderId — what createOrder()'s
 * `redirectUrl` actually points at. Server-renders a tiny auto-submit
 * HTML form (hash computed fresh, never stored) that sends the browser
 * on to PayU's hosted checkout. Public route: reachable only by knowing
 * an order id that PayU itself will also need in order to redirect back.
 */
export async function payuRedirectPageController(req: Request, res: Response): Promise<void> {
  const { orderId } = req.params;
  if (!orderId) {
    throw AppError.badRequest('Missing order id.');
  }

  const order = await findPaymentOrderById(orderId);
  if (!order || order.provider !== 'payu') {
    throw AppError.notFound('Payment order not found.');
  }

  const assessment = await getAssessmentById(order.assessmentId);
  const html = buildPayURedirectFormHtml(order, assessment);

  res.status(200).type('html').send(html);
}

function frontendThankYouUrl(orderId: string): string {
  if (!env.FRONTEND_BASE_URL) {
    throw AppError.serviceUnavailable('FRONTEND_BASE_URL is not configured.');
  }
  return `${env.FRONTEND_BASE_URL}/assessment/thank-you?orderId=${encodeURIComponent(orderId)}`;
}

function frontendPaymentRetryUrl(): string {
  if (!env.FRONTEND_BASE_URL) {
    throw AppError.serviceUnavailable('FRONTEND_BASE_URL is not configured.');
  }
  return `${env.FRONTEND_BASE_URL}/assessment/payment`;
}

/**
 * POST /payments/payu/success (PayU's `surl`). Never trusts this POST's
 * own `status` field: handleCallback() only authenticates the payload's
 * hash (a tamper check on this specific request), and
 * verifyAndFulfillOrder() always re-confirms with PayU's real Verify
 * Payment API before ever marking the order paid or generating a
 * report — so a forged/replayed POST to this URL with a fabricated
 * "success" status and no valid hash accomplishes nothing.
 */
export async function payuSuccessCallbackController(req: Request, res: Response): Promise<void> {
  const payload = req.body as Record<string, string | undefined>;

  const callback = await handlePaymentCallback(payload);
  if (!callback.signatureValid || !callback.providerOrderId) {
    logger.error({ txnid: payload.txnid }, 'PayU success callback failed hash authentication — redirecting to retry.');
    res.redirect(302, frontendPaymentRetryUrl());
    return;
  }

  const order = await findPaymentOrderByProviderOrderId(callback.providerOrderId);
  if (!order) {
    logger.error({ txnid: callback.providerOrderId }, 'PayU success callback referenced an unknown order.');
    res.redirect(302, frontendPaymentRetryUrl());
    return;
  }

  const rupees = Number.parseFloat(payload.amount ?? '');
  const expectedAmountInPaise = Number.isFinite(rupees) ? Math.round(rupees * 100) : undefined;

  try {
    await verifyAndFulfillOrder(order.id, { expectedAmountInPaise });
  } catch (err) {
    logger.error({ err, orderId: order.id }, 'PayU success callback could not be verified/fulfilled.');
    res.redirect(302, frontendPaymentRetryUrl());
    return;
  }

  res.redirect(302, frontendThankYouUrl(order.id));
}

/**
 * POST /payments/payu/failure (PayU's `furl`). PayU has already told us
 * this attempt failed — nothing to verify or fulfill, just send the
 * customer back to try again. The order row stays 'created' (never
 * marked 'paid'), so a retry is a normal new checkout attempt.
 */
export async function payuFailureCallbackController(req: Request, res: Response): Promise<void> {
  const payload = req.body as Record<string, string | undefined>;
  logger.warn(
    { txnid: payload.txnid, error: payload.error, errorMessage: payload.error_Message },
    'PayU reported a failed/cancelled payment.'
  );
  res.redirect(302, frontendPaymentRetryUrl());
}
