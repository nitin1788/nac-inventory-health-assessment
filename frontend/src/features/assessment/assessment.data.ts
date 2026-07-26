/**
 * Options for the company-info step. Industries mirror the target
 * customer list already used on the landing page
 * (features/landing/landing.data.ts INDUSTRIES) for consistency.
 */
export const INDUSTRY_OPTIONS = [
  'Manufacturing',
  'Pharmaceutical',
  'Medical Distribution',
  'Electrical & Hardware',
  'Warehousing',
  'Retail',
  'FMCG Distribution',
  'Import & Export',
  'SME / Other',
] as const;

export const COMPANY_SIZE_OPTIONS = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '500+ employees',
] as const;
