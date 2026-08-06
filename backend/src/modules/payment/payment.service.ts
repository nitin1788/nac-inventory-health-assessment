import { env } from '../../config/env';
import { placeholderPaymentProvider } from './payment.provider.placeholder';
import { testModePaymentProvider } from './payment.provider.testMode';
import type { PaymentOrderRequest, PaymentOrderResult, PaymentProvider } from './payment.types';

/**
 * The provider selection a real gateway integration will eventually
 * replace with an unconditional `razorpayPaymentProvider` (or similar)
 * — the only line that needs to change. Until then, PAYMENT_TEST_MODE
 * is the only thing that can move this off the production-safe
 * placeholder; see payment.provider.testMode.ts and env.ts.
 */
const activeProvider: PaymentProvider = env.PAYMENT_TEST_MODE ? testModePaymentProvider : placeholderPaymentProvider;

export async function createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult> {
  return activeProvider.createOrder(request);
}

/**
 * Whether report downloads should be allowed without a real payment.
 * Consulted only by the report-download route (see
 * assessment.controller.ts's getAssessmentReportPdfController) — kept
 * here so "is a report allowed to be delivered right now" has exactly
 * one source of truth, shared by both the order-creation flow and the
 * download endpoint.
 */
export function isTestModeActive(): boolean {
  return activeProvider.name === testModePaymentProvider.name;
}
