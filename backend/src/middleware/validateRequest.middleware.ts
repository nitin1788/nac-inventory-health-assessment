import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError';

type RequestPart = 'body' | 'params' | 'query';

/**
 * Validates a given part of the request against a Zod schema before
 * the controller runs. On failure, throws an AppError with field-level
 * details so the error middleware returns a standard 400 response.
 *
 * Usage: router.post('/assessments', validateRequest(createAssessmentSchema), controller)
 */
export function validateRequest(schema: ZodSchema, part: RequestPart = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      const details = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        issue: e.message,
      }));
      next(AppError.badRequest('Invalid request data', details));
      return;
    }

    // Replace with parsed (and potentially coerced/defaulted) data
    req[part] = result.data;
    next();
  };
}
