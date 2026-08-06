import { logger } from '../../utils/logger';
import { deliverPaidReport } from '../report/report.service';
import { TIER_PRICING } from './payment.types';
import type { PaymentOrderRequest, PaymentOrderResult, PaymentProvider } from './payment.types';

/**
 * TEMPORARY internal-testing provider — only active when
 * PAYMENT_TEST_MODE=true (see backend/src/config/env.ts and
 * payment.service.ts). Bypasses the payment gateway entirely: calling
 * createOrder immediately generates the report, emails the customer,
 * and makes the report downloadable, with no payment ever taking
 * place. Never active in production unless that env var is explicitly
 * set to 'true' there — which it must not be.
 *
 * Calls the exact same report.service.ts function a real gateway's
 * payment-confirmation callback will call later — swapping this out
 * for `razorpayPaymentProvider` doesn't touch report generation logic
 * at all, only which provider decides when to call it.
 */
export const testModePaymentProvider: PaymentProvider = {
  name: 'test-mode',
  async createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult> {
    logger.warn(
      { assessmentId: request.assessmentId, tier: request.tier },
      'PAYMENT_TEST_MODE active — bypassing payment and fulfilling report immediately.'
    );

    await deliverPaidReport(request.assessmentId, request.tier);

    return {
      status: 'fulfilled',
      message: 'Test mode: your report has been generated and emailed.',
      tier: request.tier,
      amountInPaise: TIER_PRICING[request.tier],
      currency: 'INR',
    };
  },
};
