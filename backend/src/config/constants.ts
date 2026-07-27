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
