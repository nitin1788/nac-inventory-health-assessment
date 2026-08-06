import { createElement as h, type ReactElement } from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { COMPANY_NAME, CONSULTATION, CONTACT } from '../../config/constants';
import type { AssessmentDetail } from '../assessment/assessment.types';
import type { ModuleRecommendation } from '../recommendations/recommendationTypes';
import { rootCauseCategoryFor, type ReportContent, type RootCauseCategory } from './pdfReportContent';
import {
  buildBrandFooter,
  buildBulletList,
  buildCompanyDetailsGrid,
  buildCoverPage,
  buildFindingRow,
  buildFishboneDiagram,
  buildFooter,
  buildHeatMapGrid,
  buildHealthGauge,
  buildKpiCard,
  buildModuleBarChart,
  buildModuleScoresTable,
  buildPriorityMatrixGrid,
  buildProgressBarRow,
  buildScoreCard,
  buildTimeline,
  DISCLAIMER_TEXT,
  formatInr,
  PRIORITY_COLORS,
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
 *
 * Content boundary: this report is designed to diagnose problems and
 * build trust in NAC's expertise — never to hand over a complete,
 * self-serve implementation plan. No section here renders a full SOP,
 * a step-by-step execution plan, or every raw question answer; every
 * recommendation is a headline, and the report consistently points
 * toward a consultation for the detailed how-to.
 */
export type SectionBuilder = (assessment: AssessmentDetail, content: ReportContent) => ReactElement;

/** Priority-ordered modules used by both Business Impact Cards and Executive Recommendations. */
function pickPriorityModules(content: ReportContent, limit: number): ModuleRecommendation[] {
  const urgent = [...content.byPriority.High, ...content.byPriority.Medium];
  return (urgent.length >= 3 ? urgent : content.weakestFive).slice(0, limit);
}

function buildModuleScoresPage(pageHeading: string, intro?: string): SectionBuilder {
  return (assessment, _content) =>
    h(
      Page,
      { size: 'A4', style: styles.page, wrap: true },
      h(Text, { style: styles.pageHeading }, pageHeading),
      intro ? h(Text, { style: styles.paragraph }, intro) : null,
      buildModuleScoresTable(assessment.moduleScores),
      buildFooter()
    );
}

// ── Shared / Summary-tier sections ──────────────────────────────────

export const coverPageSection: SectionBuilder = (assessment, _content) =>
  buildCoverPage(assessment, 'Report Summary');

export const executiveSummarySection: SectionBuilder = (assessment, content) => {
  const { company } = assessment;
  const snapshot =
    `Prepared for ${company.contactPerson} (${company.designation}) — ${company.industry}, ` +
    `${company.employeeCount} employees, ${company.inventoryLocations} location(s), ` +
    `approximately ${company.activeSkus} active SKUs.`;

  return h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Executive Summary'),
    h(
      Text,
      { style: styles.paragraph },
      `${company.companyName} completed the NAC Inventory Health Assessment across ` +
        `${assessment.moduleScores.length} operational modules. This Report Summary presents the headline ` +
        `results; a complete, module-by-module analysis is available in the Professional Inventory Report.`
    ),
    h(Text, { style: styles.paragraph }, snapshot),
    h(Text, { style: styles.paragraph }, content.overallSummary),
    buildFooter()
  );
};

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

export const moduleScoresSection: SectionBuilder = buildModuleScoresPage('Module-wise Scores');

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
 * Shared by overallScoreSection — a single templated paragraph naming
 * the weakest module, derived entirely from already-computed content.
 */
function buildImprovementPriorityText(content: ReportContent): string {
  const top = content.weakestFive[0];
  return top
    ? `Your single highest-impact opportunity right now is ${top.moduleName}, currently rated ${top.rating} ` +
        `(${top.priority} priority). Addressing this first will have the greatest effect on your overall ` +
        `inventory health score.`
    : 'All assessed modules are currently performing well — the priority is sustaining current practices.';
}

// ── Full-tier-only sections ─────────────────────────────────────────

export const fullCoverPageSection: SectionBuilder = (assessment, _content) =>
  buildCoverPage(assessment, 'Professional Inventory Report');

