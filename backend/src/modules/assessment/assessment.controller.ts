import type { Request, Response } from 'express';
import { successResponse } from '../../utils/apiResponse';
import { AppError } from '../../utils/AppError';
import { getAssessmentById, getAssessmentReportPdf, submitAssessment } from './assessment.service';
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

export async function getAssessmentReportPdfController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!id) {
    throw AppError.badRequest('Missing assessment id.');
  }

  const { buffer, filename } = await getAssessmentReportPdf(id);
  res.status(200);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(buffer);
}
