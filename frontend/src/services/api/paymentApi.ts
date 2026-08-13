import type { ReportTier } from '@/config/constants';
import { apiClient } from './apiClient';
import { endpoints } from './endpoints';

export interface PaymentOrderRequest {
  assessmentId: string;
  tier: ReportTier;
}

export interface PaymentOrderResult {
  /**
   * 'unavailable': production default — no gateway yet, nothing created.
   * 'created': a real gateway's checkout order exists — this frontend
   *   builds a real <form method="post"> from `checkoutForm` and submits
   *   it itself (see PaymentPlaceholderView.tsx), with no knowledge of
   *   which provider produced it.
   */
  status: 'unavailable' | 'created';
  message: string;
  tier: ReportTier;
  amountInPaise: number;
  currency: 'INR';
  orderId?: string;
  /**
   * The complete gateway handoff to POST directly to — present when
   * status === 'created'. `fields` becomes one hidden <input> per entry.
   */
  checkoutForm?: {
    action: string;
    fields: Record<string, string>;
  };
}

export interface VerifyPaymentRequest {
  orderId: string;
}

/** The full picture the Thank You page renders, once the backend confirms the order is paid. */
export interface VerifiedOrderDetails {
  orderId: string;
  assessmentId: string;
  assessmentNumber: string;
  customerName: string;
  tier: ReportTier;
  amountInPaise: number;
  currency: 'INR';
  paidAt: string;
  reportDelivered: boolean;
}

/**
 * Initiates a purchase for one report tier. In production this comes
 * back with status: 'unavailable' (the backend's PaymentProvider is
 * still a placeholder — see backend/src/modules/payment/) — the call
 * still round-trips through the real /payments/orders endpoint so this
 * plumbing needs no changes once a real gateway is wired up server-side.
 */
export function createPaymentOrder(
  request: PaymentOrderRequest,
  opts?: { timeoutMs?: number }
): Promise<PaymentOrderResult> {
  return apiClient.post<PaymentOrderResult>(endpoints.paymentOrders, request, opts);
}

/**
 * Confirms an order server-side. This call itself carries no "did the
 * payment succeed" claim from the frontend — only the order id; the
 * backend independently asks its active PaymentProvider for the
 * authoritative status (see backend's payment.service.ts).
 */
export function verifyPayment(request: VerifyPaymentRequest): Promise<VerifiedOrderDetails> {
  return apiClient.post<VerifiedOrderDetails>(endpoints.paymentVerify, request);
}
