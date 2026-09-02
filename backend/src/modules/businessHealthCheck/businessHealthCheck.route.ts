import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middleware/validateRequest.middleware';
import { createRateLimiter } from '../../middleware/rateLimiter.middleware';
import { BUSINESS_HEALTH_CHECK_RATE_LIMIT } from '../../config/constants';
import { submitBusinessHealthCheckReportSchema } from './businessHealthCheck.validation';
import { submitBusinessHealthCheckReportController } from './businessHealthCheck.controller';

const submitReportRateLimiter = createRateLimiter({
  windowMs: BUSINESS_HEALTH_CHECK_RATE_LIMIT.WINDOW_MS,
  max: BUSINESS_HEALTH_CHECK_RATE_LIMIT.MAX_REQUESTS,
});

/** Mounted at /business-health-check — POST / (submit lead + PDF, emails NAC via Resend). */
export const businessHealthCheckRouter = Router();

businessHealthCheckRouter.post(
  '/',
  submitReportRateLimiter,
  validateRequest(submitBusinessHealthCheckReportSchema),
  asyncHandler(submitBusinessHealthCheckReportController)
);
