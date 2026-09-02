import type { ContactFormValues } from '@/features/contact/contactFormSchema';
import { apiClient } from './apiClient';
import { endpoints } from './endpoints';

/** Submits the Contact Us form. Backend emails the lead to NAC via Resend — see backend/src/modules/leads. */
export async function submitLead(payload: ContactFormValues): Promise<void> {
  await apiClient.post<{ delivered: boolean }>(endpoints.leads, payload);
}
