import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateRequest } from '../../middleware/validateRequest.middleware';
import { createRateLimiter } from '../../middleware/rateLimiter.middleware';
import { LEAD_SUBMIT_RATE_LIMIT } from '../../config/constants';
import { submitLeadSchema } from './leads.validation';
import { submitLeadController } from './leads.controller';

const submitLeadRateLimiter = createRateLimiter({
  windowMs: LEAD_SUBMIT_RATE_LIMIT.WINDOW_MS,
  max: LEAD_SUBMIT_RATE_LIMIT.MAX_REQUESTS,
});

/** Mounted at /leads — POST / (Contact Us form submission, emails NAC via Resend). */
export const leadsRouter = Router();

leadsRouter.post('/', submitLeadRateLimiter, validateRequest(submitLeadSchema), asyncHandler(submitLeadController));
