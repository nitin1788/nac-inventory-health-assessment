import type { AssessmentDetail, HealthRating } from '../assessment/assessment.types';
import { generateRecommendations } from '../recommendations/recommendationEngine';
import type { ModuleRecommendation, PriorityLevel } from '../recommendations/recommendationTypes';
import { QUESTION_TEXT_INDEX } from './questionTextIndex';

export type RootCauseCategory = 'People' | 'Process' | 'Systems' | 'Data & Visibility' | 'Governance';

/**
 * Which root-cause category each module's weaknesses are most commonly
 * traced to — used only by the Full tier's Fishbone diagram to group
 * weak modules under a cause, not to relitigate the module's rating.
 * Keyed by the question bank's module `id` (see RECOMMENDATION_DATA in
 * recommendationData.ts), with a Process fallback for any module ID
 * without dedicated mapping, since "unclear process" is the safest
 * generic root cause bucket.
 */
export const MODULE_ROOT_CAUSE_CATEGORY: Record<string, RootCauseCategory> = {
  'inventory-planning': 'Process',
  'inventory-control': 'Process',
  'inventory-accuracy': 'Data & Visibility',
  'warehouse-operations': 'Process',
  procurement: 'People',
  technology: 'Systems',
  'inventory-kpis': 'Data & Visibility',
  'risk-compliance': 'Governance',
};

const DEFAULT_ROOT_CAUSE_CATEGORY: RootCauseCategory = 'Process';

export function rootCauseCategoryFor(moduleId: string): RootCauseCategory {
  return MODULE_ROOT_CAUSE_CATEGORY[moduleId] ?? DEFAULT_ROOT_CAUSE_CATEGORY;
}

/** A hedged, non-definitive framing of what a weak module's root-cause category likely reflects — never presented as a confirmed finding, always paired with "requires validation" language at the call site. */
export const ROOT_CAUSE_PHRASE: Record<RootCauseCategory, string> = {
  People: 'Possible contributing factor: gaps in staff training, ownership, or accountability for this area.',
  Process: 'Possible contributing factor: informal or undocumented operating procedures.',
  Systems: 'Possible contributing factor: limited technology or system support for this area.',
  'Data & Visibility': 'Possible contributing factor: limited tracking, reporting, or data visibility.',
  Governance: 'Possible contributing factor: insufficient oversight, review cadence, or compliance discipline.',
};

/** Maps a module's business-urgency priority onto a Risk Level label for Risk Analysis tables — Maintain reads as Low risk, not a fifth band. */
export const PRIORITY_TO_RISK_LEVEL: Record<PriorityLevel, string> = {
  High: 'High',
  Medium: 'Medium',
  Low: 'Low',
  Maintain: 'Low',
};

const RATING_ADJECTIVE: Record<HealthRating, string> = {
  Excellent: 'excellent',
  Good: 'good',
  'Needs Improvement': 'moderate',
  Critical: 'critical',
};

/** One already-persisted answer, resolved against the mirrored question bank text — undefined for any questionId not present in QUESTION_TEXT_INDEX (never fabricated). */
export interface AnsweredQuestion {
  questionId: string;
  moduleId: string;
  text: string;
  selectedOption: string;
  selectedScore: number | null;
}

function buildAnsweredQuestions(assessment: AssessmentDetail): AnsweredQuestion[] {
  const resolved: AnsweredQuestion[] = [];
  for (const answer of assessment.answers) {
    const entry = QUESTION_TEXT_INDEX[answer.questionId];
    if (!entry) continue;
    resolved.push({
      questionId: answer.questionId,
      moduleId: entry.moduleId,
      text: entry.text,
      selectedOption: answer.selectedOption,
      selectedScore: answer.selectedScore,
    });
  }
  return resolved;
}

export interface ReportContent {
  overallMaxScore: number;
  overallSummary: string;
  /** Every module, weakest-first — the complete result, always. */
  moduleRecommendations: ModuleRecommendation[];
  /** The 5 weakest modules — always ≤5, never fewer than available. */
  weakestFive: ModuleRecommendation[];
  /** Every module bucketed by its business-urgency priority. */
  byPriority: Record<PriorityLevel, ModuleRecommendation[]>;
  /** Count of modules at each HealthRating — feeds KPI cards / dashboard stats. */
  ratingCounts: Record<HealthRating, number>;
  /** Modules whose priority is High or Medium — the "needs attention" count. */
  attentionCount: number;
  /** Weakest-rated module, if any — the single highest-impact opportunity. */
  weakestModule: ModuleRecommendation | undefined;
  /** Strongest-rated module, if any — worth naming as a genuine strength. */
  strongestModule: ModuleRecommendation | undefined;
  /** Every answer whose questionId resolves in QUESTION_TEXT_INDEX — the "Final Business Assessment" free-text question is excluded (see biggestChallenge below). */
  answeredQuestions: AnsweredQuestion[];
  /** answeredQuestions grouped by moduleId — the per-module evidence pool every table's Evidence/Signal column draws from. */
  answersByModule: Record<string, AnsweredQuestion[]>;
  /** The respondent's own free-text answer to "biggest inventory/warehouse challenge," if they provided one — undefined (never a placeholder) when left blank. */
  biggestChallenge: string | undefined;
}

