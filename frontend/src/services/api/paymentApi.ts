import type { ReportTier } from '@/config/constants';
import { apiClient } from './apiClient';
import { endpoints } from './endpoints';

export interface PaymentOrderRequest {
  assessmentId: string;
  tier: ReportTier;
}

export interface PaymentOrderResult {
  status: 'unavailable' | 'created';
  message: string;
  tier: ReportTier;
  amountInPaise: number;
  currency: 'INR';
}

/**
 * Initiates a purchase for one report tier. Today this always comes
 * back with status: 'unavailable' (the backend's PaymentProvider is
 * still a placeholder — see backend/src/modules/payment/) — the call
 * still round-trips through the real /payments/orders endpoint so this
 * plumbing needs no changes once a real gateway is wired up server-side.
 */
export function createPaymentOrder(request: PaymentOrderRequest): Promise<PaymentOrderResult> {
  return apiClient.post<PaymentOrderResult>(endpoints.paymentOrders, request);
}
