import type { CompanyProfile } from '../questions/companyProfile';
import type { RecommendationResult } from '../recommendations/recommendationTypes';
import type { ScoringResult } from '../scoring/scoreTypes';

/**
 * Everything the PDF template needs to render the full report.
 * Assembled once on the Results page from data already computed by
 * the scoring and recommendation engines — the PDF layer never
 * recalculates anything, it only formats.
 */
export interface PdfReportData {
  companyInfo: CompanyProfile;
  scoringResult: ScoringResult;
  recommendationResult: RecommendationResult;
  generatedAt: Date;
  /** May be unavailable if downloaded before the server-side save completes. */
  assessmentNumber?: string;
}
