import type { Request, Response } from 'express';
import { successResponse } from '../../utils/apiResponse';
import { AppError } from '../../utils/AppError';
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
 * Report downloads are gated behind payment. No payment gateway is
 * wired up yet (see backend/src/modules/payment/, currently a
 * placeholder provider), so there is no way for this assessment to be
 * legitimately "paid" — this always denies for now rather than
 * streaming the PDF to anyone who knows the assessment id. Once a real
 * PaymentProvider can confirm a paid order, this check becomes that
 * lookup; the PDF generation itself (report.service.ts's
 * deliverPaidReport) is already ready to be called from here or from a
 * payment-confirmation callback.
 */
export async function getAssessmentReportPdfController(req: Request, _res: Response): Promise<void> {
  const { id } = req.params;
  if (!id) {
    throw AppError.badRequest('Missing assessment id.');
  }

  throw AppError.forbidden('Report download is not available yet — payment gateway integration coming soon.');
}