export const executiveDashboardSection: SectionBuilder = (assessment, content) => {
  const { ratingCounts } = content;

  return h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Executive Summary'),
    h(Text, { style: styles.sectionTitle }, 'Company Details'),
    buildCompanyDetailsGrid(assessment),
    buildScoreCard(assessment, content.overallMaxScore),
    h(
      View,
      { style: styles.statRow },
      h(
        View,
        { style: styles.statBlock },
        h(Text, { style: styles.statValue }, String(assessment.moduleScores.length)),
        h(Text, { style: styles.statLabel }, 'Modules Assessed')
      ),
      h(
        View,
        { style: styles.statBlock },
        h(Text, { style: styles.statValue }, String(content.attentionCount)),
        h(Text, { style: styles.statLabel }, 'Need Attention')
      ),
      h(
        View,
        { style: styles.statBlock },
        h(Text, { style: styles.statValue }, String(ratingCounts.Excellent + ratingCounts.Good)),
        h(Text, { style: styles.statLabel }, 'Performing Well')
      ),
      h(
        View,
        { style: styles.statBlock },
        h(Text, { style: styles.statValue }, String(ratingCounts.Critical)),
        h(Text, { style: styles.statLabel }, 'Critical Areas')
      )
    ),
    h(Text, { style: styles.paragraph }, content.overallSummary),
    buildFooter()
  );
};

export const healthGaugeSection: SectionBuilder = (assessment, content) =>
  h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Business Health Score'),
    buildHealthGauge(assessment.overallPercentage, assessment.healthRating),
    h(Text, { style: styles.paragraph }, content.overallSummary),
    buildFooter()
  );

export const moduleChartsSection: SectionBuilder = (assessment, _content) =>
  h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Charts'),
    h(Text, { style: styles.paragraph }, 'Every module’s score, side by side.'),
    buildModuleBarChart(assessment.moduleScores),
    buildFooter()
  );

export const professionalTablesSection: SectionBuilder = buildModuleScoresPage(
  'Module-wise Analysis',
  'A complete, professional-grade breakdown of every assessed module, ranked and rated.'
);

export const priorityMatrixSection: SectionBuilder = (_assessment, content) =>
  h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Priority Matrix'),
    h(Text, { style: styles.paragraph }, 'Every module at a glance, grouped by business urgency.'),
    buildPriorityMatrixGrid(content.byPriority),
    buildFooter()
  );

export const heatMapSection: SectionBuilder = (assessment, _content) =>
  h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Heat Maps'),
    h(Text, { style: styles.paragraph }, 'Module performance shaded by severity — the hottest areas need attention first.'),
    buildHeatMapGrid(assessment.moduleScores),
    buildFooter()
  );

export const fishboneRootCauseSection: SectionBuilder = (_assessment, content) => {
  const grouped = new Map<RootCauseCategory, ModuleRecommendation[]>();
  for (const recommendation of content.moduleRecommendations) {
    if (recommendation.priority !== 'High' && recommendation.priority !== 'Medium') continue;
    const category = rootCauseCategoryFor(recommendation.moduleId);
    if (!grouped.has(category)) grouped.set(category, []);
    grouped.get(category)!.push(recommendation);
  }
  const categorized = [...grouped.entries()].map(([category, modules]) => ({ category, modules }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Root Cause Analysis'),
    h(
      Text,
      { style: styles.paragraph },
      'Where your weakest areas trace back to, grouped by underlying cause rather than symptom.'
    ),
    buildFishboneDiagram(categorized),
    buildFooter()
  );
};

/**
 * Where the business is currently most exposed — Critical-rated modules
 * framed as risk, not just a low score. Falls back to High-priority
 * modules if nothing is rated Critical, so the page is never empty for
 * an otherwise-healthy assessment.
 */
export const riskAnalysisSection: SectionBuilder = (_assessment, content) => {
  const criticalModules = content.moduleRecommendations.filter((m) => m.rating === 'Critical');
  const atRisk = criticalModules.length > 0 ? criticalModules : content.byPriority.High;

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Risk Analysis'),
    h(Text, { style: styles.paragraph }, 'Where the business is currently most exposed to operational risk.'),
    atRisk.length === 0
      ? h(Text, { style: styles.paragraph }, 'No modules are currently rated Critical — operational risk exposure is low.')
      : h(
          View,
          null,
          ...atRisk.map((m) =>
            h(
              View,
              { key: m.moduleId, style: { marginBottom: 12 }, wrap: false },
              h(Text, { style: styles.moduleTitle }, m.moduleName),
              h(Text, { style: styles.paragraph }, m.summary)
            )
          )
        ),
    buildFooter()
  );
};

