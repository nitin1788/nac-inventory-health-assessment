import { env } from '../../config/env';
import { BUSINESS_HEALTH_CHECK_MAX_PDF_BYTES } from '../../config/constants';
import { AppError } from '../../utils/AppError';
import { logger } from '../../utils/logger';
import { getResendClient, isEmailConfigured } from '../email/email.service';
import type { SubmitBusinessHealthCheckReportInput } from './businessHealthCheck.validation';

const REPORT_ATTACHMENT_FILENAME = 'NAC-Business-Health-Check-Report.pdf';
const PDF_MAGIC_BYTES = '%PDF-';

/**
 * Decodes the client-supplied PDF data URL into a Buffer. Never trusts the
 * client's declared content type (there isn't one to trust — pdfBase64 is
 * just a string) — the actual bytes are sniffed for the real PDF magic
 * number below, and re-checked for size, independent of what the Zod
 * schema already bounded the raw string length to.
 */
function decodeAndValidatePdf(pdfBase64: string): Buffer {
  const base64Payload = pdfBase64.split('base64,')[1] ?? '';
  const buffer = Buffer.from(base64Payload, 'base64');

  if (buffer.length === 0) {
    throw AppError.badRequest('PDF data is empty or malformed.');
  }

  if (buffer.length > BUSINESS_HEALTH_CHECK_MAX_PDF_BYTES) {
    throw AppError.badRequest('PDF exceeds the maximum allowed size.');
  }

  if (buffer.subarray(0, 5).toString('ascii') !== PDF_MAGIC_BYTES) {
    throw AppError.badRequest('File is not a valid PDF.');
  }

  return buffer;
}

function buildLeadSummaryHtml(input: SubmitBusinessHealthCheckReportInput): string {
  return `
    <div style="font-family: Helvetica, Arial, sans-serif; color: #1E293B; max-width: 560px; margin: 0 auto; line-height: 1.5;">
      <p>New Business Health Check submission — the full branded report is attached as a PDF.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
        <tr><td style="padding: 4px 0; color: #64748B;">Business Name</td><td style="padding: 4px 0; font-weight: bold; text-align: right;">${input.bizName}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;">Contact Person</td><td style="padding: 4px 0; font-weight: bold; text-align: right;">${input.ownerName}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;">Phone</td><td style="padding: 4px 0; font-weight: bold; text-align: right;">${input.phone}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;">Email</td><td style="padding: 4px 0; font-weight: bold; text-align: right;">${input.email}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;">Area</td><td style="padding: 4px 0; font-weight: bold; text-align: right;">${input.area}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;">Overall Score</td><td style="padding: 4px 0; font-weight: bold; text-align: right;">${input.overallScore}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;">Inventory</td><td style="padding: 4px 0; text-align: right;">${input.inventoryScore}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;">Operations</td><td style="padding: 4px 0; text-align: right;">${input.operationsScore}</td></tr>
        <tr><td style="padding: 4px 0; color: #64748B;">Digital Marketing</td><td style="padding: 4px 0; text-align: right;">${input.marketingScore}</td></tr>
      </table>
      <p style="font-size: 12px; color: #64748B;">The detailed Business Health Check Report is attached (${REPORT_ATTACHMENT_FILENAME}).</p>
    </div>
  `;
}

function buildLeadSummaryText(input: SubmitBusinessHealthCheckReportInput): string {
  return [
    'New Business Health Check submission — the full branded report is attached as a PDF.',
    '',
    `Business Name: ${input.bizName}`,
    `Contact Person: ${input.ownerName}`,
    `Phone: ${input.phone}`,
    `Email: ${input.email}`,
    `Area: ${input.area}`,
    `Overall Score: ${input.overallScore}`,
    `Inventory: ${input.inventoryScore}`,
    `Operations: ${input.operationsScore}`,
    `Digital Marketing: ${input.marketingScore}`,
  ].join('\n');
}

/**
 * Sends the Business Health Check lead notification to NAC's internal
 * inbox, with the client-generated branded PDF as a real attachment —
 * reusing the same Resend client/config as the assessment tool's email
 * module (see email/email.service.ts), never duplicating that setup.
 */
export async function submitBusinessHealthCheckReport(input: SubmitBusinessHealthCheckReportInput): Promise<void> {
  const pdfBuffer = decodeAndValidatePdf(input.pdfBase64);

  if (!isEmailConfigured()) {
    logger.warn(
      { bizName: input.bizName },
      'Skipping Business Health Check report email — Resend not configured.'
    );
    throw AppError.serviceUnavailable('Email delivery is not configured.');
  }

  if (!env.NAC_LEAD_ALERT_EMAIL) {
    logger.warn({ bizName: input.bizName }, 'Skipping Business Health Check report email — no recipient configured.');
    throw AppError.serviceUnavailable('No recipient configured for this report.');
  }

  const resend = getResendClient();
  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL as string,
    to: env.NAC_LEAD_ALERT_EMAIL,
    subject: `New Business Health Check — ${input.bizName} (Overall: ${input.overallScore})`,
    text: buildLeadSummaryText(input),
    html: buildLeadSummaryHtml(input),
    attachments: [{ filename: REPORT_ATTACHMENT_FILENAME, content: pdfBuffer }],
  });

  if (error) {
    throw AppError.internal(`Failed to send Business Health Check report email: ${error.message}`);
  }

  logger.info(
    { bizName: input.bizName, resendMessageId: data?.id },
    'Business Health Check report email accepted by Resend.'
  );
}
