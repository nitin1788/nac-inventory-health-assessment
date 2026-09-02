import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { logger } from '../../utils/logger';
import { getResendClient, isEmailConfigured } from '../email/email.service';
import { SERVICE_INTEREST_LABELS, type SubmitLeadInput } from './leads.validation';

function buildLeadEmailSubject(input: SubmitLeadInput): string {
  return `New Contact Form Lead — ${input.businessName}`;
}

function buildLeadEmailText(input: SubmitLeadInput): string {
  return [
    'New enquiry submitted via the Contact Us page.',
    '',
    `Name: ${input.name}`,
    `Business Name: ${input.businessName}`,
    `Phone: ${input.phone}`,
    `Email: ${input.email}`,
    `Business Type: ${input.businessType}`,
    `Interested In: ${SERVICE_INTEREST_LABELS[input.serviceInterest]}`,
    '',
    'Message:',
    input.message?.trim() || '(none)',
    '',
    'Action Required: Contact this lead within one business day.',
  ].join('\n');
}

function buildLeadEmailHtml(input: SubmitLeadInput): string {
  return `
    <div style="font-family: Helvetica, Arial, sans-serif; color: #1E293B; max-width: 560px; margin: 0 auto; line-height: 1.5;">
      <p>New enquiry submitted via the Contact Us page.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
        <tr><td style="padding: 4px 0; color: #64748B;">Name</td><td style="padding: 4px 0; font-weight: bold; text-align: right;">${input.name}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;">Business Name</td><td style="padding: 4px 0; font-weight: bold; text-align: right;">${input.businessName}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;">Phone</td><td style="padding: 4px 0; font-weight: bold; text-align: right;">${input.phone}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;">Email</td><td style="padding: 4px 0; font-weight: bold; text-align: right;">${input.email}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;">Business Type</td><td style="padding: 4px 0; font-weight: bold; text-align: right;">${input.businessType}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;">Interested In</td><td style="padding: 4px 0; font-weight: bold; text-align: right;">${SERVICE_INTEREST_LABELS[input.serviceInterest]}</td></tr>
      </table>
      <p style="font-size: 13px; white-space: pre-wrap;">${input.message?.trim() || '(no message)'}</p>
    </div>
  `;
}

/**
 * Sends the Contact Us lead straight to NAC's internal inbox via Resend —
 * no Supabase persistence, matching the precedent already set by
 * businessHealthCheck.service.ts (see NAC_TECHNICAL_SEO_FINAL_REPORT.md
 * §27 for why: a simple enquiry doesn't need a queryable DB record, and
 * Supabase stays trivial to add later if lead volume ever justifies it).
 */
export async function submitLead(input: SubmitLeadInput): Promise<void> {
  if (!isEmailConfigured()) {
    logger.warn({ businessName: input.businessName }, 'Skipping contact form lead email — Resend not configured.');
    throw AppError.serviceUnavailable('Email delivery is not configured.');
  }

  if (!env.NAC_LEAD_ALERT_EMAIL) {
    logger.warn({ businessName: input.businessName }, 'Skipping contact form lead email — no recipient configured.');
    throw AppError.serviceUnavailable('No recipient configured for this enquiry.');
  }

  const resend = getResendClient();
  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL as string,
    to: env.NAC_LEAD_ALERT_EMAIL,
    replyTo: input.email,
    subject: buildLeadEmailSubject(input),
    text: buildLeadEmailText(input),
    html: buildLeadEmailHtml(input),
  });

  if (error) {
    throw AppError.internal(`Failed to send contact form lead email: ${error.message}`);
  }

  logger.info(
    { businessName: input.businessName, resendMessageId: data?.id },
    'Contact form lead email accepted by Resend.'
  );
}
