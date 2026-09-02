import { Resend } from 'resend';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';
import { COMPANY_NAME, CONSULTATION, FOOTER_EMAIL, SERVICES_LIST, SITE_URL } from '../../config/constants';
import { buildConsultationWhatsAppUrl } from '../../utils/whatsapp';
import type { AssessmentDetail } from '../assessment/assessment.types';
import { TIER_PRICING, type ReportTier } from '../payment/payment.types';
import type { GeneratedReportPdf } from '../pdf/pdf.service';
import { formatInr } from '../pdf/pdfTemplates.shared';

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

export function isLeadAlertConfigured(): boolean {
  return isEmailConfigured() && Boolean(env.NAC_LEAD_ALERT_EMAIL);
}

/** Exported so other modules (e.g. businessHealthCheck) can reuse the same lazily-initialized client instead of duplicating Resend setup. */
export function getResendClient(): Resend {
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
  const whatsappUrl = buildConsultationWhatsAppUrl(assessment.assessmentNumber);

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
    '',
    'Need Expert Guidance?',
    '',
    `Book a ${CONSULTATION.duration} ${CONSULTATION.serviceName} to review your assessment report and receive practical recommendations for improving your inventory and store / warehouse operations.`,
    '',
    'Consultation Details',
    `- Duration: ${CONSULTATION.duration}`,
    `- Mode: ${CONSULTATION.mode}`,
    `- Consultation Fee: ${CONSULTATION.fee}`,
    '',
    `${CONSULTATION.ctaLabel}: ${whatsappUrl}`,
    '',
    '—',
    COMPANY_NAME,
    SERVICES_LIST,
    SITE_URL,
    FOOTER_EMAIL,
    '© Nitin Anand Consulting. All Rights Reserved.',
  ].join('\n');
}

function buildEmailHtml(assessment: AssessmentDetail): string {
  const whatsappUrl = buildConsultationWhatsAppUrl(assessment.assessmentNumber);

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

      <div style="margin-top: 24px; padding: 16px 20px; background-color: #EEF3F8; border-radius: 8px;">
        <p style="margin: 0 0 8px; font-size: 15px; font-weight: bold; color: #0F2A52;">Need Expert Guidance?</p>
        <p style="margin: 0 0 12px; font-size: 13px; color: #334155;">
          Book a ${CONSULTATION.duration} ${CONSULTATION.serviceName} to review your assessment report and
          receive practical recommendations for improving your inventory and store / warehouse operations.
        </p>
        <p style="margin: 0 0 4px; font-size: 13px; color: #334155;"><strong>Consultation Details</strong></p>
        <ul style="margin: 0 0 16px; padding-left: 18px; font-size: 13px; color: #334155;">
          <li>Duration: ${CONSULTATION.duration}</li>
          <li>Mode: ${CONSULTATION.mode}</li>
          <li>Consultation Fee: ${CONSULTATION.fee}</li>
        </ul>
        <a
          href="${whatsappUrl}"
          style="display: inline-block; background-color: #0F2A52; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: bold;"
        >
          ${CONSULTATION.ctaLabel}
        </a>
      </div>

      <p style="margin-top: 28px; padding-top: 12px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B;">
        <strong style="color: #0F2A52;">${COMPANY_NAME}</strong><br />
        ${SERVICES_LIST}<br />
        <a href="${SITE_URL}" style="color: #0F2A52; text-decoration: underline;">${SITE_URL}</a>
        &nbsp;·&nbsp;
        <a href="mailto:${FOOTER_EMAIL}" style="color: #0F2A52; text-decoration: underline;">${FOOTER_EMAIL}</a>
        <br />
        © Nitin Anand Consulting. All Rights Reserved.
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

  const startedAt = Date.now();
  logger.info(
    {
      assessmentId: assessment.id,
      assessmentNumber: assessment.assessmentNumber,
      to: assessment.company.email,
    },
    'Customer email send starting.'
  );

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
    {
      assessmentId: assessment.id,
      assessmentNumber: assessment.assessmentNumber,
      to: assessment.company.email,
      resendMessageId: data?.id,
      msToAccept: Date.now() - startedAt,
    },
    'Assessment report email accepted by Resend.'
  );
}

function buildLeadAlertSubject(assessment: AssessmentDetail): string {
  return `🚨 New Inventory Assessment Lead | ${assessment.company.companyName} | ${assessment.healthRating}`;
}

function formatSubmittedAt(createdAt: string): string {
  return new Date(createdAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });
}

function buildLeadAlertText(assessment: AssessmentDetail): string {
  const moduleLines = assessment.moduleScores.map(
    (moduleScore) =>
      `- ${moduleScore.moduleName}: ${moduleScore.score}/${moduleScore.maxScore} (${moduleScore.percentage}% — ${moduleScore.rating})`
  );

  return [
    'A new assessment has been completed.',
    '',
    `Assessment Number: ${assessment.assessmentNumber}`,
    `Company Name: ${assessment.company.companyName}`,
    `Contact Person: ${assessment.company.contactPerson}`,
    `Mobile: ${assessment.company.mobile}`,
    `Email: ${assessment.company.email}`,
    `Overall Score: ${assessment.overallScore} (${assessment.overallPercentage}%)`,
    `Health Rating: ${assessment.healthRating}`,
    `Date & Time: ${formatSubmittedAt(assessment.createdAt)}`,
    '',
    'Modules Summary:',
    ...moduleLines,
    '',
    'Action Required: Contact this lead within 24 hours.',
  ].join('\n');
}

