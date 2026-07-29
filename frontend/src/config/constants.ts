/**
 * Non-secret, environment-independent constants used across features.
 */
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

export const ROUTES = {
  landing: '/',
  assessmentStart: '/assessment/start',
  assessmentQuestions: '/assessment/questions',
  results: '/assessment/results',
  about: '/about',
  faq: '/faq',
  contactUs: '/contact-us',
  privacyPolicy: '/privacy-policy',
  termsAndConditions: '/terms-and-conditions',
} as const;

/** Production origin — used to build absolute URLs (sitemap, canonical links). */
export const SITE_URL = 'https://nitinanandconsulting.in';
