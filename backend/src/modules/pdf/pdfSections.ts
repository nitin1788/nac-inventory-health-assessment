import { createElement as h, type ReactElement } from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { COMPANY_NAME, CONTACT } from '../../config/constants';
import type { AssessmentDetail, HealthRating } from '../assessment/assessment.types';
import type { ModuleRecommendation, PriorityLevel } from '../recommendations/recommendationTypes';
import { QUESTION_TEXT_INDEX } from './questionTextIndex';
import type { ReportContent } from './pdfReportContent';
import {
  buildBrandFooter,
  buildBulletList,
  buildCompanyDetailsGrid,
  buildCoverPage,
  buildFindingRow,
  buildFooter,
  buildModuleScoresTable,
  buildScoreCard,
  DISCLAIMER_TEXT,
  PRIORITY_COLORS,
  PRIORITY_GROUP_LABELS,
  PRIORITY_ORDER,
  RATING_COLORS,
  styles,
} from './pdfTemplates.shared';

/**
 * One function per report section — the reusable building blocks the
 * shared PDF engine is assembled from. Every section has the same
 * shape, `(assessment, content) => Page`, so pdfSections.config.ts can
 * treat all of them uniformly regardless of which tier(s) use them.
 * Which sections actually run for a given tier is decided ONLY in
 * pdfSections.config.ts — nothing here knows or cares about tiers.
 */
export type SectionBuilder = (assessment: AssessmentDetail, content: ReportContent) => ReactElement;

function buildModuleRecommendationBlock(recommendation: ModuleRecommendation) {
  const ratingColors = RATING_COLORS[recommendation.rating];
  const priorityColors = PRIORITY_COLORS[recommendation.priority];

  return h(
    View,
    { key: recommendation.moduleId, style: styles.moduleBlock, wrap: false },
    h(
      View,
      { style: styles.moduleHeaderRow },
      h(Text, { style: styles.moduleTitle }, recommendation.moduleName),
      h(
        View,
        { style: styles.badgeRow },
        h(
          Text,
          { style: [styles.badge, { backgroundColor: ratingColors.bg, color: ratingColors.text }] },
          recommendation.rating
        ),
        h(
          Text,
          { style: [styles.badge, { backgroundColor: priorityColors.bg, color: priorityColors.text }] },
          `${recommendation.priority} priority`
        )
      )
    ),
    h(Text, { style: styles.subsectionTitle }, 'Recommended Actions'),
    buildBulletList(recommendation.recommendations)
  );
}

function buildTimeBoxedPlanSection(
  pageTitle: string,
  framing: string,
  priority: PriorityLevel
): SectionBuilder {
  return (_assessment, content) => {
    const modules = content.byPriority[priority];
    return h(
      Page,
      { size: 'A4', style: styles.page, wrap: true },
      h(Text, { style: styles.pageHeading }, pageTitle),
      h(Text, { style: styles.paragraph }, framing),
      modules.length === 0
        ? h(Text, { style: styles.paragraph }, 'No modules currently fall into this priority band.')
        : h(
            View,
            null,
            ...modules.map((moduleRecommendation) =>
              h(
                View,
                { key: moduleRecommendation.moduleId, style: { marginBottom: 8 }, wrap: false },
                h(Text, { style: styles.moduleTitle }, moduleRecommendation.moduleName),
                buildBulletList(moduleRecommendation.recommendations)
              )
            )
          ),
      buildFooter()
    );
  };
}

const CONCLUSION_TEXT: Record<HealthRating, string> = {
  Excellent:
    'Your inventory operation is performing at a genuinely strong level. The priority now is protecting that ' +
    'position — documenting what already works well and staying disciplined as the business grows, rather than ' +
    'reacting to problems as they appear.',
  Good:
    'Your inventory operation has a solid foundation with a clear, achievable path to a stronger position. ' +
    'Working through the priorities outlined in this report in order — rather than all at once — is the most ' +
    'reliable way to close the remaining gaps.',
  'Needs Improvement':
    'Your inventory operation has real, addressable gaps that are likely already showing up as cost, service, or ' +
    'accuracy issues. None of the findings in this report are unusual for a growing business, and the action ' +
    'plan above sets out a realistic sequence for closing them.',
  Critical:
    'Your inventory operation currently carries significant operational risk. The good news is that the highest-' +
    'impact fixes are usually the most basic ones — the 30-day action plan above is designed to address the most ' +
    'urgent gaps first, before moving on to longer-term improvements.',
};

// ── Sections shared by both tiers ──────────────────────────────────

export const coverPageSection: SectionBuilder = (assessment, _content) =>
  buildCoverPage(assessment, 'Report Summary');

