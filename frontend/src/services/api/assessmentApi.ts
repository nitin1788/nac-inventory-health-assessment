import type {
  AssessmentSubmissionPayload,
  AssessmentSubmissionResult,
} from '@/features/assessment/submission/submissionTypes';
import { apiClient, ApiError } from './apiClient';
import { endpoints } from './endpoints';

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(error: unknown): boolean {
  // 4xx errors (validation, not found, rate limited) won't succeed on
  // retry — only network failures and 5xx/unknown errors are worth
  // retrying.
  if (error instanceof ApiError) {
    return error.status >= 500;
  }
  return true;
}

/**
 * Submits a completed assessment, retrying transient failures (network
 * errors, 5xx) a couple of times with a short backoff before giving up.
 */
export async function submitAssessment(
  payload: AssessmentSubmissionPayload
): Promise<AssessmentSubmissionResult> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await apiClient.post<AssessmentSubmissionResult>(endpoints.assessments, payload);
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) || attempt === MAX_ATTEMPTS) {
        break;
      }
      await delay(RETRY_DELAY_MS * attempt);
    }
  }

  throw lastError;
}
