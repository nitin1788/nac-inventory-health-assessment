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

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

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
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, payload?: unknown) =>
    request<T>(path, { method: 'POST', body: payload ? JSON.stringify(payload) : undefined }),
};
