import type { ReportTier } from '@/config/constants';

/**
 * Central place for API path strings so no feature module hardcodes a
 * route inline. Base URL (including /api/v1 prefix) is handled by
 * apiClient — these are the paths appended to it.
 */
export const endpoints = {
  health: '/health',
  assessments: '/assessments',
  paymentOrders: '/payments/orders',
  paymentVerify: '/payments/verify',
  leads: '/leads',
  reportPdf: (assessmentId: string, tier: ReportTier) => `/reports/${assessmentId}/pdf?tier=${tier}`,
  // Milestone 4+: questions: '/questions'
} as const;
