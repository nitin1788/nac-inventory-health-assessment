import type { ReportTier } from '@/config/constants';
import { apiClient } from './apiClient';
import { endpoints } from './endpoints';

export interface PaymentOrderRequest {
  assessmentId: string;
  tier: ReportTier;
}

export interface PaymentOrderResult {
  /**
   * 'unavailable': production default — no gateway yet, nothing generated.
   * 'created': a real gateway created a checkout order (future).
   * 'fulfilled': backend's internal-testing bypass — report already
   *   generated, emailed, and ready to download. Only ever returned by
   *   the backend when its PAYMENT_TEST_MODE env var is set; this
   *   frontend has no knowledge of that setting, it only reacts to
   *   whichever status the API actually returns.
   */
  status: 'unavailable' | 'created' | 'fulfilled';
  message: string;
  tier: ReportTier;
  amountInPaise: number;
  currency: 'INR';
}

/**
 * Initiates a purchase for one report tier. In production this comes
 * back with status: 'unavailable' (the backend's PaymentProvider is
 * still a placeholder — see backend/src/modules/payment/) — the call
 * still round-trips through the real /payments/orders endpoint so this
 * plumbing needs no changes once a real gateway is wired up server-side.
 */
export function createPaymentOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult> {
  return apiClient.post<PaymentOrderResult>(endpoints.paymentOrders, request);
}