export const overallScoreSection: SectionBuilder = (assessment, content) =>
  h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Overall Score & Health Rating'),
    buildScoreCard(assessment, content.overallMaxScore),
    h(Text, { style: styles.paragraph }, content.overallSummary),
    h(Text, { style: styles.sectionTitle }, 'Overall Improvement Priority'),
    h(Text, { style: styles.paragraph }, buildImprovementPriorityText(content)),
    buildFooter()
  );

export const moduleScoresSection: SectionBuilder = (assessment, _content) =>
  h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Module-wise Scores'),
    buildModuleScoresTable(assessment.moduleScores),
    buildFooter()
  );

export const top5FindingsSection: SectionBuilder = (assessment, _content) => {
  const weakest = [...assessment.moduleScores].sort((a, b) => a.percentage - b.percentage).slice(0, 5);

  return h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Top 5 Findings'),
    h(Text, { style: styles.paragraph }, 'The 5 modules that most need attention, ranked weakest first.'),
    ...weakest.map((moduleScore) => buildFindingRow(moduleScore, RATING_COLORS[moduleScore.rating])),
    buildFooter()
  );
};

export const top5RecommendationsSection: SectionBuilder = (_assessment, content) =>
  h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Top 5 Recommendations'),
    h(Text, { style: styles.paragraph }, 'One priority action for each of your 5 weakest areas.'),
    buildBulletList(content.weakestFive.map((m) => `${m.moduleName}: ${m.recommendations[0]}`)),
    buildFooter()
  );

/**
 * Shared by overallScoreSection (both tiers) — a single templated
 * paragraph naming the weakest module, derived entirely from
 * already-computed content, no new per-module authoring.
 */
function buildImprovementPriorityText(content: ReportContent): string {
  const top = content.weakestFive[0];
  return top
    ? `Your single highest-impact opportunity right now is ${top.moduleName}, currently rated ${top.rating} ` +
        `(${top.priority} priority). Addressing this first will have the greatest effect on your overall ` +
        `inventory health score.`
    : 'All assessed modules are currently performing well — the priority is sustaining current practices.';
}

export const nextStepsSection: SectionBuilder = (_assessment, _content) =>
  h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Next Steps'),
    h(
      Text,
      { style: styles.paragraph },
      'This Report Summary gives you the headline picture of your inventory health. For a complete, ' +
        'module-by-module analysis — including root cause analysis, question-level insights, and a 30/60/90-day ' +
        'action plan — the Full Professional Inventory Report is available as a separate purchase.'
    ),
    h(
      Text,
      { style: styles.paragraph },
      `Questions about this report? Contact ${COMPANY_NAME} at ${CONTACT.email} or ${CONTACT.phone}.`
    ),
    buildBrandFooter(),
    buildFooter()
  );

// ── Full-tier-only sections ─────────────────────────────────────────

export const fullCoverPageSection: SectionBuilder = (assessment, _content) =>
  buildCoverPage(assessment, 'Professional Inventory Report');

export const executiveSummarySection: SectionBuilder = (assessment, content) => {
  const needingAttention = content.moduleRecommendations.filter(
    (r) => r.priority === 'High' || r.priority === 'Medium'
  ).length;

  const text =
    `This report presents a complete analysis of ${assessment.company.companyName}'s inventory management ` +
    `practices, based on a ${assessment.moduleScores.length}-module operational assessment. The organization ` +
    `scored ${assessment.overallScore} out of ${content.overallMaxScore} (${assessment.overallPercentage}%), an ` +
    `overall rating of ${assessment.healthRating}. ${content.overallSummary} ${needingAttention} of ` +
    `${assessment.moduleScores.length} modules require attention in the near term, detailed module-by-module in ` +
    `the sections that follow.`;

  return h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Executive Summary'),
    h(Text, { style: styles.sectionTitle }, 'Company Details'),
    buildCompanyDetailsGrid(assessment),
    h(Text, { style: styles.sectionTitle }, 'Summary'),
    h(Text, { style: styles.paragraph }, text),
    buildFooter()
  );
};

export const rootCauseAnalysisSection: SectionBuilder = (_assessment, content) =>
  h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Root Cause Analysis'),
    h(Text, { style: styles.paragraph }, 'Why each module scored the way it did.'),
    ...content.moduleRecommendations.map((r) =>
      h(
        View,
        { key: r.moduleId, style: { marginBottom: 10 }, wrap: false },
        h(Text, { style: styles.moduleTitle }, r.moduleName),
        h(Text, { style: styles.paragraph }, r.summary)
      )
    ),
    buildFooter()
  );

export const moduleDetailedAnalysisSection: SectionBuilder = (_assessment, content) =>
  h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Module-wise Detailed Analysis'),
    ...content.moduleRecommendations.map(buildModuleRecommendationBlock),
    buildFooter()
  );

