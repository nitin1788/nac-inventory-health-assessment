import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { getAssessmentById } from '../assessment/assessment.service';
import { deliverPaidReport } from '../report/report.service';
import { placeholderPaymentProvider } from './payment.provider.placeholder';
import { testModePaymentProvider } from './payment.provider.testMode';
import { findPaidOrder, findPaymentOrderById, markPaymentPaidIfPending, markReportDelivered } from './payment.repository';
import type {
  PaymentOrderRequest,
  PaymentOrderResult,
  PaymentProvider,
  ReportTier,
  VerifiedOrderDetails,
} from './payment.types';

/**
 * The provider selection a real Cashfree integration will eventually
 * replace with an unconditional `cashfreePaymentProvider` — the only
 * line that needs to change. Until Cashfree activates, PAYMENT_TEST_MODE
 * is the only thing that can move this off the production-safe
 * placeholder; see payment.provider.testMode.ts and env.ts.
 */
const activeProvider: PaymentProvider = env.PAYMENT_TEST_MODE ? testModePaymentProvider : placeholderPaymentProvider;

export async function createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult> {
  return activeProvider.createOrder(request);
}

/**
 * The single source of truth for "has this exact assessment+tier been
 * paid for" — consulted by the report-download endpoint. Replaces the
 * previous global PAYMENT_TEST_MODE on/off switch with a real,
 * per-assessment fact: a paid `payment_orders` row must exist. Works
 * identically for a test-mode order (once verified) and a real Cashfree
 * order later — no special-casing either provider.
 */
export async function isReportUnlocked(assessmentId: string, tier: ReportTier): Promise<boolean> {
  const paidOrder = await findPaidOrder(assessmentId, tier);
  return paidOrder !== null;
}

/**
 * The shared fulfillment path every provider's payment confirmation
 * funnels through — called by the /payments/verify endpoint today, and
 * by a future Cashfree webhook handler too, so "what happens once a
 * payment is confirmed paid" is written exactly once.
 *
 * Never trusts the caller's say-so: it always asks `activeProvider` for
 * the authoritative status (test-mode's instant "paid," or a real
 * gateway's own order-status lookup). Report generation/email only ever
 * runs on the specific call that wins the atomic `created -> paid`
 * transition (see markPaymentPaidIfPending) — a duplicate verify call
 * against an already-paid order is a no-op, not a re-delivery.
 */
export async function verifyAndFulfillOrder(orderId: string): Promise<VerifiedOrderDetails> {
  const order = await findPaymentOrderById(orderId);
  if (!order) {
    throw AppError.notFound('Payment order not found.');
  }

  if (order.status !== 'paid') {
    const verification = await activeProvider.verifyPayment(order.providerOrderId ?? order.id);

    if (verification.status === 'paid') {
      const nowPaid = await markPaymentPaidIfPending(order.id, verification.providerPaymentId);

      // Only the caller that actually won the created -> paid transition
      // delivers the report — a concurrent/duplicate call gets `null`
      // here and falls through to the fresh-read below instead.
      if (nowPaid) {
        await deliverPaidReport(nowPaid.assessmentId, nowPaid.tier);
        await markReportDelivered(nowPaid.id);
      }
    }
  }

  const finalOrder = await findPaymentOrderById(orderId);
  if (!finalOrder) {
    throw AppError.notFound('Payment order not found.');
  }
  if (finalOrder.status !== 'paid') {
    throw AppError.badRequest('Payment has not been completed for this order yet.');
  }

  const assessment = await getAssessmentById(finalOrder.assessmentId);

  return {
    orderId: finalOrder.id,
    assessmentId: finalOrder.assessmentId,
    assessmentNumber: assessment.assessmentNumber,
    customerName: assessment.company.contactPerson,
    tier: finalOrder.tier,
    amountInPaise: finalOrder.amountInPaise,
    currency: 'INR',
    paidAt: finalOrder.updatedAt,
    reportDelivered: Boolean(finalOrder.reportDeliveredAt),
  };
}
