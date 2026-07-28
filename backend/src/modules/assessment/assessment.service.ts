import { isSupabaseConfigured } from '../../database/supabaseClient';
import { AppError } from '../../utils/AppError';
import { logger } from '../../utils/logger';
import { sendAssessmentReportEmail, sendLeadAlertEmail } from '../email/email.service';
import { generateAssessmentReportPdf, type GeneratedReportPdf } from '../pdf/pdf.service';
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
 * Generates the PDF, then emails the customer's report and the
 * internal lead alert for an already-persisted assessment. The two
 * sends are independent — the customer report goes out first, and a
 * failure in either one is logged without blocking or skipping the
 * other.
 */
async function deliverAssessmentReportEmail(id: string): Promise<void> {
  const assessment = await getAssessmentById(id);
  const report = await generateAssessmentReportPdf(assessment);

  try {
    await sendAssessmentReportEmail(assessment, report);
  } catch (error) {
    logger.error({ err: error, assessmentId: id }, 'Failed to email assessment report to customer.');
  }

  try {
    await sendLeadAlertEmail(assessment, report);
  } catch (error) {
    logger.error({ err: error, assessmentId: id }, 'Failed to send internal lead alert email.');
  }
}

export async function submitAssessment(input: CreateAssessmentInput): Promise<CreateAssessmentResult> {
  ensureSupabaseConfigured();
  const result = await createAssessment(input);

  logger.info(
    { assessmentId: result.id, assessmentNumber: result.assessmentNumber, companyName: input.company.companyName },
    'Assessment saved.'
  );

  // Fire-and-forget: the assessment is already durably saved, so a
  // failure generating the PDF or sending the email must never fail
  // or delay this response (see docs/PRD.md §7 — submission persists
  // to DB before PDF/email generation; no data loss if downstream
  // steps fail).
  void deliverAssessmentReportEmail(result.id).catch((error) => {
    logger.error({ err: error, assessmentId: result.id }, 'Failed to email assessment report.');
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

export async function getAssessmentReportPdf(id: string): Promise<GeneratedReportPdf> {
  const assessment = await getAssessmentById(id);
  return generateAssessmentReportPdf(assessment);
}