export const questionInsightsSection: SectionBuilder = (assessment, _content) => {
  const byModule = new Map<string, { moduleName: string; rows: { text: string; answer: string }[] }>();

  for (const answer of assessment.answers) {
    const entry = QUESTION_TEXT_INDEX[answer.questionId];
    if (!entry) continue;

    const moduleScore = assessment.moduleScores.find((m) => m.moduleId === entry.moduleId);
    const moduleName = moduleScore?.moduleName ?? entry.moduleId;

    if (!byModule.has(entry.moduleId)) {
      byModule.set(entry.moduleId, { moduleName, rows: [] });
    }
    byModule.get(entry.moduleId)!.rows.push({ text: entry.text, answer: answer.selectedOption });
  }

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Question-Level Insights'),
    h(Text, { style: styles.paragraph }, 'Your responses to every assessment question, grouped by module.'),
    ...[...byModule.values()].map(({ moduleName, rows }) =>
      h(
        View,
        { key: moduleName, style: { marginBottom: 12 }, wrap: false },
        h(Text, { style: styles.subsectionTitle }, moduleName),
        ...rows.map((row) =>
          h(
            View,
            { key: row.text, style: styles.questionRow },
            h(Text, { style: styles.questionText }, row.text),
            h(Text, { style: styles.questionAnswer }, row.answer)
          )
        )
      )
    ),
    buildFooter()
  );
};

export const businessImpactSection: SectionBuilder = (_assessment, content) =>
  h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Business Impact'),
    h(Text, { style: styles.paragraph }, 'What improving each area is expected to mean for the business.'),
    ...content.moduleRecommendations.map((r) =>
      h(
        View,
        { key: r.moduleId, style: { marginBottom: 10 }, wrap: false },
        h(Text, { style: styles.moduleTitle }, r.moduleName),
        buildBulletList(r.expectedBenefits)
      )
    ),
    buildFooter()
  );

export const priorityMatrixSection: SectionBuilder = (_assessment, content) =>
  h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Priority Matrix'),
    h(Text, { style: styles.paragraph }, 'Every module at a glance, grouped by business urgency.'),
    ...PRIORITY_ORDER.map((priority) => {
      const modules = content.byPriority[priority];
      if (modules.length === 0) return null;
      const colors = PRIORITY_COLORS[priority];

      return h(
        View,
        { key: priority, style: styles.priorityGroup },
        h(Text, { style: [styles.subsectionTitle, { color: colors.text }] }, PRIORITY_GROUP_LABELS[priority]),
        ...modules.map((m) =>
          h(Text, { key: m.moduleId, style: styles.matrixRow }, `•  ${m.moduleName}  —  ${m.percentage}%`)
        )
      );
    }),
    buildFooter()
  );

export const actionPlan30DaySection = buildTimeBoxedPlanSection(
  '30-Day Action Plan',
  'High-priority modules — begin these actions within the next 30 days.',
  'High'
);

export const actionPlan60DaySection = buildTimeBoxedPlanSection(
  '60-Day Action Plan',
  'Medium-priority modules — plan these actions for the next 60 days.',
  'Medium'
);

export const actionPlan90DaySection: SectionBuilder = (_assessment, content) => {
  const low = content.byPriority.Low;
  const maintain = content.byPriority.Maintain;

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, '90-Day Improvement Roadmap'),
    h(
      Text,
      { style: styles.paragraph },
      'Lower-priority modules to address over the next 90 days, plus areas to sustain.'
    ),
    low.length === 0
      ? h(Text, { style: styles.paragraph }, 'No modules currently fall into this priority band.')
      : h(
          View,
          null,
          ...low.map((m) =>
            h(
              View,
              { key: m.moduleId, style: { marginBottom: 8 }, wrap: false },
              h(Text, { style: styles.moduleTitle }, m.moduleName),
              buildBulletList(m.recommendations)
            )
          )
        ),
    maintain.length > 0
      ? h(
          View,
          { style: { marginTop: 10 } },
          h(Text, { style: styles.subsectionTitle }, 'Maintain — Sustain Current Practices'),
          ...maintain.map((m) => h(Text, { key: m.moduleId, style: styles.matrixRow }, `•  ${m.moduleName}`))
        )
      : null,
    buildFooter()
  );
};

export const conclusionSection: SectionBuilder = (assessment, _content) =>
  h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Professional Conclusion'),
    h(Text, { style: styles.paragraph }, CONCLUSION_TEXT[assessment.healthRating]),
    h(Text, { style: styles.disclaimer }, DISCLAIMER_TEXT),
    buildBrandFooter(),
    buildFooter()
  );