/**
 * Computes everything any report section could need, exactly once,
 * from an already-persisted AssessmentDetail. No section recomputes
 * generateRecommendations() itself or re-sorts moduleScores — every
 * section builder in pdfSections.ts reads from this single object.
 * This is what keeps tiering a pure rendering decision: the Summary
 * and Full tiers receive the identical ReportContent, they simply read
 * different slices of it.
 */
export function buildReportContent(assessment: AssessmentDetail): ReportContent {
  const overallMaxScore = assessment.moduleScores.reduce((sum, moduleScore) => sum + moduleScore.maxScore, 0);
  const { overallSummary, moduleRecommendations } = generateRecommendations(
    assessment.moduleScores,
    assessment.healthRating
  );

  const weakestFive = moduleRecommendations.slice(0, 5);

  const byPriority: Record<PriorityLevel, ModuleRecommendation[]> = {
    High: moduleRecommendations.filter((recommendation) => recommendation.priority === 'High'),
    Medium: moduleRecommendations.filter((recommendation) => recommendation.priority === 'Medium'),
    Low: moduleRecommendations.filter((recommendation) => recommendation.priority === 'Low'),
    Maintain: moduleRecommendations.filter((recommendation) => recommendation.priority === 'Maintain'),
  };

  const ratingCounts: Record<HealthRating, number> = {
    Excellent: 0,
    Good: 0,
    'Needs Improvement': 0,
    Critical: 0,
  };
  for (const recommendation of moduleRecommendations) {
    ratingCounts[recommendation.rating] += 1;
  }

  const attentionCount = byPriority.High.length + byPriority.Medium.length;
  const weakestModule = moduleRecommendations[0];
  const strongestModule = moduleRecommendations[moduleRecommendations.length - 1];

  const answeredQuestions = buildAnsweredQuestions(assessment).filter((a) => a.moduleId !== 'final-assessment');
  const answersByModule: Record<string, AnsweredQuestion[]> = {};
  for (const answer of answeredQuestions) {
    (answersByModule[answer.moduleId] ??= []).push(answer);
  }

  const finalAnswer = assessment.answers.find((a) => a.questionId === 'FIN-01');
  const biggestChallenge =
    finalAnswer && finalAnswer.selectedOption.trim().length > 0 ? finalAnswer.selectedOption.trim() : undefined;

  return {
    overallMaxScore,
    overallSummary,
    moduleRecommendations,
    weakestFive,
    byPriority,
    ratingCounts,
    attentionCount,
    weakestModule,
    strongestModule,
    answeredQuestions,
    answersByModule,
    biggestChallenge,
  };
}

/** Looks up one specific answer by questionId — used where a page needs a named question (e.g. Working Capital reading CTL-05/06/07) rather than "the weakest in this module." */
export function answerFor(content: ReportContent, questionId: string): AnsweredQuestion | undefined {
  return content.answeredQuestions.find((a) => a.questionId === questionId);
}

/** The lowest-scored answer in a module — the concrete evidence behind that module's rating. Falls back to the module's first answer if none carry a score (e.g. all null). */
export function weakestAnswerInModule(content: ReportContent, moduleId: string): AnsweredQuestion | undefined {
  const answers = content.answersByModule[moduleId] ?? [];
  if (answers.length === 0) return undefined;
  const scored = answers.filter((a): a is AnsweredQuestion & { selectedScore: number } => a.selectedScore !== null);
  if (scored.length === 0) return answers[0];
  return scored.reduce((worst, a) => (a.selectedScore < worst.selectedScore ? a : worst));
}

/** Renders one answer as an "Evidence/Signal" table cell — always the respondent's own question+response, never an inference. */
export function evidenceSignal(answer: AnsweredQuestion | undefined): string {
  if (!answer) return 'Not captured in this assessment.';
  return `"${answer.text}" — response: "${answer.selectedOption}."`;
}

