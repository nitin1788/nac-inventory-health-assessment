import { createElement as h, type ReactElement } from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { COMPANY_NAME, CONSULTATION, CONTACT } from '../../config/constants';
import type { AssessmentDetail, HealthRating } from '../assessment/assessment.types';
import type { ModuleRecommendation, PriorityLevel } from '../recommendations/recommendationTypes';
import {
  answerFor,
  businessProfileRows,
  buildExecutiveNarrative,
  evidenceSignal,
  PRIORITY_TO_RISK_LEVEL,
  rootCauseCategoryFor,
  ROOT_CAUSE_PHRASE,
  topConcerns,
  topStrengths,
  weakestAnswerInModule,
  type AnsweredQuestion,
  type ReportContent,
  type RootCauseCategory,
} from './pdfReportContent';
import {
  buildAnalysisTable,
  buildBrandFooter,
  buildBulletList,
  buildCalloutBox,
  buildCoverPage,
  buildFishboneDiagram,
  buildFooter,
  buildHealthGauge,
  buildScoreCard,
  DISCLAIMER_TEXT,
  formatInr,
  PRIORITY_COLORS,
  PRIORITY_ORDER,
  RATING_COLORS,
  styles,
  type AnalysisTableColumn,
} from './pdfTemplates.shared';

/**
 * One function per report section — the reusable building blocks the
 * shared PDF engine is assembled from. Every section has the same
 * shape, `(assessment, content) => Page`, so pdfSections.config.ts can
 * treat all of them uniformly regardless of which tier(s) use them.
 * Which sections actually run for a given tier is decided ONLY in
 * pdfSections.config.ts — nothing here knows or cares about tiers.
 *
 * Content boundary: this report is designed to diagnose problems and
 * build trust in NAC's expertise — never to hand over a complete,
 * self-serve implementation plan. No section here renders a full SOP,
 * a step-by-step execution plan, or every raw question answer; every
 * recommendation is a headline, and the report consistently points
 * toward a consultation for the detailed how-to.
 *
 * Every table cell, paragraph number, and evidence quote here traces
 * back to `ReportContent` (see pdfReportContent.ts) or `assessment`
 * itself — nothing in this file invents a SKU count, rupee figure, or
 * finding. Where a page needs interpretation beyond a raw fact (e.g. a
 * "likely cause"), the wording is deliberately hedged ("may indicate",
 * "possible cause", "consistent with") rather than stated as confirmed.
 */
export type SectionBuilder = (assessment: AssessmentDetail, content: ReportContent) => ReactElement;

function ratingBadgeColors(value: string) {
  return RATING_COLORS[value as HealthRating];
}

function priorityBadgeColors(value: string) {
  return PRIORITY_COLORS[value as PriorityLevel];
}

function riskLevelBadgeColors(value: string) {
  return PRIORITY_COLORS[value as 'High' | 'Medium' | 'Low'];
}

/** Every module in the question bank's natural order (not weakest-first) — used wherever a page presents "every module" rather than "the weakest ones." */
function orderedModuleRecommendations(assessment: AssessmentDetail, content: ReportContent): ModuleRecommendation[] {
  return assessment.moduleScores
    .map((moduleScore) => content.moduleRecommendations.find((r) => r.moduleId === moduleScore.moduleId))
    .filter((r): r is ModuleRecommendation => r !== undefined);
}

/** Just the respondent's own chosen answer, without the question text — used where table space is tight (Risk Analysis' 8-row table) rather than the fuller evidenceSignal(). */
function shortEvidence(answer: AnsweredQuestion | undefined): string {
  if (!answer) return 'Not captured in this assessment.';
  return `Response: "${answer.selectedOption}."`;
}

/**
 * A hedged "gap identified" reading for a specific control practice —
 * derived from the OWNING MODULE'S already-computed rating (real data),
 * never from an invented per-question threshold. Weak modules read as a
 * possible gap; Good/Excellent modules read as no significant gap.
 */
