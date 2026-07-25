/**
 * Standard response envelope used by every endpoint in the API.
 * Keeping this in one place guarantees the frontend can rely on a
 * single, predictable shape regardless of which controller responds.
 */

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: {
    timestamp: string;
  };
}

export interface ApiErrorDetail {
  field?: string;
  issue: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
  };
  meta: {
    timestamp: string;
  };
}

export function successResponse<T>(data: T): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    meta: { timestamp: new Date().toISOString() },
  };
}

export function errorResponse(
  code: string,
  message: string,
  details?: ApiErrorDetail[]
): ApiErrorResponse {
  return {
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
    meta: { timestamp: new Date().toISOString() },
  };
}