export const timelineSection: SectionBuilder = (_assessment, content) =>
  h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Timeline'),
    h(
      Text,
      { style: styles.paragraph },
      'A high-level view of when to focus on each area. A detailed, sequenced execution plan is built together ' +
        'during a consultation.'
    ),
    buildTimeline(content.byPriority),
    buildFooter()
  );

export const progressBarsSection: SectionBuilder = (assessment, _content) =>
  h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Graphs'),
    h(Text, { style: styles.paragraph }, 'Current performance against an 80% healthy-operations benchmark.'),
    buildProgressBarRow(assessment.moduleScores),
    buildFooter()
  );

/** Phased view of when to act on each module — day-range panels, module names only, never a step-by-step plan. */
export const roadmapSection: SectionBuilder = (_assessment, content) => {
  const phases: { label: string; modules: ModuleRecommendation[]; colors: { bg: string; text: string } }[] = [
    { label: '0–30 Days', modules: content.byPriority.High, colors: PRIORITY_COLORS.High },
    { label: '31–60 Days', modules: content.byPriority.Medium, colors: PRIORITY_COLORS.Medium },
    { label: '61–90 Days', modules: [...content.byPriority.Low, ...content.byPriority.Maintain], colors: PRIORITY_COLORS.Low },
  ];

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, '30-60-90 Day Roadmap'),
    h(
      Text,
      { style: styles.paragraph },
      'A phased view of when to focus on each area. A detailed, sequenced execution plan is built together during ' +
        'a consultation.'
    ),
    h(
      View,
      { style: styles.priorityGrid },
      ...phases.map((phase) =>
        h(
          View,
          { key: phase.label, style: [styles.priorityPanel, { borderColor: phase.colors.text }] },
          h(Text, { style: [styles.priorityPanelHeader, { color: phase.colors.text }] }, phase.label),
          phase.modules.length === 0
            ? h(Text, { style: styles.emptyPanelText }, 'No modules in this phase.')
            : h(
                View,
                { style: styles.chipRow },
                ...phase.modules.map((m) =>
                  h(
                    Text,
                    { key: m.moduleId, style: [styles.chip, { backgroundColor: phase.colors.bg, color: phase.colors.text }] },
                    m.moduleName
                  )
                )
              )
        )
      )
    ),
    buildFooter()
  );
};

export const businessImpactCardsSection: SectionBuilder = (_assessment, content) => {
  const modules = pickPriorityModules(content, 6);

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Business Impact'),
    h(Text, { style: styles.paragraph }, 'What improving each priority area is expected to mean for the business.'),
    h(
      View,
      { style: styles.kpiGrid },
      ...modules.map((m) =>
        buildKpiCard(`${m.priority} priority`, m.moduleName, m.expectedBenefits[0], RATING_COLORS[m.rating].text)
      )
    ),
    buildFooter()
  );
};

export const executiveRecommendationsSection: SectionBuilder = (_assessment, content) => {
  const modules = pickPriorityModules(content, 6);

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Professional Recommendations'),
    h(
      Text,
      { style: styles.paragraph },
      'Strategic priorities for leadership. For a complete, sequenced implementation plan tailored to your ' +
        'operation, our consulting team can build one with you.'
    ),
    buildBulletList(modules.map((m) => `${m.moduleName}: ${m.recommendations[0]}`)),
    buildFooter()
  );
};

export const consultationCtaSection: SectionBuilder = (_assessment, _content) =>
  h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Ready to Act on These Findings?'),
    h(
      Text,
      { style: styles.paragraph },
      'This report identifies where your inventory operation stands and why. Turning these findings into a ' +
        'concrete, sequenced action plan is exactly what a consultation with Nitin Anand Consulting delivers.'
    ),
    h(Text, { style: styles.sectionTitle }, CONSULTATION.serviceName),
    h(Text, { style: styles.paragraph }, CONSULTATION.description),
    buildBulletList([
      `Duration: ${CONSULTATION.duration}`,
      `Format: ${CONSULTATION.mode}`,
      `Fee: ${formatInr(CONSULTATION.fee)}`,
    ]),
    h(
      Text,
      { style: styles.paragraph },
      `To book, contact ${COMPANY_NAME} at ${CONTACT.email} or ${CONTACT.phone}.`
    ),
    buildBrandFooter(),
    h(Text, { style: styles.disclaimer }, DISCLAIMER_TEXT),
    buildFooter()
  );