function gapFromRating(rec: ModuleRecommendation | undefined): string {
  if (!rec) return 'Not captured in this assessment.';
  const weak = rec.rating === 'Critical' || rec.rating === 'Needs Improvement';
  return weak
    ? `Potential gap — this practice may not yet be operating at a mature level, consistent with the module's overall ${rec.rating} rating.`
    : `No significant gap identified — consistent with the module's overall ${rec.rating} rating.`;
}

/** One labeled, wrapping line — e.g. "Problem identified: <text>" — with the label rendered bold inline. */
function buildLabeledLine(label: string, text: string) {
  return h(
    Text,
    { style: styles.tightParagraph },
    h(Text, { style: styles.labelSpan }, `${label}: `),
    text
  );
}

/** A single module's recommendation rendered as labeled descriptive lines rather than a bare bullet — used by both tiers' recommendation pages, `detailed` controls how much of each array is included. */
function buildRecommendationBlock(m: ModuleRecommendation, detailed: boolean) {
  const ratingColors = RATING_COLORS[m.rating];
  const action = (detailed ? m.recommendations.slice(0, 2).join(' ') : m.recommendations[0]) ?? '';
  const benefit = (detailed ? m.expectedBenefits.join(' ') : m.expectedBenefits[0]) ?? '';

  return h(
    View,
    { key: m.moduleId, style: { marginBottom: 12 }, wrap: false },
    h(
      View,
      { style: styles.moduleHeaderRow },
      h(Text, { style: styles.moduleTitle }, m.moduleName),
      h(
        Text,
        { style: [styles.ratingBadgeCell, { backgroundColor: ratingColors.bg, color: ratingColors.text }] },
        `${m.percentage}% · ${m.rating}`
      )
    ),
    buildLabeledLine('Problem identified', m.summary),
    buildLabeledLine('Recommended action', action),
    buildLabeledLine('Why this action matters', m.businessImpact),
    buildLabeledLine('Expected business benefit', benefit),
    detailed
      ? buildLabeledLine('Validation required', 'To be confirmed with NAC during a consultation review.')
      : null
  );
}

/** The Consultation CTA block shared, verbatim, by both tiers' closing page — service details, contact, brand footer, disclaimer. */
function buildConsultationCtaBlock() {
  return [
    h(Text, { style: styles.sectionTitle }, CONSULTATION.serviceName),
    h(Text, { style: styles.paragraph }, CONSULTATION.description),
    buildBulletList([
      `Duration: ${CONSULTATION.duration}`,
      `Format: ${CONSULTATION.mode}`,
      `Fee: ${formatInr(CONSULTATION.fee)}`,
    ]),
    h(Text, { style: styles.paragraph }, `To book, contact ${COMPANY_NAME} at ${CONTACT.email} or ${CONTACT.phone}.`),
    buildBrandFooter(),
    h(Text, { style: styles.disclaimer }, DISCLAIMER_TEXT),
  ];
}

// ── Summary tier (₹99, exactly 7 pages) ─────────────────────────────

export const coverPageSection: SectionBuilder = (assessment, _content) =>
  buildCoverPage(assessment, 'Report Summary');

/** Page 2 — score, 2-3 narrative paragraphs, Key Strengths / Key Concerns. */
export const executiveSummarySection: SectionBuilder = (assessment, content) => {
  const paragraphs = buildExecutiveNarrative(assessment, content).slice(0, 3);
  const strengths = topStrengths(content, 3);
  const concerns = topConcerns(content, 3);

  return h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Executive Summary'),
    buildScoreCard(assessment, content.overallMaxScore),
    ...paragraphs.map((p, i) => h(Text, { key: i, style: styles.paragraph }, p)),
    h(
      View,
      { style: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 } },
      h(
        View,
        { style: { width: '48%' } },
        h(Text, { style: styles.subsectionTitle }, 'Key Strengths'),
        buildBulletList(strengths.map((m) => `${m.moduleName} — ${m.percentage}% (${m.rating})`))
      ),
      h(
        View,
        { style: { width: '48%' } },
        h(Text, { style: styles.subsectionTitle }, 'Key Concerns'),
        buildBulletList(concerns.map((m) => `${m.moduleName} — ${m.percentage}% (${m.rating})`))
      )
    ),
    buildFooter()
  );
};

