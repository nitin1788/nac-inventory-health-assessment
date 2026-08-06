import { logger } from '../../utils/logger';
import { getAssessmentById } from '../assessment/assessment.service';
import { generateAssessmentReportPdf } from '../pdf/pdf.service';
import { sendAssessmentReportEmail } from '../email/email.service';
import type { ReportTier } from '../payment/payment.types';

/**
 * Generates the customer's report PDF and emails it to them — the
 * customer-facing fulfillment step a confirmed payment should trigger.
 *
 * Not called by any live code path yet: no PaymentProvider can
 * currently confirm a real payment (see backend/src/modules/payment/,
 * still backed by a placeholder). This is the exact function a future
 * payment-confirmation callback (webhook or verified client callback)
 * will invoke — written now so that wiring up a real gateway later
 * means calling this function, not designing it.
 *
 * `tier` is accepted but doesn't yet vary the PDF's contents — the
 * existing template is a single full-detail report. Splitting it into
 * a lighter "summary" tier vs. today's "full" tier is deferred until a
 * real payment can actually confirm which tier was purchased.
 */
export async function deliverPaidReport(assessmentId: string, tier: ReportTier): Promise<void> {
  const assessment = await getAssessmentById(assessmentId);
  const report = await generateAssessmentReportPdf(assessment);

  logger.info({ assessmentId, tier }, 'Delivering paid report to customer.');
  await sendAssessmentReportEmail(assessment, report);
}
