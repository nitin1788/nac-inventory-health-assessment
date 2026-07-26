import { z } from 'zod';

/**
 * Company Profile — captured once, before the assessment questions,
 * and stored separately from question answers (a partial drop-off
 * still yields a contactable lead; see PRD Section 4).
 *
 * Fields and options below are transcribed verbatim from the live
 * "FREE Inventory Health Check Assessment" Google Form (Nitin Anand
 * Consulting) — with one exception: the form's "Industry" field is a
 * dropdown that renders as a collapsed "Choose ▾" menu in the
 * exported PDF, so its real option list isn't visible in that source
 * document. INDUSTRY_OPTIONS below reuses NAC's already-established
 * industry list from the landing page (features/landing/landing.data.ts)
 * as a best-effort placeholder — confirm against the live form and
 * replace if the exact wording differs.
 */
export const BUSINESS_TYPE_OPTIONS = [
  'Retail Store',
  'Wholesale',
  'Distributor',
  'Manufacturing Unit',
  'Warehouse / Logistics',
  'E-commerce',
  'Other',
] as const;

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

export const EMPLOYEE_COUNT_OPTIONS = ['1–10', '11–25', '26–50', '51–100', 'More than 100'] as const;

export const INVENTORY_LOCATIONS_OPTIONS = ['1', '2–5', '6–10', 'More than 10'] as const;

export const ACTIVE_SKU_OPTIONS = ['Below 500', '500–2,000', '2,001–10,000', 'Above 10,000'] as const;

export const companyProfileSchema = z
  .object({
    companyName: z.string().min(2, 'Enter your company name.'),
    contactPerson: z.string().min(2, "Enter the contact person's name."),
    designation: z.string().min(1, 'Enter your designation.'),
    mobileNumber: z.string().min(6, 'Enter a valid mobile number.'),
    email: z.string().email('Enter a valid email address.'),
    businessType: z.enum(BUSINESS_TYPE_OPTIONS, {
      errorMap: () => ({ message: 'Select your business type.' }),
    }),
    // Only meaningful (and required) when businessType === 'Other' — see superRefine below.
    businessTypeOther: z.string().optional(),
    industry: z.enum(INDUSTRY_OPTIONS, { errorMap: () => ({ message: 'Select your industry.' }) }),
    numberOfEmployees: z.enum(EMPLOYEE_COUNT_OPTIONS, {
      errorMap: () => ({ message: 'Select your number of employees.' }),
    }),
    numberOfInventoryLocations: z.enum(INVENTORY_LOCATIONS_OPTIONS, {
      errorMap: () => ({ message: 'Select your number of inventory locations.' }),
    }),
    approximateActiveSkus: z.enum(ACTIVE_SKU_OPTIONS, {
      errorMap: () => ({ message: 'Select your approximate number of active SKUs.' }),
    }),
  })
  .superRefine((values, ctx) => {
    if (values.businessType === 'Other' && !values.businessTypeOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['businessTypeOther'],
        message: 'Specify your business type.',
      });
    }
  });

export type CompanyProfile = z.infer<typeof companyProfileSchema>;
