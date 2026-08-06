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
 * `tier` selects which of the two distinct report products
 * (Report Summary / Professional Inventory Report) gets rendered —
 * see pdf/pdfSections.config.ts for what each tier actually contains.
 */
export async function deliverPaidReport(assessmentId: string, tier: ReportTier): Promise<void> {
  const assessment = await getAssessmentById(assessmentId);
  const report = await generateAssessmentReportPdf(assessment, tier);

  logger.info({ assessmentId, tier }, 'Delivering paid report to customer.');
  await sendAssessmentReportEmail(assessment, report);
}
