/**
 * Domain types for the assessment module.
 *
 * Intentionally minimal in Milestone 3 — this file establishes the
 * module boundary and shape. Full question/answer payload types,
 * scoring result types, etc. are built out in Milestone 4 alongside
 * the scoring engine.
 */

export type AssessmentStatus = 'completed';

export interface AssessmentRecord {
  id: string;
  companyId: string;
  status: AssessmentStatus;
  overallScore: number | null;
  scoreBreakdown: Record<string, number> | null;
  scoringVersion: string | null;
  submittedAt: string;
  createdAt: string;
}
