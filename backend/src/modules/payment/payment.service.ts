import { placeholderPaymentProvider } from './payment.provider.placeholder';
import type { PaymentOrderRequest, PaymentOrderResult, PaymentProvider } from './payment.types';

/**
 * The single line to change when a real gateway is ready — swap this
 * for `razorpayPaymentProvider` (or any other PaymentProvider
 * implementation). Nothing else in this module, or in assessment/report
 * generation, needs to change to switch providers.
 */
const activeProvider: PaymentProvider = placeholderPaymentProvider;

export async function createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult> {
  return activeProvider.createOrder(request);
}