/** Page 3 — every module, natural order, with a real per-module observation + business impact. */
export const moduleWiseAnalysisSection: SectionBuilder = (assessment, content) => {
  const columns: AnalysisTableColumn[] = [
    { key: 'module', header: 'Module', width: '20%', strong: true },
    { key: 'score', header: 'Score', width: '10%' },
    { key: 'rating', header: 'Rating', width: '16%', badge: ratingBadgeColors },
    { key: 'observation', header: 'Key Observation', width: '26%' },
    { key: 'impact', header: 'Business Impact', width: '28%' },
  ];
  const rows = orderedModuleRecommendations(assessment, content).map((m) => ({
    module: m.moduleName,
    score: `${m.percentage}%`,
    rating: m.rating,
    observation: m.summary,
    impact: m.businessImpact,
  }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Module-wise Analysis'),
    h(
      Text,
      { style: styles.paragraph },
      'Every assessed module, with what the result actually indicates and what it means for the business — not ' +
        'just a score.'
    ),
    buildAnalysisTable(columns, rows),
    buildFooter()
  );
};

/** Page 4 — the 5 weakest modules as findings, each backed by the respondent's own answer as evidence. */
export const top5FindingsSection: SectionBuilder = (_assessment, content) => {
  const columns: AnalysisTableColumn[] = [
    { key: 'finding', header: 'Finding', width: '16%', strong: true },
    { key: 'why', header: 'Why It Matters', width: '23%' },
    { key: 'impact', header: 'Business Impact', width: '23%' },
    { key: 'evidence', header: 'Evidence / Signal', width: '26%' },
    { key: 'priority', header: 'Priority', width: '12%', badge: priorityBadgeColors },
  ];
  const rows = content.weakestFive.map((m) => ({
    finding: m.moduleName,
    why: m.summary,
    impact: m.businessImpact,
    evidence: evidenceSignal(weakestAnswerInModule(content, m.moduleId)),
    priority: m.priority,
  }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Top 5 Findings'),
    h(Text, { style: styles.paragraph }, 'The 5 modules most in need of attention, ranked weakest first.'),
    buildAnalysisTable(columns, rows),
    buildFooter()
  );
};

/** Page 5 — the same 5 modules reframed as business risk. */
export const riskAnalysisSummarySection: SectionBuilder = (_assessment, content) => {
  const columns: AnalysisTableColumn[] = [
    { key: 'area', header: 'Risk Area', width: '18%', strong: true },
    { key: 'level', header: 'Risk Level', width: '12%', badge: riskLevelBadgeColors },
    { key: 'observation', header: 'Observation', width: '24%' },
    { key: 'impact', header: 'Potential Business Impact', width: '28%' },
    { key: 'priority', header: 'Priority', width: '12%', badge: priorityBadgeColors },
  ];
  const rows = content.weakestFive.map((m) => ({
    area: m.moduleName,
    level: PRIORITY_TO_RISK_LEVEL[m.priority],
    observation: m.summary,
    impact: m.businessImpact,
    priority: m.priority,
  }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Risk Analysis'),
    h(Text, { style: styles.paragraph }, 'Where the business is currently most exposed to operational risk.'),
    buildAnalysisTable(columns, rows),
    buildFooter()
  );
};

/** Page 6 — descriptive Problem/Action/Why/Benefit blocks for the same 5 weakest modules. */
export const top5RecommendationsSection: SectionBuilder = (_assessment, content) =>
  h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Top 5 Recommendations'),
    h(Text, { style: styles.paragraph }, 'One priority action for each of your 5 weakest areas, and why it matters.'),
    ...content.weakestFive.map((m) => buildRecommendationBlock(m, false)),
    buildFooter()
  );

/** Page 7 — what this report does/doesn't establish, and the Consultation CTA. */
export const conclusionCtaSection: SectionBuilder = (_assessment, content) => {
  const concernNames = topConcerns(content, 3)
    .map((m) => m.moduleName)
    .join(', ');

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Ready to Act on These Findings?'),
    h(
      Text,
      { style: styles.paragraph },
      `This report tells you where your inventory operation stands today, based on ${content.moduleRecommendations.length} ` +
        `self-reported modules, and flags ${concernNames || 'no'} as the areas needing the most attention.`
    ),
    buildCalloutBox(
      'What this assessment does not establish',
      'This is a self-reported diagnostic, not a physical audit — it does not confirm exact stock quantities, ' +
        'financial loss figures, or root causes on the ground. Turning these findings into a validated, sequenced ' +
        'action plan is exactly what a consultation with Nitin Anand Consulting delivers.',
      'warning'
    ),
    ...buildConsultationCtaBlock(),
    buildFooter()
  );
};

// ── Full tier (₹299, exactly 15 pages) ──────────────────────────────

export const fullCoverPageSection: SectionBuilder = (assessment, _content) =>
  buildCoverPage(assessment, 'Professional Inventory Report');

/** Page 2 — 3-5 narrative paragraphs (score, rating, strengths, weaknesses, distribution). */
export const executiveNarrativeSection: SectionBuilder = (assessment, content) => {
  const paragraphs = buildExecutiveNarrative(assessment, content);
  return h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Executive Summary'),
    buildScoreCard(assessment, content.overallMaxScore),
    ...paragraphs.map((p, i) => h(Text, { key: i, style: styles.paragraph }, p)),
    buildFooter()
  );
};

