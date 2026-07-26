import { z } from 'zod';

/**
 * Company-info step validation. Mirrors the backend's CompanyRecord
 * shape (backend/src/modules/company/company.types.ts) — kept in
 * sync manually per the project's Zod-on-both-ends convention.
 */
export const companyInfoSchema = z.object({
  companyName: z.string().min(2, 'Enter your company name.'),
  contactName: z.string().min(2, 'Enter your full name.'),
  email: z.string().email('Enter a valid email address.'),
  phone: z.string().optional().or(z.literal('')),
  industry: z.string().min(1, 'Select your industry.'),
  companySize: z.string().min(1, 'Select your company size.'),
});

export type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;
