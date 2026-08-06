import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middleware/validateRequest.middleware';
import { createRateLimiter } from '../../middleware/rateLimiter.middleware';
import { ASSESSMENT_SUBMIT_RATE_LIMIT } from '../../config/constants';
import { assessmentIdParamsSchema, createAssessmentSchema, reportTierQuerySchema } from './assessment.validation';
import {
  createAssessmentController,
  getAssessmentController,
  getAssessmentReportPdfController,
} from './assessment.controller';

const submitAssessmentRateLimiter = createRateLimiter({
  windowMs: ASSESSMENT_SUBMIT_RATE_LIMIT.WINDOW_MS,
  max: ASSESSMENT_SUBMIT_RATE_LIMIT.MAX_REQUESTS,
});

/** Mounted at /assessments — POST / (submit), GET /:id (fetch one). */
export const assessmentRouter = Router();

assessmentRouter.post(
  '/',
  submitAssessmentRateLimiter,
  validateRequest(createAssessmentSchema),
  asyncHandler(createAssessmentController)
);

assessmentRouter.get(
  '/:id',
  validateRequest(assessmentIdParamsSchema, 'params'),
  asyncHandler(getAssessmentController)
);

/**
 * Mounted at /reports — GET /:id. Reuses the same assessment detail
 * lookup; there is no separate "report" table in this milestone
 * (report content is still generated client-side, see PDF Generator).
 * A distinct route exists so future report-specific behavior (e.g.
 * view tracking, expiry) has a natural home without reshaping
 * /assessments/:id.
 */
export const reportRouter = Router();

reportRouter.get(
  '/:id',
  validateRequest(assessmentIdParamsSchema, 'params'),
  asyncHandler(getAssessmentController)
);

/**
 * Server-side rendered PDF of the same report (Milestone 10) — built
 * with @react-pdf/renderer from the persisted assessment, per the
 * PDF-generation approach in docs/PRD.md Section 8. `?tier=` selects
 * which of the two report products to render (see
 * assessment.validation.ts's reportTierQuerySchema).
 */
reportRouter.get(
  '/:id/pdf',
  validateRequest(assessmentIdParamsSchema, 'params'),
  validateRequest(reportTierQuerySchema, 'query'),
  asyncHandler(getAssessmentReportPdfController)
);
