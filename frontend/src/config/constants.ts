/**
 * Non-secret, environment-independent constants used across features.
 */
export const APP_NAME = 'NAC Inventory Health Assessment';
export const COMPANY_NAME = 'Nitin Anand Consulting';

export const CONTACT = {
  email: 'nitinanandconsulting@gmail.com',
  phone: '+91 9619994347',
} as const;

export const ROUTES = {
  landing: '/',
  assessmentStart: '/assessment/start',
  assessmentQuestions: '/assessment/questions',
  thankYou: '/assessment/thank-you',
} as const;
