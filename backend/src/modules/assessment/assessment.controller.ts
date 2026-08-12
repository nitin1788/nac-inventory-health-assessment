import type { Request, Response } from 'express';
import { successResponse } from '../../utils/apiResponse';
import { AppError } from '../../utils/AppError';
import { isReportUnlocked } from '../payment/payment.service';
import type { ReportTier } from '../payment/payment.types';
import { generateAssessmentReportPdf } from '../pdf/pdf.service';
import { getAssessmentById, submitAssessment } from './assessment.service';
import type { CreateAssessmentInput } from './assessment.types';

export async function createAssessmentController(req: Request, res: Response): Promise<void> {
  const input = req.body as CreateAssessmentInput;
  const result = await submitAssessment(input);
  res.status(201).json(successResponse(result));
}

export async function getAssessmentController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!id) {
    throw AppError.badRequest('Missing assessment id.');
  }

  const assessment = await getAssessmentById(id);
  res.status(200).json(successResponse(assessment));
}

/**
 * Report downloads are gated behind a real, per-assessment,
 * per-tier fact: a paid `payment_orders` row (see
 * backend/src/modules/payment/payment.service.ts's isReportUnlocked).
 * No real payment gateway is wired up yet — the placeholder
 * PaymentProvider never creates an order that can reach 'paid', so
 * this denies by default with no bypass of any kind.
 *
 * `?tier=summary|full` selects which of the two distinct report
 * products to render (see pdf/pdfSections.config.ts); defaults to
 * `full` when omitted, matching this route's behavior before tiering
 * existed.
 */
export async function getAssessmentReportPdfController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!id) {
    throw AppError.badRequest('Missing assessment id.');
  }

  const { tier } = req.query as unknown as { tier: ReportTier };

  if (!(await isReportUnlocked(id, tier))) {
    throw AppError.forbidden('This report has not been unlocked yet — a completed purchase is required.');
  }

  const assessment = await getAssessmentById(id);
  const report = await generateAssessmentReportPdf(assessment, tier);
  res.status(200);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
  res.send(report.buffer);
}
