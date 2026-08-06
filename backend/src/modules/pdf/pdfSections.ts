import { createElement as h, type ReactElement } from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { COMPANY_NAME, CONSULTATION, CONTACT } from '../../config/constants';
import { TIER_PRICING } from '../payment/payment.types';
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
  buildModuleIconGrid,
  buildModuleScoresTable,
  buildPriorityMatrixGrid,
  buildProgressBarRow,
  buildScoreCard,
  buildTimeline,
  DISCLAIMER_TEXT,
  formatInr,
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

export const upgradeCtaSection: SectionBuilder = (_assessment, _content) => {
  const fullPrice = formatInr(TIER_PRICING.full / 100);

  return h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Get the Complete Picture'),
    h(
      Text,
      { style: styles.paragraph },
      'This Report Summary gives you the headline picture of your inventory health. The Professional ' +
        'Inventory Report goes much further — a full 15-page, consulting-grade analysis, including:'
    ),
    buildBulletList([
      'Root-cause analysis — why each weak area scored the way it did, grouped by underlying cause',
      'A visual priority matrix and risk heat map across every module',
      'Business impact translation — what improvement is worth in operational terms',
      'Executive-level strategic recommendations and a phased improvement roadmap',
    ]),
    h(
      Text,
      { style: styles.paragraph },
      `Professional Inventory Report — ${fullPrice}. Available as an upgrade from your results page.`
    ),
    h(
      Text,
      { style: styles.paragraph },
      `Questions about this report? Contact ${COMPANY_NAME} at ${CONTACT.email} or ${CONTACT.phone}.`
    ),
    buildBrandFooter(),
    h(Text, { style: styles.disclaimer }, DISCLAIMER_TEXT),
    buildFooter()
  );
};

// ── Full-tier-only sections ─────────────────────────────────────────

export const fullCoverPageSection: SectionBuilder = (assessment, _content) =>
  buildCoverPage(assessment, 'Professional Inventory Report');

export const executiveDashboardSection: SectionBuilder = (assessment, content) => {
  const { ratingCounts } = content;

  return h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Executive Dashboard'),
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

export const kpiCardsSection: SectionBuilder = (assessment, content) =>
  h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Key Performance Indicators'),
    h(Text, { style: styles.paragraph }, 'The core numbers behind this assessment, at a glance.'),
    h(
      View,
      { style: styles.kpiGrid },
      buildKpiCard('Overall Health Score', `${assessment.overallPercentage}%`, assessment.healthRating),
      buildKpiCard('Modules Assessed', String(assessment.moduleScores.length)),
      buildKpiCard('Need Attention', String(content.attentionCount), 'High + Medium priority modules'),
      buildKpiCard(
        'Strongest Area',
        content.strongestModule?.moduleName ?? '—',
        content.strongestModule ? `${content.strongestModule.percentage}%` : undefined
      ),
      buildKpiCard(
        'Priority Area',
        content.weakestModule?.moduleName ?? '—',
        content.weakestModule ? `${content.weakestModule.percentage}%` : undefined
      ),
      buildKpiCard(
        'Performing Well',
        String(content.ratingCounts.Excellent + content.ratingCounts.Good),
        'Modules rated Good or Excellent'
      )
    ),
    buildFooter()
  );

export const healthGaugeSection: SectionBuilder = (assessment, content) =>
  h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Overall Health Gauge'),
    buildHealthGauge(assessment.overallPercentage, assessment.healthRating),
    h(Text, { style: styles.paragraph }, content.overallSummary),
    buildFooter()
  );

export const moduleChartsSection: SectionBuilder = (assessment, _content) =>
  h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Module Performance Chart'),
    h(Text, { style: styles.paragraph }, 'Every module’s score, side by side.'),
    buildModuleBarChart(assessment.moduleScores),
    buildFooter()
  );

export const professionalTablesSection: SectionBuilder = buildModuleScoresPage(
  'Professional Tables',
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
    h(Text, { style: styles.pageHeading }, 'Risk Heat Map'),
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

export const timelineSection: SectionBuilder = (_assessment, content) =>
  h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Improvement Roadmap'),
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
    h(Text, { style: styles.pageHeading }, 'Progress Toward Benchmark'),
    h(Text, { style: styles.paragraph }, 'Current performance against an 80% healthy-operations benchmark.'),
    buildProgressBarRow(assessment.moduleScores),
    buildFooter()
  );

export const svgInfographicsSection: SectionBuilder = (assessment, _content) =>
  h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Module Health at a Glance'),
    h(Text, { style: styles.paragraph }, 'Every module’s rating, in one view.'),
    buildModuleIconGrid(assessment.moduleScores),
    buildFooter()
  );

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
    h(Text, { style: styles.pageHeading }, 'Executive Recommendations'),
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
