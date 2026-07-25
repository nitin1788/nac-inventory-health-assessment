import rateLimit from 'express-rate-limit';
import { errorResponse } from '../utils/apiResponse';
import { RATE_LIMIT } from '../config/constants';

/**
 * General-purpose API rate limiter. Endpoint-specific, tighter limits
 * (e.g. assessment submission) are defined where that route is wired,
 * using this same factory with different options.
 */
export function createRateLimiter(options?: { windowMs?: number; max?: number }) {
  return rateLimit({
    windowMs: options?.windowMs ?? RATE_LIMIT.WINDOW_MS,
    max: options?.max ?? RATE_LIMIT.MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json(errorResponse('RATE_LIMITED', 'Too many requests. Please try again later.'));
    },
  });
}

export const defaultRateLimiter = createRateLimiter();
