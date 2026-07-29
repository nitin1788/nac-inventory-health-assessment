/**
 * Non-secret application constants.
 * Secrets and environment-dependent values belong in env.ts, not here.
 */
export const API_PREFIX = '/api/v1';

export const APP_NAME = 'NAC Inventory Health Assessment';
export const COMPANY_NAME = 'Nitin Anand Consulting';

export const CONTACT = {
  email: 'nitinanandconsulting@gmail.com',
  phone: '+91 9619994347',
} as const;

export const CONSULTATION = {
  serviceName: 'Inventory Assessment Review & Consultation',
  description:
    'Get expert guidance to review your Inventory Health Assessment report, understand key findings, identify improvement opportunities, and receive practical recommendations to improve your inventory and store / warehouse operations.',
  duration: '30 Minutes',
  mode: 'Zoom Meeting',
  fee: '₹499',
  ctaLabel: 'Book Consultation – ₹499',
} as const;

/** Website + footer contact used in outbound emails. */
export const SITE_URL = 'https://nitinanandconsulting.in';
export const FOOTER_EMAIL = 'nitinanandconsulting@gmail.com';

export const SERVICES_LIST =
  'Inventory Audit · Warehouse Audit · Inventory Optimization · SOP Development · Business Process Improvement';

export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
};

export const ASSESSMENT_SUBMIT_RATE_LIMIT = {
  WINDOW_MS: 60 * 60 * 1000, // 1 hour
  MAX_REQUESTS: 5, // per IP — generous for genuine users, tight enough to blunt spam
};
