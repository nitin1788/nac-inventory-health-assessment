import { z } from 'zod';

/**
 * The /contact page's lead form (frontend/src/pages/ContactUsPage.tsx).
 * `businessType` is deliberately a free string, not an enum — it's
 * populated from the site's INDUSTRIES_LIST content data, which can grow
 * without a backend deploy; `serviceInterest` is a fixed enum since it's
 * only ever one of the two service verticals (or both/undecided).
 */
export const submitLeadSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  businessName: z.string().trim().min(1, 'Business name is required').max(200),
  phone: z.string().trim().min(1, 'Phone number is required').max(30),
  email: z.string().trim().email('Enter a valid email address').max(200),
  businessType: z.string().trim().min(1, 'Business type is required').max(200),
  serviceInterest: z.enum(['inventory-operations', 'digital-marketing', 'both', 'not-sure'], {
    errorMap: () => ({ message: 'Select a service you are interested in' }),
  }),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
});

export type SubmitLeadInput = z.infer<typeof submitLeadSchema>;

export const SERVICE_INTEREST_LABELS: Record<SubmitLeadInput['serviceInterest'], string> = {
  'inventory-operations': 'Inventory & Operations Consulting',
  'digital-marketing': 'Digital Marketing & Growth',
  both: 'Both',
  'not-sure': 'Not sure yet',
};
