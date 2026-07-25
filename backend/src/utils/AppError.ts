import type { ApiErrorDetail } from './apiResponse';

/**
 * Thrown from services/controllers for any expected, "operational"
 * error (validation failure, not found, rate limited, etc). The central
 * error middleware knows how to translate this into the standard API
 * error response. Unexpected (programmer) errors should NOT use this
 * class — let them propagate as regular Errors so they're loud in logs.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: ApiErrorDetail[];
  public readonly isOperational = true;

  constructor(statusCode: number, code: string, message: string, details?: ApiErrorDetail[]) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: ApiErrorDetail[]): AppError {
    return new AppError(400, 'VALIDATION_ERROR', message, details);
  }

  static notFound(message = 'Resource not found'): AppError {
    return new AppError(404, 'NOT_FOUND', message);
  }

  static tooManyRequests(message = 'Too many requests'): AppError {
    return new AppError(429, 'RATE_LIMITED', message);
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError(500, 'INTERNAL_ERROR', message);
  }

  static serviceUnavailable(message: string): AppError {
    return new AppError(503, 'SERVICE_UNAVAILABLE', message);
  }
}
