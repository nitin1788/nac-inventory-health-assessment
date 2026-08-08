import { env } from '@/config/env';

/**
 * Mirrors the backend's standard response envelope
 * (backend/src/utils/apiResponse.ts) so the frontend and backend stay
 * contractually in sync. See docs/API.md for the authoritative shape.
 */
export interface ApiErrorDetail {
  field?: string;
  issue: string;
}

export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: ApiErrorDetail[];

  constructor(status: number, code: string, message: string, details?: ApiErrorDetail[]) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

interface ApiSuccessBody<T> {
  success: true;
  data: T;
  meta: { timestamp: string };
}

interface ApiErrorBody {
  success: false;
  error: { code: string; message: string; details?: ApiErrorDetail[] };
  meta: { timestamp: string };
}

type ApiBody<T> = ApiSuccessBody<T> | ApiErrorBody;

/** Thrown when a request is aborted for taking longer than `timeoutMs` — distinct from ApiError so callers can offer a "Retry" UI instead of a generic error message. */
export class ApiTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Request timed out after ${timeoutMs}ms.`);
  }
}

async function request<T>(path: string, options?: RequestInit & { timeoutMs?: number }): Promise<T> {
  const { timeoutMs, ...init } = options ?? {};
  const controller = timeoutMs ? new AbortController() : undefined;
  const timer = timeoutMs ? setTimeout(() => controller!.abort(), timeoutMs) : undefined;

  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
      signal: controller?.signal,
    });
  } catch (err) {
    if (controller?.signal.aborted) {
      throw new ApiTimeoutError(timeoutMs!);
    }
    throw err;
  } finally {
    if (timer) clearTimeout(timer);
  }

  let body: ApiBody<T>;
  try {
    body = (await response.json()) as ApiBody<T>;
  } catch {
    throw new ApiError(response.status, 'INVALID_RESPONSE', 'Received an unreadable response from the server.');
  }

  if (!body.success) {
    throw new ApiError(response.status, body.error.code, body.error.message, body.error.details);
  }

  return body.data;
}

export const apiClient = {
  get: <T>(path: string, opts?: { timeoutMs?: number }) => request<T>(path, { method: 'GET', ...opts }),
  post: <T>(path: string, payload?: unknown, opts?: { timeoutMs?: number }) =>
    request<T>(path, { method: 'POST', body: payload ? JSON.stringify(payload) : undefined, ...opts }),
};
