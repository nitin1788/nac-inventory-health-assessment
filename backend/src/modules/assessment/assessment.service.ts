import { isSupabaseConfigured } from '../../database/supabaseClient';
import { AppError } from '../../utils/AppError';
import { logger } from '../../utils/logger';
import { sendLeadAlertEmail } from '../email/email.service';
import { generateAssessmentReportPdf } from '../pdf/pdf.service';
import { createAssessment, findAssessmentById } from './assessment.repository';
import type { AssessmentDetail, CreateAssessmentInput, CreateAssessmentResult } from './assessment.types';

function ensureSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw AppError.serviceUnavailable(
      'Assessment storage is not configured yet. Please try again later.'
    );
  }
}

/**
 * Notifies NAC internally that a new assessment was completed. This is
 * an internal lead notification, not the customer-facing report, so it
 * still fires immediately on every submission regardless of payment
 * status — a completed assessment is a warm lead worth knowing about
 * even before (or if) it converts to a paid report purchase. The
 * customer's own report is gated behind payment — see
 * backend/src/modules/report/report.service.ts's deliverPaidReport().
 */
async function sendInternalLeadAlert(id: string): Promise<void> {
  const assessment = await getAssessmentById(id);
  // Always the full report for NAC's own internal visibility — unrelated
  // to whichever tier (if any) a customer eventually purchases.
  const report = await generateAssessmentReportPdf(assessment, 'full');
  await sendLeadAlertEmail(assessment, report);
}

export async function submitAssessment(input: CreateAssessmentInput): Promise<CreateAssessmentResult> {
  ensureSupabaseConfigured();
  const result = await createAssessment(input);

  logger.info(
    { assessmentId: result.id, assessmentNumber: result.assessmentNumber, companyName: input.company.companyName },
    'Assessment saved.'
  );

  // Fire-and-forget: the assessment is already durably saved, so a
  // failure sending the internal lead alert must never fail or delay
  // this response (see docs/PRD.md §7 — submission persists to DB
  // before any downstream step; no data loss if a downstream step
  // fails). The customer-facing report (PDF + email) is intentionally
  // NOT generated here — it's gated behind payment, which doesn't
  // exist yet (see backend/src/modules/payment/, currently a
  // placeholder). A future payment-confirmation callback calls
  // report.service.ts's deliverPaidReport() instead.
  void sendInternalLeadAlert(result.id).catch((error) => {
    logger.error({ err: error, assessmentId: result.id }, 'Failed to send internal lead alert email.');
  });

  return result;
}

export async function getAssessmentById(id: string): Promise<AssessmentDetail> {
  ensureSupabaseConfigured();

  const assessment = await findAssessmentById(id);
  if (!assessment) {
    throw AppError.notFound('Assessment not found.');
  }

  return assessment;
}