/** The strongest N modules, strongest-first — moduleRecommendations is already sorted weakest-first, so this is the tail, reversed. */
export function topStrengths(content: ReportContent, count = 3): ModuleRecommendation[] {
  return content.moduleRecommendations.slice(-count).reverse();
}

/** The weakest N modules, weakest-first. */
export function topConcerns(content: ReportContent, count = 3): ModuleRecommendation[] {
  return content.moduleRecommendations.slice(0, count);
}

/**
 * Up to 5 Executive Summary paragraphs, entirely derived from already-
 * computed ReportContent fields (score, rating, strengths, weaknesses,
 * rating distribution) plus the respondent's own free-text answer where
 * given — no paragraph here invents a fact not already present on
 * `assessment`/`content`. Callers slice this to the paragraph count their
 * tier calls for (Summary: first 3, Full: all).
 */
export function buildExecutiveNarrative(assessment: AssessmentDetail, content: ReportContent): string[] {
  const paragraphs: string[] = [];
  const total = content.moduleRecommendations.length;
  const adjective = RATING_ADJECTIVE[assessment.healthRating];

  paragraphs.push(
    `Your assessment indicates a ${adjective} level of inventory control, with an overall score of ` +
      `${assessment.overallPercentage}% (${assessment.overallScore} of ${content.overallMaxScore} points) across ` +
      `${total} operational modules. ${content.overallSummary}`
  );

  if (content.strongestModule) {
    const s = content.strongestModule;
    const solidCount = content.ratingCounts.Excellent + content.ratingCounts.Good;
    paragraphs.push(
      `The strongest area identified is ${s.moduleName}, scoring ${s.percentage}% (${s.rating}). ${s.businessImpact} ` +
        `${solidCount} of ${total} modules are currently rated Good or Excellent, indicating a base of practices that ` +
        `are already working and can be built on.`
    );
  }

  if (content.weakestModule) {
    const w = content.weakestModule;
    paragraphs.push(
      `The area requiring the most attention is ${w.moduleName}, scoring ${w.percentage}% (${w.rating}). ` +
        `${w.businessImpact} In total, ${content.attentionCount} of ${total} modules currently sit in the High or ` +
        `Medium priority band and warrant focused management attention.`
    );
  }

  paragraphs.push(
    `Across the areas assessed, ${content.ratingCounts.Critical} module${content.ratingCounts.Critical === 1 ? '' : 's'} ` +
      `${content.ratingCounts.Critical === 1 ? 'is' : 'are'} rated Critical, ${content.ratingCounts['Needs Improvement']} ` +
      `rated Needs Improvement, ${content.ratingCounts.Good} rated Good, and ${content.ratingCounts.Excellent} rated ` +
      `Excellent. The sections that follow examine each of these areas individually, with the evidence behind each ` +
      `rating and its specific business consequence.`
  );

  if (content.biggestChallenge) {
    paragraphs.push(
      `When asked to describe the single biggest inventory or warehouse challenge facing the business, the ` +
        `respondent identified: "${content.biggestChallenge}" This self-reported challenge is a useful cross-check ` +
        `against the scored findings in this report.`
    );
  }

  return paragraphs;
}

/** One row of the Business & Inventory Profile table — Parameter/Result come only from real CompanyRecord fields; a field is simply omitted (never invented) if it's blank. */
export interface ProfileRow {
  parameter: string;
  result: string;
  interpretation: string;
}

export function businessProfileRows(assessment: AssessmentDetail): ProfileRow[] {
  const { company } = assessment;
  const rows: ProfileRow[] = [];

  if (company.businessType?.trim()) {
    rows.push({
      parameter: 'Business Type',
      result: company.businessType,
      interpretation: 'Shapes which inventory control practices are most relevant to this business model.',
    });
  }
  if (company.industry?.trim()) {
    rows.push({
      parameter: 'Industry',
      result: company.industry,
      interpretation: 'Industry norms inform the benchmarks this assessment is measured against.',
    });
  }
  if (company.employeeCount?.trim()) {
    rows.push({
      parameter: 'Number of Employees',
      result: company.employeeCount,
      interpretation: 'Indicates the organizational scale available to staff inventory control functions.',
    });
  }
  if (company.inventoryLocations?.trim()) {
    rows.push({
      parameter: 'Inventory Locations',
      result: company.inventoryLocations,
      interpretation:
        'More locations increase the complexity of maintaining consistent stock accuracy and control company-wide.',
    });
  }
  if (company.activeSkus?.trim()) {
    rows.push({
      parameter: 'Approximate Active SKUs',
      result: company.activeSkus,
      interpretation:
        'SKU volume is a primary driver of the classification, counting, and system discipline required for control.',
    });
  }

  return rows;
}
