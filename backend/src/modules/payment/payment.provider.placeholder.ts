import { TIER_PRICING } from './payment.types';
import type {
  PaymentCallbackResult,
  PaymentOrderRequest,
  PaymentOrderResult,
  PaymentProvider,
  PaymentVerificationResult,
} from './payment.types';

/**
 * Stands in for a real gateway until one is configured and wired into
 * payment.service.ts's `activeProvider` selection. Never creates a real
 * order or charges anything — always reports the gateway as
 * unavailable, with the tier's price so the frontend can still show
 * accurate pricing on the checkout page. The customer-facing message is
 * deliberately generic — never names a specific gateway or exposes any
 * integration/configuration detail.
 */
export const placeholderPaymentProvider: PaymentProvider = {
  name: 'placeholder',
  async createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult> {
    return {
      status: 'unavailable',
      message: 'Online payment is temporarily unavailable. Please try again shortly.',
      tier: request.tier,
      amountInPaise: TIER_PRICING[request.tier],
      currency: 'INR',
    };
  },
  async verifyPayment(): Promise<PaymentVerificationResult> {
    // Never reachable: an 'unavailable' order never gets a checkout
    // redirect, so nothing ever calls back to verify it.
    throw new Error('placeholderPaymentProvider cannot verify a payment — no gateway is configured.');
  },
  async handleCallback(): Promise<PaymentCallbackResult> {
    // Never reachable, same reasoning as verifyPayment above.
    throw new Error('placeholderPaymentProvider cannot handle a callback — no gateway is configured.');
  },
};
