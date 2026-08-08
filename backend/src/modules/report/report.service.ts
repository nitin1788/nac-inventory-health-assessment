import { logger } from '../../utils/logger';
import { getAssessmentById } from '../assessment/assessment.service';
import { generateAssessmentReportPdf } from '../pdf/pdf.service';
import { sendAssessmentReportEmail, sendInternalConsultingReportEmail } from '../email/email.service';
import { generateInternalConsultingReportPdf } from '../internalReport/internalReport.service';
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

  // NAC-internal consulting brief/dossier — a completely separate document
  // from the customer's PDF above (see internalReport/), emailed only to
  // NAC_LEAD_ALERT_EMAIL, tiered to match what the customer just paid for.
  // Deliberately isolated in its own try/catch: a failure here must never
  // fail payment confirmation or the customer's own report delivery, which
  // has already succeeded by this point.
  try {
    const internalReport = await generateInternalConsultingReportPdf(assessment, tier);
    await sendInternalConsultingReportEmail(assessment, tier, internalReport);
  } catch (error) {
    logger.error({ err: error, assessmentId, tier }, 'Failed to generate/send internal consulting report.');
  }
}
