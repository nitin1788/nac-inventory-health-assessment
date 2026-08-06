import type { Request, Response } from 'express';
import { successResponse } from '../../utils/apiResponse';
import { AppError } from '../../utils/AppError';
import { isTestModeActive } from '../payment/payment.service';
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
 * Report downloads are gated behind payment. No real payment gateway
 * is wired up yet (see backend/src/modules/payment/), so this denies
 * by default — the only exception is PAYMENT_TEST_MODE=true (internal
 * testing only; see payment.service.ts's isTestModeActive and
 * env.ts), which must never be enabled in production. Once a real
 * PaymentProvider can confirm a paid order, this check becomes that
 * lookup instead.
 */
export async function getAssessmentReportPdfController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!id) {
    throw AppError.badRequest('Missing assessment id.');
  }

  if (!isTestModeActive()) {
    throw AppError.forbidden('Report download is not available yet — payment gateway integration coming soon.');
  }

  const assessment = await getAssessmentById(id);
  const report = await generateAssessmentReportPdf(assessment);
  res.status(200);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
  res.send(report.buffer);
}
