import { TIER_PRICING } from './payment.types';
import type { PaymentOrderRequest, PaymentOrderResult, PaymentProvider } from './payment.types';

/**
 * Stands in for a real gateway until one is integrated. Never creates
 * a real order or charges anything — always reports the gateway as
 * unavailable, with the tier's price so the frontend can still show
 * accurate pricing on the placeholder payment page.
 */
export const placeholderPaymentProvider: PaymentProvider = {
  name: 'placeholder',
  async createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult> {
    return {
      status: 'unavailable',
      message: 'Payment Gateway Coming Soon.',
      tier: request.tier,
      amountInPaise: TIER_PRICING[request.tier],
      currency: 'INR',
    };
  },
};
