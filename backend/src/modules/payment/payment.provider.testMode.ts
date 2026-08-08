import { logger } from '../../utils/logger';
import { createPaymentOrder } from './payment.repository';
import { TIER_PRICING } from './payment.types';
import type {
  PaymentCallbackResult,
  PaymentOrderRequest,
  PaymentOrderResult,
  PaymentProvider,
  PaymentVerificationResult,
} from './payment.types';

/**
 * Frontend's Thank You page path — mirrored from frontend/src/config/
 * constants.ts's ROUTES.thankYou, per this repo's established
 * mirror-not-share convention (see docs/ARCHITECTURE.md; TIER_PRICING
 * above is mirrored the same way). Keep both in sync if the route path
 * ever changes.
 */
const THANK_YOU_PATH = '/assessment/thank-you';

/**
 * TEMPORARY internal-testing provider — only active when
 * PAYMENT_TEST_MODE=true (see backend/src/config/env.ts and
 * payment.service.ts), and always takes priority over PayU even if
 * PAYU_KEY/PAYU_SALT are also set. Creates a real payment_orders row
 * exactly like a production gateway would, then redirects straight to
 * our own Thank You page instead of a real checkout; verifyPayment
 * always reports the order paid immediately, standing in for an
 * instant, always-successful payment. This exercises the exact same
 * order-creation -> redirect -> verify -> deliver pipeline the real
 * PayU integration uses (see payment.provider.payu.ts) — only the
 * methods on this object differ; nothing downstream (the /verify
 * endpoint, the Thank You page, report delivery) changes based on
 * which provider is active.
 */
export const testModePaymentProvider: PaymentProvider = {
  name: 'test-mode',
  async createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult> {
    logger.warn(
      { assessmentId: request.assessmentId, tier: request.tier },
      'PAYMENT_TEST_MODE active — creating a test-mode order, no real payment involved.'
    );

    const order = await createPaymentOrder({
      assessmentId: request.assessmentId,
      tier: request.tier,
      amountInPaise: TIER_PRICING[request.tier],
      currency: 'INR',
      provider: 'test-mode',
    });

    return {
      status: 'created',
      message: 'Test mode: no real payment is taken — redirecting straight to the Thank You page.',
      tier: request.tier,
      amountInPaise: TIER_PRICING[request.tier],
      currency: 'INR',
      orderId: order.id,
      redirectUrl: `${THANK_YOU_PATH}?orderId=${order.id}`,
    };
  },
  async verifyPayment(): Promise<PaymentVerificationResult> {
    return { status: 'paid' };
  },
  async handleCallback(): Promise<PaymentCallbackResult> {
    // Never reachable: test-mode orders never leave this site, so no
    // external gateway ever calls back for one.
    throw new Error('testModePaymentProvider has no callback to handle — it never leaves this site.');
  },
};
