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
  payment: '/assessment/payment',
  about: '/about',
  faq: '/faq',
  contactUs: '/contact-us',
  privacyPolicy: '/privacy-policy',
  termsAndConditions: '/terms-and-conditions',
  inventoryConsulting: '/inventory-consulting',
  warehouseConsulting: '/warehouse-consulting',
  operationsConsulting: '/operations-consulting',
  sopDevelopment: '/sop-development',
  businessAnalytics: '/business-analytics',
  trainingImplementation: '/training-implementation',
  blog: '/blog',
  caseStudies: '/case-studies',
  freeDownloads: '/free-downloads',
  checklists: '/checklists',
  templates: '/templates',
} as const;

/** Production origin — used to build absolute URLs (sitemap, canonical links). */
export const SITE_URL = 'https://nitinanandconsulting.in';

/** Default social share image for Open Graph / Twitter Card tags. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/android-chrome-512x512.png`;

export type ReportTier = 'summary' | 'full';

export interface ReportTierOption {
  id: ReportTier;
  title: string;
  priceDisplay: string;
  amountInPaise: number;
  features: string[];
}

/**
 * Mirrors backend/src/modules/payment/payment.types.ts's TIER_PRICING
 * — mirrored, not shared, per this repo's existing Zod-schema
 * convention (see docs/ARCHITECTURE.md). Keep both in sync if pricing
 * or feature copy changes.
 */
export const REPORT_TIERS: ReportTierOption[] = [
  {
    id: 'summary',
    title: 'Report Summary',
    priceDisplay: '₹99',
    amountInPaise: 9900,
    features: ['Overall Score', 'Module Scores', 'Top 5 Findings', 'Top 5 Recommendations'],
  },
  {
    id: 'full',
    title: 'Full Professional Report',
    priceDisplay: '₹299',
    amountInPaise: 29900,
    features: [
      'Complete Analysis',
      'Module-wise Findings',
      'Root Cause Analysis',
      'Priority Matrix',
      'Recommendations',
      'Action Plan',
      'Professional PDF Report',
    ],
  },
];

/** Registered business details — used for the ProfessionalService JSON-LD schema. */
export const BUSINESS_INFO = {
  name: COMPANY_NAME,
  legalType: 'ProfessionalService',
  telephone: '+91 8779295873',
  address: {
    streetAddress: 'Amboli, Andheri West',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    postalCode: '400058',
    addressCountry: 'IN',
  },
  areaServed: ['Mumbai', 'MMR', 'Maharashtra', 'India'],
  services: [
    'Inventory Health Assessment',
    'Inventory Audit',
    'Warehouse Audit',
    'Warehouse Consulting',
    'Inventory Consulting',
    'Operations Consulting',
    'SOP Development',
    'Process Improvement',
    'Business Analytics',
  ],
} as const;
