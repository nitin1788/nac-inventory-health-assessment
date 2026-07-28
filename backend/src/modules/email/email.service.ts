import { Resend } from 'resend';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { COMPANY_NAME, CONTACT, SERVICES_LIST } from '../../config/constants';
import type { AssessmentDetail } from '../assessment/assessment.types';
import type { GeneratedReportPdf } from '../pdf/pdf.service';

/**
 * Resend client for outbound email, mirroring the lazy-init +
 * "not configured" pattern used by database/supabaseClient.ts. Real
 * credentials are wired per-environment; when absent, callers get a
 * clear skip rather than a crash (see isEmailConfigured()).
 */
let client: Resend | null = null;

export function isEmailConfigured(): boolean {
  return Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL);
}

function getResendClient(): Resend {
  if (client) return client;

  if (!env.RESEND_API_KEY) {
    throw new Error('Resend is not configured. Set RESEND_API_KEY in .env.');
  }

  client = new Resend(env.RESEND_API_KEY);
  return client;
}

if (!isEmailConfigured()) {
  logger.warn(
    '⚠️  Resend credentials not set — assessment report emails will be skipped until configured.'
  );
}

function buildEmailSubject(assessment: AssessmentDetail): string {
  return `NAC Inventory Health Assessment Report – ${assessment.assessmentNumber}`;
}

function buildEmailText(assessment: AssessmentDetail): string {
  return [
    `Dear ${assessment.company.contactPerson},`,
    '',
    'Thank you for completing the NAC Inventory Health Assessment. Your full report is attached to this email as a PDF.',
    '',
    `Assessment Number: ${assessment.assessmentNumber}`,
    `Overall Score: ${assessment.overallScore} (${assessment.overallPercentage}%)`,
    `Health Rating: ${assessment.healthRating}`,
    '',
    'The attached report includes your module-wise scores, top findings, and recommendations.',
    '',
    '—',
    COMPANY_NAME,
    SERVICES_LIST,
    `${CONTACT.email} · ${CONTACT.phone}`,
  ].join('\n');
}

function buildEmailHtml(assessment: AssessmentDetail): string {
  return `
    <div style="font-family: Helvetica, Arial, sans-serif; color: #1E293B; max-width: 560px; margin: 0 auto; line-height: 1.5;">
      <p>Dear ${assessment.company.contactPerson},</p>
      <p>Thank you for completing the NAC Inventory Health Assessment. Your full report is attached to this email as a PDF.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 4px 0; color: #64748B; font-size: 13px;">Assessment Number</td>
          <td style="padding: 4px 0; font-weight: bold; text-align: right;">${assessment.assessmentNumber}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748B; font-size: 13px;">Overall Score</td>
          <td style="padding: 4px 0; font-weight: bold; text-align: right;">${assessment.overallScore} (${assessment.overallPercentage}%)</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748B; font-size: 13px;">Health Rating</td>
          <td style="padding: 4px 0; font-weight: bold; text-align: right;">${assessment.healthRating}</td>
        </tr>
      </table>
      <p>The attached report includes your module-wise scores, top findings, and recommendations.</p>
      <p style="margin-top: 28px; padding-top: 12px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B;">
        <strong style="color: #0F2A52;">${COMPANY_NAME}</strong><br />
        ${SERVICES_LIST}<br />
        ${CONTACT.email} · ${CONTACT.phone}
      </p>
    </div>
  `;
}

/**
 * Emails the already-generated PDF report to the customer who
 * submitted the assessment. A no-op (logged, not thrown) when Resend
 * isn't configured, so callers that treat this as a best-effort,
 * fire-and-forget step never need to special-case local/dev
 * environments.
 */
export async function sendAssessmentReportEmail(
  assessment: AssessmentDetail,
  report: GeneratedReportPdf
): Promise<void> {
  if (!isEmailConfigured()) {
    logger.warn({ assessmentId: assessment.id }, 'Skipping assessment report email — Resend not configured.');
    return;
  }

  const resend = getResendClient();
  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL as string,
    to: assessment.company.email,
    subject: buildEmailSubject(assessment),
    text: buildEmailText(assessment),
    html: buildEmailHtml(assessment),
    attachments: [{ filename: report.filename, content: report.buffer }],
  });

  if (error) {
    throw new Error(`Failed to send assessment report email: ${error.message}`);
  }

  logger.info(
    { assessmentId: assessment.id, resendMessageId: data?.id },
    'Assessment report email sent.'
  );
}
