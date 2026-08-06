/**
 * Central place for API path strings so no feature module hardcodes a
 * route inline. Base URL (including /api/v1 prefix) is handled by
 * apiClient — these are the paths appended to it.
 */
export const endpoints = {
  health: '/health',
  assessments: '/assessments',
  paymentOrders: '/payments/orders',
  reportPdf: (assessmentId: string) => `/reports/${assessmentId}/pdf`,
  // Milestone 4+: questions: '/questions'
} as const;