/** Page 3 — real company fields only, each paired with a data-driven interpretation. */
export const businessProfileSection: SectionBuilder = (assessment, _content) => {
  const rows = businessProfileRows(assessment);
  const columns: AnalysisTableColumn[] = [
    { key: 'parameter', header: 'Parameter', width: '26%', strong: true },
    { key: 'result', header: 'Assessment Result', width: '30%' },
    { key: 'interpretation', header: 'Interpretation', width: '44%' },
  ];

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Business & Inventory Profile'),
    h(
      Text,
      { style: styles.paragraph },
      'The business context this assessment was scored against. Only fields actually captured during the ' +
        'assessment are shown below.'
    ),
    rows.length > 0
      ? buildAnalysisTable(
          columns,
          rows.map((r) => ({ parameter: r.parameter, result: r.result, interpretation: r.interpretation }))
        )
      : h(Text, { style: styles.paragraph }, 'Not captured in this assessment.'),
    buildFooter()
  );
};

/** Page 4 — gauge + benchmark framing + a strengths/concerns table. */
export const overallHealthAnalysisSection: SectionBuilder = (assessment, content) => {
  const atOrAboveBenchmark = assessment.moduleScores.filter((m) => m.percentage >= 80).length;
  const total = assessment.moduleScores.length;
  const columns: AnalysisTableColumn[] = [
    { key: 'type', header: 'Type', width: '14%', badge: (v) => (v === 'Strength' ? RATING_COLORS.Excellent : RATING_COLORS.Critical) },
    { key: 'module', header: 'Module', width: '22%', strong: true },
    { key: 'score', header: 'Score', width: '10%' },
    { key: 'note', header: 'Interpretation', width: '54%' },
  ];
  const rows = [
    ...topStrengths(content, 3).map((m) => ({ type: 'Strength', module: m.moduleName, score: `${m.percentage}%`, note: m.businessImpact })),
    ...topConcerns(content, 3).map((m) => ({ type: 'Concern', module: m.moduleName, score: `${m.percentage}%`, note: m.businessImpact })),
  ];

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Overall Inventory Health Analysis'),
    buildHealthGauge(assessment.overallPercentage, assessment.healthRating),
    h(
      Text,
      { style: styles.paragraph },
      `${content.overallSummary} As a general operational benchmark, module scores at or above 80% are considered ` +
        `strong; today, ${atOrAboveBenchmark} of ${total} modules meet that mark.`
    ),
    buildAnalysisTable(columns, rows),
    buildFooter()
  );
};

