import type { Option, Question } from '../questions/types';
import type { HealthRating } from './scoreTypes';

/**
 * Default point mapping by option count, applied by position — the
 * first option (most desirable practice) scores highest, the last
 * (least desirable) scores 0. Every real scale question in the
 * question bank has exactly 4, 5, or 6 options; a question with any
 * other count falls back to its options' own `value` (see
 * getOptionScore/getQuestionMaxScore) rather than crashing.
 */
const DEFAULT_SCORE_MAPS: Record<number, number[]> = {
  4: [5, 4, 2, 0],
  5: [5, 4, 3, 2, 0],
  6: [5, 4, 3, 2, 1, 0],
};

export const EXCELLENT_THRESHOLD = 90;
export const GOOD_THRESHOLD = 75;
export const NEEDS_IMPROVEMENT_THRESHOLD = 50;

export const HEALTH_RATING_BANDS: ReadonlyArray<{ min: number; rating: HealthRating }> = [
  { min: EXCELLENT_THRESHOLD, rating: 'Excellent' },
  { min: GOOD_THRESHOLD, rating: 'Good' },
  { min: NEEDS_IMPROVEMENT_THRESHOLD, rating: 'Needs Improvement' },
  { min: 0, rating: 'Critical' },
];

/**
 * Whether a question counts toward scoring at all. Driven entirely
 * by the question's own metadata (`scorable`, `type`, `options`) —
 * never by checking a specific question ID, so FIN-01 (or any future
 * non-scored question) is excluded automatically.
 */
export function isScorableQuestion(question: Question): boolean {
  return question.scorable !== false && question.type !== 'textarea' && !!question.options?.length;
}

/** The point value for `option` within its question's `options`, by position. */
export function getOptionScore(options: Option[], option: Option): number {
  const map = DEFAULT_SCORE_MAPS[options.length];
  if (!map) return option.value;
  const index = options.findIndex((candidate) => candidate.value === option.value);
  return index === -1 ? 0 : (map[index] ?? 0);
}

/** The maximum achievable points for a scorable question (0 if it isn't scorable). */
export function getQuestionMaxScore(question: Question): number {
  if (!isScorableQuestion(question) || !question.options?.length) return 0;
  const map = DEFAULT_SCORE_MAPS[question.options.length];
  return map ? Math.max(...map) : Math.max(...question.options.map((option) => option.value));
}

export function getHealthRating(percentage: number): HealthRating {
  const band = HEALTH_RATING_BANDS.find((candidate) => percentage >= candidate.min);
  return band ? band.rating : 'Critical';
}
