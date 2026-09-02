import { z } from 'zod';
import { INDUSTRIES_LIST } from '@/config/industries.data';

/** Populated from the site's own industry content, not a separate hardcoded list — stays in sync automatically as industries.data.ts grows. */
export const BUSINESS_TYPE_OPTIONS = [...INDUSTRIES_LIST.map((industry) => industry.name), 'Other'] as const;

export const SERVICE_INTEREST_OPTIONS = [
  { value: 'inventory-operations', label: 'Inventory & Operations Consulting' },
  { value: 'digital-marketing', label: 'Digital Marketing & Growth' },
  { value: 'both', label: 'Both' },
  { value: 'not-sure', label: 'Not sure yet' },
] as const;

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.'),
  businessName: z.string().trim().min(1, 'Enter your business name.'),
  phone: z.string().trim().min(6, 'Enter a valid phone number.'),
  email: z.string().trim().email('Enter a valid email address.'),
  businessType: z.string().min(1, 'Select your business type.'),
  serviceInterest: z.enum(['inventory-operations', 'digital-marketing', 'both', 'not-sure'], {
    errorMap: () => ({ message: 'Select what you are interested in.' }),
  }),
  message: z.string().trim().max(2000, 'Keep it under 2000 characters.').optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export type ContactFormFieldType = 'text' | 'email' | 'tel' | 'select' | 'textarea';

export interface ContactFormField {
  name: keyof ContactFormValues;
  label: string;
  type: ContactFormFieldType;
  placeholder?: string;
  options?: readonly string[];
}

/** Drives the dynamically-generated form (ContactForm.tsx) — no hardcoded fields, mirrors CompanyInfoForm.tsx's pattern. */
export const CONTACT_FORM_FIELDS: ContactFormField[] = [
  { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Jane Doe' },
  { name: 'businessName', label: 'Business Name', type: 'text', placeholder: 'Shree Ganesh Medical Store' },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210' },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'jane@business.com' },
  { name: 'businessType', label: 'Business Type', type: 'select', options: BUSINESS_TYPE_OPTIONS },
];