/** Page 5 — every module, natural order, with Priority added over the Summary tier's version. */
export const fullModuleWiseAnalysisSection: SectionBuilder = (assessment, content) => {
  const columns: AnalysisTableColumn[] = [
    { key: 'module', header: 'Module', width: '17%', strong: true },
    { key: 'score', header: 'Score', width: '9%' },
    { key: 'rating', header: 'Rating', width: '14%', badge: ratingBadgeColors },
    { key: 'observation', header: 'Observation', width: '22%' },
    { key: 'impact', header: 'Business Impact', width: '26%' },
    { key: 'priority', header: 'Priority', width: '12%', badge: priorityBadgeColors },
  ];
  const rows = orderedModuleRecommendations(assessment, content).map((m) => ({
    module: m.moduleName,
    score: `${m.percentage}%`,
    rating: m.rating,
    observation: m.summary,
    impact: m.businessImpact,
    priority: m.priority,
  }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Module-wise Analysis'),
    h(
      Text,
      { style: styles.paragraph },
      'A complete, module-by-module breakdown — every assessed area, ranked and rated with its specific business ' +
        'consequence.'
    ),
    buildAnalysisTable(columns, rows),
    buildFooter()
  );
};

const CONTROL_AREAS: { questionId: string; area: string; moduleId: string }[] = [
  { questionId: 'CTL-02', area: 'Stock Recording', moduleId: 'inventory-control' },
  { questionId: 'ACC-01', area: 'Physical Verification', moduleId: 'inventory-accuracy' },
  { questionId: 'ACC-04', area: 'Reconciliation', moduleId: 'inventory-accuracy' },
  { questionId: 'CTL-01', area: 'Classification / Identification', moduleId: 'inventory-control' },
  { questionId: 'ACC-03', area: 'Cycle Counting', moduleId: 'inventory-accuracy' },
  { questionId: 'PRC-04', area: 'Purchase Control', moduleId: 'procurement' },
];

/** Page 6 — only the control areas the assessment actually asked about, each grounded in the respondent's own answer. */
export const inventoryControlAnalysisSection: SectionBuilder = (_assessment, content) => {
  const columns: AnalysisTableColumn[] = [
    { key: 'area', header: 'Control Area', width: '18%', strong: true },
    { key: 'result', header: 'Assessment Result', width: '26%' },
    { key: 'gap', header: 'Gap Identified', width: '28%' },
    { key: 'consequence', header: 'Business Consequence', width: '28%' },
  ];
  const rows = CONTROL_AREAS.filter((c) => answerFor(content, c.questionId) !== undefined).map((c) => {
    const answer = answerFor(content, c.questionId);
    const rec = content.moduleRecommendations.find((r) => r.moduleId === c.moduleId);
    return {
      area: c.area,
      result: answer?.selectedOption ?? 'Not captured in this assessment.',
      gap: answer ? gapFromRating(rec) : 'Not captured in this assessment.',
      consequence: rec?.businessImpact ?? 'Not captured in this assessment.',
    };
  });

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Inventory Control Analysis'),
    h(
      Text,
      { style: styles.paragraph },
      'How core control practices are actually working today, based on the specific answers given during the ' +
        'assessment — limited to the control areas this assessment covers.'
    ),
    rows.length > 0 ? buildAnalysisTable(columns, rows) : h(Text, { style: styles.paragraph }, 'Not captured in this assessment.'),
    buildFooter()
  );
};

const ACCURACY_CAUSE_BY_QUESTION: Record<string, string> = {
  'ACC-01': 'Infrequent physical verification may allow discrepancies to accumulate undetected between counts.',
  'ACC-02': 'The self-reported accuracy level directly reflects how reliable system stock data currently is for planning.',
  'ACC-03': 'Without regular cycle counting, emerging discrepancies are less likely to be caught early.',
  'ACC-04': 'How discrepancies are handled once found determines whether root causes get corrected or simply repeat.',
  'ACC-05': 'Inconsistent handling of damaged, defective, or rejected stock can distort both physical and system counts.',
};