/**
 * Notifies the internal NAC sales team that a new lead completed an
 * assessment — a separate send from sendAssessmentReportEmail, going
 * to NAC_LEAD_ALERT_EMAIL rather than the customer. Same no-op-when-
 * unconfigured pattern; only requires NAC_LEAD_ALERT_EMAIL in addition
 * to the base Resend config.
 */
export async function sendLeadAlertEmail(
  assessment: AssessmentDetail,
  report: GeneratedReportPdf
): Promise<void> {
  if (!isLeadAlertConfigured()) {
    logger.warn(
      { assessmentId: assessment.id },
      'Skipping internal lead alert email — NAC_LEAD_ALERT_EMAIL or Resend not configured.'
    );
    return;
  }

  const startedAt = Date.now();
  logger.info(
    {
      assessmentId: assessment.id,
      assessmentNumber: assessment.assessmentNumber,
      to: env.NAC_LEAD_ALERT_EMAIL,
    },
    'Internal lead alert email send starting.'
  );

  const resend = getResendClient();
  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL as string,
    to: env.NAC_LEAD_ALERT_EMAIL as string,
    subject: buildLeadAlertSubject(assessment),
    text: buildLeadAlertText(assessment),
    attachments: [{ filename: report.filename, content: report.buffer }],
  });

  if (error) {
    throw new Error(`Failed to send internal lead alert email: ${error.message}`);
  }

  logger.info(
    {
      assessmentId: assessment.id,
      assessmentNumber: assessment.assessmentNumber,
      to: env.NAC_LEAD_ALERT_EMAIL,
      resendMessageId: data?.id,
      msToAccept: Date.now() - startedAt,
    },
    'Internal lead alert email accepted by Resend.'
  );
}

const TIER_LABEL: Record<ReportTier, string> = {
  summary: 'NAC Internal Lead / Consulting Brief',
  full: 'NAC Professional Consulting Dossier',
};

/** TIER_PRICING is in paise (see payment.types.ts); formatInr() expects a rupee amount, not paise. */
function formatTierPrice(tier: ReportTier): string {
  return formatInr(TIER_PRICING[tier] / 100);
}

function buildInternalConsultingReportSubject(assessment: AssessmentDetail, tier: ReportTier): string {
  return `📋 ${TIER_LABEL[tier]} — ${assessment.company.companyName} (${formatTierPrice(tier)} paid)`;
}

function buildInternalConsultingReportText(assessment: AssessmentDetail, tier: ReportTier): string {
  return [
    `${assessment.company.companyName} just paid for the ${formatTierPrice(tier)} report — attached is ` +
      `NAC's internal consulting brief for this engagement, not the customer's own PDF.`,
    '',
    `Assessment Number: ${assessment.assessmentNumber}`,
    `Company: ${assessment.company.companyName}`,
    `Contact: ${assessment.company.contactPerson} (${assessment.company.designation})`,
    `Mobile: ${assessment.company.mobile}`,
    `Email: ${assessment.company.email}`,
    `Overall Score: ${assessment.overallScore} (${assessment.overallPercentage}%)`,
    `Health Rating: ${assessment.healthRating}`,
    `Purchased Tier: ${formatTierPrice(tier)} (${tier === 'summary' ? 'Summary' : 'Full'})`,
    '',
    'The attached PDF contains the problem register, business impact, likely root causes, recommended solutions, ' +
      'consultant discussion questions, and potential NAC service opportunities for this customer — use it to ' +
      'prepare for the consultation call.',
    '',
    'This document is for internal NAC use only. Do not forward it to the customer.',
  ].join('\n');
}

/**
 * Emails the NAC-internal consulting report (see internalReport.service.ts)
 * to NAC_LEAD_ALERT_EMAIL once a customer's payment is confirmed. A
 * distinct send from both sendAssessmentReportEmail (customer) and
 * sendLeadAlertEmail (the pre-payment "new lead" notification, which
 * still attaches the customer's own Full PDF and is untouched by this
 * function) — this one always carries the separate internal-only
 * document, tiered to match what the customer actually purchased.
 */
export async function sendInternalConsultingReportEmail(
  assessment: AssessmentDetail,
  tier: ReportTier,
  report: GeneratedReportPdf
): Promise<void> {
  if (!isLeadAlertConfigured()) {
    logger.warn(
      { assessmentId: assessment.id, tier },
      'Skipping internal consulting report email — NAC_LEAD_ALERT_EMAIL or Resend not configured.'
    );
    return;
  }

  const startedAt = Date.now();
  logger.info(
    {
      assessmentId: assessment.id,
      assessmentNumber: assessment.assessmentNumber,
      tier,
      to: env.NAC_LEAD_ALERT_EMAIL,
    },
    'Internal consulting report email send starting.'
  );

  const resend = getResendClient();
  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL as string,
    to: env.NAC_LEAD_ALERT_EMAIL as string,
    subject: buildInternalConsultingReportSubject(assessment, tier),
    text: buildInternalConsultingReportText(assessment, tier),
    attachments: [{ filename: report.filename, content: report.buffer }],
  });

  if (error) {
    throw new Error(`Failed to send internal consulting report email: ${error.message}`);
  }

  logger.info(
    {
      assessmentId: assessment.id,
      assessmentNumber: assessment.assessmentNumber,
      tier,
      to: env.NAC_LEAD_ALERT_EMAIL,
      resendMessageId: data?.id,
      msToAccept: Date.now() - startedAt,
    },
    'Internal consulting report email accepted by Resend.'
  );
}
