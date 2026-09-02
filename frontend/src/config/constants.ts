/**
 * Non-secret, environment-independent constants used across features.
 */
export const APP_NAME = 'Nitin Anand Consulting';
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
  // Unlinked from navigation as of the Phase 1 pharmacy/healthcare
  // repositioning — routes/pages/backend are untouched and still work,
  // they're simply no longer referenced from Navbar/Footer/homepage.
  // See NAC_PHASE_1_IMPLEMENTATION_PLAN.md.
  assessmentStart: '/assessment/start',
  assessmentQuestions: '/assessment/questions',
  results: '/assessment/results',
  payment: '/assessment/payment',
  thankYou: '/assessment/thank-you',
  about: '/about',
  faq: '/faq',
  /** Current canonical contact route. `/contact-us` (old) redirects here — see routes.tsx. */
  contactUs: '/contact',
  /** Legacy path, redirected to `contactUs` above. Not used for new links. */
  contactUsLegacy: '/contact-us',
  privacyPolicy: '/privacy-policy',
  termsAndConditions: '/terms-and-conditions',
  // Old fixed-slug service pages — kept as redirect targets to the new
  // services hub, not deleted. See routes.tsx.
  inventoryConsulting: '/inventory-consulting',
  warehouseConsulting: '/warehouse-consulting',
  operationsConsulting: '/operations-consulting',
  sopDevelopment: '/sop-development',
  businessAnalytics: '/business-analytics',
  trainingImplementation: '/training-implementation',
  /** Legacy Phase-1 top-level vertical paths — redirected to the `/services/*` structure below. */
  inventoryHubLegacy: '/inventory-operations-consulting',
  digitalMarketingHubLegacy: '/digital-marketing-services',
  // Services structure: /services hub + two vertical hubs, each with its own service detail pages.
  servicesHub: '/services',
  inventoryHub: '/services/inventory-operations-consulting',
  inventoryService: (slug: string) => `/services/inventory-operations-consulting/${slug}`,
  digitalMarketingHub: '/services/digital-marketing',
  digitalService: (slug: string) => `/services/digital-marketing/${slug}`,
  // New industries structure.
  industriesHub: '/industries',
  industry: (slug: string) => `/industries/${slug}`,
  blog: '/blog',
  blogPost: (slug: string) => `/blog/${slug}`,
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
  telephone: '+91 9619994347',
  address: {
    streetAddress: 'Amboli, Andheri West',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    postalCode: '400058',
    addressCountry: 'IN',
  },
  areaServed: ['Mumbai', 'MMR', 'Maharashtra', 'India'],
  services: [
    'Inventory Audit',
    'Inventory Reconciliation',
    'ABC & FSN Analysis',
    'Stock Optimization',
    'SOP Development',
    'KPI & MIS Dashboards',
    'Website Development',
    'SEO & Local SEO',
    'Google Ads & Meta Ads',
    'Social Media Management',
  ],
} as const;