/** Page 7 — one row per accuracy question actually answered, each with a question-specific hedged "likely cause." */
export const stockAccuracySection: SectionBuilder = (_assessment, content) => {
  const rec = content.moduleRecommendations.find((r) => r.moduleId === 'inventory-accuracy');
  const columns: AnalysisTableColumn[] = [
    { key: 'observation', header: 'Observation', width: '32%' },
    { key: 'cause', header: 'Likely Cause', width: '32%' },
    { key: 'impact', header: 'Business Impact', width: '24%' },
    { key: 'priority', header: 'Priority', width: '12%', badge: priorityBadgeColors },
  ];
  const rows = (content.answersByModule['inventory-accuracy'] ?? []).map((a) => ({
    observation: evidenceSignal(a),
    cause: ACCURACY_CAUSE_BY_QUESTION[a.questionId] ?? 'May indicate a broader inventory accuracy control gap.',
    impact: rec?.businessImpact ?? 'Not captured in this assessment.',
    priority: rec?.priority ?? 'Medium',
  }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Stock Accuracy & Reconciliation Analysis'),
    h(
      Text,
      { style: styles.paragraph },
      'Findings are drawn directly from the assessment responses. Causes are framed as possibilities, not confirmed ' +
        'root causes — this is a self-reported diagnostic, not a physical stock audit.'
    ),
    rows.length > 0 ? buildAnalysisTable(columns, rows) : h(Text, { style: styles.paragraph }, 'Not captured in this assessment.'),
    buildFooter()
  );
};

/** Page 8 — same pattern for the Store / Warehouse Operations module's WAR-* answers. */
export const warehouseProcessSection: SectionBuilder = (_assessment, content) => {
  const rec = content.moduleRecommendations.find((r) => r.moduleId === 'warehouse-operations');
  const columns: AnalysisTableColumn[] = [
    { key: 'area', header: 'Area', width: '20%', strong: true },
    { key: 'observation', header: 'Observation', width: '26%' },
    { key: 'gap', header: 'Gap Identified', width: '26%' },
    { key: 'impact', header: 'Business Impact', width: '28%' },
  ];
  const rows = (content.answersByModule['warehouse-operations'] ?? []).map((a) => ({
    area: a.text,
    observation: `Response: "${a.selectedOption}."`,
    gap: gapFromRating(rec),
    impact: rec?.businessImpact ?? 'Not captured in this assessment.',
  }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Warehouse / Storage Process Analysis'),
    h(
      Text,
      { style: styles.paragraph },
      'Observations are specific to what this assessment actually captured about your store / warehouse process — ' +
        'not generic warehousing advice.'
    ),
    rows.length > 0 ? buildAnalysisTable(columns, rows) : h(Text, { style: styles.paragraph }, 'Not captured in this assessment.'),
    buildFooter()
  );
};

const WORKING_CAPITAL_RISKS: { questionId: string; risk: string; effect: string; moduleId: string }[] = [
  {
    questionId: 'CTL-05',
    risk: 'Excess inventory accumulation',
    effect:
      'Excess stock ties up working capital that could otherwise fund purchasing, operations, or growth initiatives.',
    moduleId: 'inventory-control',
  },
  {
    questionId: 'CTL-06',
    risk: 'Slow-moving stock aging further',
    effect:
      'Slow-moving stock that is not regularly reviewed can quietly erode margins through storage cost and obsolescence risk.',
    moduleId: 'inventory-control',
  },
  {
    questionId: 'CTL-07',
    risk: 'Dead / obsolete stock going unaddressed',
    effect: 'Unaddressed dead stock represents capital that is fully tied up with little to no prospect of recovery.',
    moduleId: 'inventory-control',
  },
  {
    questionId: 'PLN-04',
    risk: 'Safety stock buffer gaps',
    effect:
      'Insufficient safety stock raises the risk of stockouts during demand spikes, while excess safety stock unnecessarily ties up capital.',
    moduleId: 'inventory-planning',
  },
];

/** Page 9 — qualitative-only working capital risk framing, no invented rupee figures. */
export const workingCapitalRiskSection: SectionBuilder = (_assessment, content) => {
  const columns: AnalysisTableColumn[] = [
    { key: 'risk', header: 'Risk', width: '26%', strong: true },
    { key: 'effect', header: 'How It Can Affect Business', width: '54%' },
    { key: 'severity', header: 'Severity', width: '20%', badge: riskLevelBadgeColors },
  ];
  const rows = WORKING_CAPITAL_RISKS.filter((w) => answerFor(content, w.questionId) !== undefined).map((w) => {
    const rec = content.moduleRecommendations.find((r) => r.moduleId === w.moduleId);
    return {
      risk: w.risk,
      effect: w.effect,
      severity: PRIORITY_TO_RISK_LEVEL[rec?.priority ?? 'Medium'],
    };
  });

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Working Capital & Excess Inventory Risk'),
    h(
      Text,
      { style: styles.paragraph },
      'This assessment does not capture exact stock values or rupee-denominated losses, so the risks below are ' +
        'framed qualitatively rather than with invented financial figures.'
    ),
    rows.length > 0 ? buildAnalysisTable(columns, rows) : h(Text, { style: styles.paragraph }, 'Not captured in this assessment.'),
    buildFooter()
  );
};

/** Page 10 — every module framed as risk, with a short written lead-in. */
export const fullRiskAnalysisSection: SectionBuilder = (assessment, content) => {
  const columns: AnalysisTableColumn[] = [
    { key: 'area', header: 'Risk Area', width: '17%', strong: true },
    { key: 'severity', header: 'Severity', width: '11%', badge: riskLevelBadgeColors },
    { key: 'signal', header: 'Probability / Signal', width: '24%' },
    { key: 'impact', header: 'Business Impact', width: '26%' },
    { key: 'priority', header: 'Priority', width: '12%', badge: priorityBadgeColors },
  ];
  const rows = orderedModuleRecommendations(assessment, content).map((m) => ({
    area: m.moduleName,
    severity: PRIORITY_TO_RISK_LEVEL[m.priority],
    signal: shortEvidence(weakestAnswerInModule(content, m.moduleId)),
    impact: m.businessImpact,
    priority: m.priority,
  }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Risk Analysis'),
    h(
      Text,
      { style: styles.paragraph },
      `${content.attentionCount} of ${rows.length} modules currently sit in the High or Medium priority band. The ` +
        `table below frames every assessed area as business risk, not just a score.`
    ),
    buildAnalysisTable(columns, rows),
    buildFooter()
  );
};

/** Page 11 — hedged root-cause reasoning + table, fishbone diagram as a supporting visual only. */
export const rootCauseAnalysisSection: SectionBuilder = (_assessment, content) => {
  const attention = content.weakestFive;
  const columns: AnalysisTableColumn[] = [
    { key: 'problem', header: 'Observed Problem', width: '22%', strong: true },
    { key: 'cause', header: 'Possible Root Cause', width: '30%' },
    { key: 'evidence', header: 'Evidence / Signal', width: '30%' },
    { key: 'validation', header: 'Validation Required', width: '18%' },
  ];
  const rows = attention.map((m) => ({
    problem: `${m.moduleName} rated ${m.rating} (${m.percentage}%)`,
    cause: ROOT_CAUSE_PHRASE[rootCauseCategoryFor(m.moduleId)],
    evidence: evidenceSignal(weakestAnswerInModule(content, m.moduleId)),
    validation: 'Requires on-site or documentation-based validation with NAC.',
  }));

  const grouped = new Map<RootCauseCategory, ModuleRecommendation[]>();
  for (const m of attention) {
    const category = rootCauseCategoryFor(m.moduleId);
    (grouped.get(category) ?? grouped.set(category, []).get(category)!).push(m);
  }
  const categorized = [...grouped.entries()].map(([category, modules]) => ({ category, modules }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Root Cause Analysis'),
    h(
      Text,
      { style: styles.paragraph },
      'This is a consulting assessment, not a physical audit — the causes below are possibilities suggested by the ' +
        'pattern of responses, not confirmed findings. Each is framed as a possible process, control, or people ' +
        'factor behind the observed result, with a business consequence attached.'
    ),
    buildAnalysisTable(columns, rows),
    categorized.length > 0
      ? h(
          View,
          { style: { marginTop: 8 } },
          h(Text, { style: styles.subsectionTitle }, 'Root-Cause Clustering (supporting visual)'),
          buildFishboneDiagram(categorized)
        )
      : null,
    buildFooter()
  );
};

/** Page 12 — every module as a priority-matrix row; badge colour is the "visual," no separate large grid. */
export const priorityMatrixTableSection: SectionBuilder = (assessment, content) => {
  const columns: AnalysisTableColumn[] = [
    { key: 'priority', header: 'Priority', width: '12%', badge: priorityBadgeColors },
    { key: 'issue', header: 'Issue', width: '18%', strong: true },
    { key: 'why', header: 'Why It Matters Now', width: '26%' },
    { key: 'direction', header: 'Recommended Direction', width: '24%' },
    { key: 'outcome', header: 'Expected Outcome', width: '20%' },
  ];
  const sorted = [...orderedModuleRecommendations(assessment, content)].sort((a, b) => {
    const priorityDelta = PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority);
    return priorityDelta !== 0 ? priorityDelta : a.percentage - b.percentage;
  });
  const rows = sorted.map((m) => ({
    priority: m.priority,
    issue: m.moduleName,
    why: m.businessImpact,
    direction: m.recommendations[0] ?? '',
    outcome: m.expectedBenefits[0] ?? '',
  }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Priority Matrix'),
    h(Text, { style: styles.paragraph }, 'Every assessed area, grouped by how urgently it warrants business attention.'),
    buildAnalysisTable(columns, rows),
    buildFooter()
  );
};

/** Page 13 — highly descriptive per-module blocks for the 5 weakest modules, richer than the Summary tier's version. */
export const detailedRecommendationsSection: SectionBuilder = (_assessment, content) =>
  h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Detailed Recommendations'),
    h(
      Text,
      { style: styles.paragraph },
      'A deeper look at the 5 highest-impact opportunities — what was found, why it matters, and what validating ' +
        'it further would involve.'
    ),
    ...content.weakestFive.map((m) => buildRecommendationBlock(m, true)),
    buildFooter()
  );

/** Page 14 — only the modules that actually need a management decision now; NOT a self-serve 30/60/90 plan. */
export const managementActionPrioritiesSection: SectionBuilder = (_assessment, content) => {
  const attentionModules = [...content.byPriority.High, ...content.byPriority.Medium];
  const columns: AnalysisTableColumn[] = [
    { key: 'priority', header: 'Priority', width: '12%', badge: priorityBadgeColors },
    { key: 'area', header: 'Area', width: '18%', strong: true },
    { key: 'action', header: 'Recommended Action', width: '26%' },
    { key: 'decision', header: 'Management Decision Required', width: '26%' },
    { key: 'outcome', header: 'Expected Outcome', width: '18%' },
  ];
  const rows = attentionModules.map((m) => ({
    priority: m.priority,
    area: m.moduleName,
    action: m.recommendations[0] ?? '',
    decision: `Whether to prioritize and resource action on ${m.moduleName.toLowerCase()} this quarter.`,
    outcome: m.expectedBenefits[0] ?? '',
  }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Management Action Priorities'),
    h(
      Text,
      { style: styles.paragraph },
      'What management should review and decide on, together with NAC — not a self-serve execution plan.'
    ),
    rows.length > 0
      ? buildAnalysisTable(columns, rows)
      : h(Text, { style: styles.paragraph }, 'No areas currently require urgent management decisions.'),
    buildFooter()
  );
};

/** Page 15 — overall position, major risk areas, what remote assessment can/cannot confirm, then the Consultation CTA. */
export const fullConclusionCtaSection: SectionBuilder = (_assessment, content) => {
  const riskAreaNames = [...content.byPriority.High, ...content.byPriority.Medium]
    .map((m) => m.moduleName)
    .join(', ');

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Conclusion'),
    h(
      Text,
      { style: styles.paragraph },
      `${content.overallSummary} The major risk areas identified in this report are: ${riskAreaNames || 'none — no modules currently require urgent attention'}.`
    ),
    buildCalloutBox(
      'What can and cannot be confirmed remotely',
      'This assessment reliably captures how your team perceives and describes current practices. It cannot ' +
        'confirm exact SKU counts, physical stock condition, or on-the-ground root causes — that requires a ' +
        'documentation review or site visit, which is exactly what a consultation with Nitin Anand Consulting ' +
        'provides.',
      'info'
    ),
    ...buildConsultationCtaBlock(),
    buildFooter()
  );
};
