import { createElement as h, type ReactElement } from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { CONSULTATION } from '../../config/constants';
import type { AssessmentDetail } from '../assessment/assessment.types';
import { businessProfileRows, rootCauseCategoryFor, type RootCauseCategory } from '../pdf/pdfReportContent';
import {
  buildAnalysisTable,
  buildBulletList,
  buildCalloutBox,
  buildFishboneDiagram,
  buildScoreCard,
  formatDate,
  formatInr,
  PRIORITY_COLORS,
  PRIORITY_ORDER,
  RATING_COLORS,
  styles,
  type AnalysisTableColumn,
} from '../pdf/pdfTemplates.shared';
import type { ModuleRecommendation } from '../recommendations/recommendationTypes';
import type { InternalReportContent, ProblemEntry } from './internalReport.types';
import { buildInternalCoverPage, buildInternalFooter } from './internalReportTemplates';

/**
 * Section builders for the NAC-internal consulting report. Same
 * one-function-per-section shape as pdfSections.ts, but this file has
 * no bearing on — and is never wired into — the customer-facing report
 * or its download route. Nothing here is exposed to the customer.
 */
export type InternalSectionBuilder = (assessment: AssessmentDetail, content: InternalReportContent) => ReactElement;

function ratingBadgeColors(value: string) {
  return RATING_COLORS[value as keyof typeof RATING_COLORS];
}

function priorityBadgeColors(value: string) {
  return PRIORITY_COLORS[value as keyof typeof PRIORITY_COLORS];
}

// ── Cover ────────────────────────────────────────────────────────────

export function buildInternalCoverSection(reportLabel: string): InternalSectionBuilder {
  return (assessment) =>
    buildInternalCoverPage(assessment.company.companyName, assessment.assessmentNumber, reportLabel);
}

// ── Customer Profile ────────────────────────────────────────────────

export const customerProfileSection: InternalSectionBuilder = (assessment, content) => {
  const { company } = assessment;
  const contactColumns: AnalysisTableColumn[] = [
    { key: 'field', header: 'Field', width: '30%', strong: true },
    { key: 'value', header: 'Value', width: '70%' },
  ];
  const contactRows = [
    { field: 'Company Name', value: company.companyName },
    { field: 'Contact Person', value: `${company.contactPerson} (${company.designation})` },
    { field: 'Mobile', value: company.mobile },
    { field: 'Email', value: company.email },
    { field: 'Assessment Date', value: formatDate(assessment.createdAt) },
  ];

  const profileRows = businessProfileRows(assessment);
  const profileColumns: AnalysisTableColumn[] = [
    { key: 'parameter', header: 'Parameter', width: '26%', strong: true },
    { key: 'result', header: 'Assessment Result', width: '30%' },
    { key: 'interpretation', header: 'Interpretation', width: '44%' },
  ];

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Customer Profile'),
    h(
      Text,
      { style: styles.paragraph },
      'Contact details and business context for consultation scheduling and preparation.'
    ),
    buildAnalysisTable(contactColumns, contactRows),
    profileRows.length > 0
      ? h(
          View,
          { style: { marginTop: 10 } },
          h(Text, { style: styles.subsectionTitle }, 'Business & Inventory Context'),
          buildAnalysisTable(
            profileColumns,
            profileRows.map((r) => ({ parameter: r.parameter, result: r.result, interpretation: r.interpretation }))
          )
        )
      : null,
    content.reportContent.biggestChallenge
      ? buildCalloutBox(
          'Customer-Reported Biggest Challenge',
          content.reportContent.biggestChallenge,
          'warning'
        )
      : null,
    buildInternalFooter()
  );
};

// ── Overall Health ──────────────────────────────────────────────────

export const overallHealthSection: InternalSectionBuilder = (assessment, content) => {
  const { reportContent } = content;
  const total = reportContent.moduleRecommendations.length;

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Overall Health'),
    buildScoreCard(assessment, reportContent.overallMaxScore),
    h(Text, { style: styles.paragraph }, reportContent.overallSummary),
    h(
      Text,
      { style: styles.paragraph },
      `${reportContent.ratingCounts.Critical} of ${total} modules are rated Critical, ` +
        `${reportContent.ratingCounts['Needs Improvement']} Needs Improvement, ${reportContent.ratingCounts.Good} ` +
        `Good, and ${reportContent.ratingCounts.Excellent} Excellent. ${reportContent.attentionCount} of ${total} ` +
        `modules currently sit in the High or Medium priority band — these are the modules to prioritize in the ` +
        `consultation.`
    ),
    buildInternalFooter()
  );
};

// ── Problem Register (descriptive blocks — every field per problem) ──

function buildLabeledBlockLine(label: string, text: string) {
  return h(
    Text,
    { style: styles.tightParagraph },
    h(Text, { style: styles.labelSpan }, `${label}: `),
    text
  );
}

function buildProblemBlock(entry: ProblemEntry) {
  const ratingColors = RATING_COLORS[entry.rating];
  const priorityColors = PRIORITY_COLORS[entry.priority];

  return h(
    View,
    { key: entry.moduleId, style: { marginBottom: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' } },
    h(
      View,
      { style: styles.moduleHeaderRow },
      h(Text, { style: styles.moduleTitle }, entry.moduleName),
      h(
        View,
        { style: styles.badgeRow },
        h(
          Text,
          { style: [styles.ratingBadgeCell, { backgroundColor: ratingColors.bg, color: ratingColors.text }] },
          `${entry.percentage}% · ${entry.rating}`
        ),
        h(
          Text,
          {
            style: [
              styles.ratingBadgeCell,
              { backgroundColor: priorityColors.bg, color: priorityColors.text, marginLeft: 6 },
            ],
          },
          `${entry.priority} priority`
        )
      )
    ),
    buildLabeledBlockLine('Problem identified', entry.problemIdentified),
    buildLabeledBlockLine('Evidence / signal', entry.evidence),
    buildLabeledBlockLine('Business impact', entry.businessImpact),
    buildLabeledBlockLine('Likely root cause', entry.likelyRootCause),
    buildLabeledBlockLine('Recommended solution', entry.recommendedSolution),
    buildLabeledBlockLine('Suggested next action', entry.suggestedAction),
    buildLabeledBlockLine('Potential NAC service', entry.nacServiceOpportunity),
    h(Text, { style: [styles.tightParagraph, styles.labelSpan, { marginTop: 4 }] }, 'Questions to ask the customer:'),
    buildBulletList(entry.consultantQuestions)
  );
}

function buildProblemRegisterSection(useTopOnly: boolean): InternalSectionBuilder {
  return (_assessment, content) => {
    const entries = useTopOnly ? content.topProblems : content.problemRegister;

    return h(
      Page,
      { size: 'A4', style: styles.page, wrap: true },
      h(Text, { style: styles.pageHeading }, 'Problem Register'),
      h(
        Text,
        { style: styles.paragraph },
        useTopOnly
          ? 'The 5 highest-priority findings from this assessment, with the evidence, likely cause, and questions ' +
              'to raise during the consultation.'
          : 'Every assessed module, weakest first, with the evidence, likely cause, recommended solution, and ' +
              'questions to raise during the consultation.'
      ),
      ...entries.map(buildProblemBlock),
      buildInternalFooter()
    );
  };
}

export const problemRegisterBriefSection = buildProblemRegisterSection(true);
export const problemRegisterFullSection = buildProblemRegisterSection(false);

// ── Business Impact Analysis (Dossier only) ────────────────────────

export const businessImpactAnalysisSection: InternalSectionBuilder = (_assessment, content) => {
  const columns: AnalysisTableColumn[] = [
    { key: 'module', header: 'Module', width: '20%', strong: true },
    { key: 'rating', header: 'Rating', width: '14%', badge: ratingBadgeColors },
    { key: 'impact', header: 'Business Impact', width: '46%' },
    { key: 'priority', header: 'Priority', width: '20%', badge: priorityBadgeColors },
  ];
  const rows = content.problemRegister.map((e) => ({
    module: e.moduleName,
    rating: e.rating,
    impact: e.businessImpact,
    priority: e.priority,
  }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Business Impact Analysis'),
    h(Text, { style: styles.paragraph }, 'What each finding actually costs or risks for the business.'),
    buildAnalysisTable(columns, rows),
    buildInternalFooter()
  );
};

// ── Root Cause Analysis (Dossier only) ─────────────────────────────

export const rootCauseAnalysisSection: InternalSectionBuilder = (_assessment, content) => {
  const columns: AnalysisTableColumn[] = [
    { key: 'module', header: 'Module', width: '20%', strong: true },
    { key: 'cause', header: 'Likely Root Cause', width: '38%' },
    { key: 'evidence', header: 'Evidence / Signal', width: '42%' },
  ];
  const rows = content.problemRegister.map((e) => ({
    module: e.moduleName,
    cause: e.likelyRootCause,
    evidence: e.evidence,
  }));

  const grouped = new Map<RootCauseCategory, ModuleRecommendation[]>();
  for (const m of content.reportContent.moduleRecommendations) {
    if (m.priority !== 'High' && m.priority !== 'Medium') continue;
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
      'Hypotheses to validate live with the customer, not confirmed findings — this assessment is self-reported.'
    ),
    buildAnalysisTable(columns, rows),
    categorized.length > 0
      ? h(
          View,
          { style: { marginTop: 8 } },
          h(Text, { style: styles.subsectionTitle }, 'Root-Cause Clustering'),
          buildFishboneDiagram(categorized)
        )
      : null,
    buildInternalFooter()
  );
};

// ── Priority Matrix (Dossier only) ─────────────────────────────────

export const internalPriorityMatrixSection: InternalSectionBuilder = (_assessment, content) => {
  const columns: AnalysisTableColumn[] = [
    { key: 'priority', header: 'Priority', width: '14%', badge: priorityBadgeColors },
    { key: 'module', header: 'Module', width: '20%', strong: true },
    { key: 'impact', header: 'Business Impact', width: '38%' },
    { key: 'action', header: 'Suggested Action', width: '28%' },
  ];
  const sorted = [...content.problemRegister].sort((a, b) => {
    const delta = PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority);
    return delta !== 0 ? delta : a.percentage - b.percentage;
  });
  const rows = sorted.map((e) => ({
    priority: e.priority,
    module: e.moduleName,
    impact: e.businessImpact,
    action: e.suggestedAction,
  }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Priority Matrix'),
    h(Text, { style: styles.paragraph }, 'Every module, sorted by business urgency — use this to sequence the consultation.'),
    buildAnalysisTable(columns, rows),
    buildInternalFooter()
  );
};

// ── Detailed Recommendations (Dossier only) ────────────────────────

export const internalDetailedRecommendationsSection: InternalSectionBuilder = (_assessment, content) => {
  const columns: AnalysisTableColumn[] = [
    { key: 'module', header: 'Module', width: '18%', strong: true },
    { key: 'solution', header: 'Recommended Solution', width: '42%' },
    { key: 'benefit', header: 'Expected Benefit', width: '28%' },
    { key: 'priority', header: 'Priority', width: '12%', badge: priorityBadgeColors },
  ];
  const rows = content.reportContent.moduleRecommendations.map((m) => ({
    module: m.moduleName,
    solution: m.recommendations.join(' '),
    benefit: m.expectedBenefits.join(' '),
    priority: m.priority,
  }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Detailed Recommendations'),
    h(Text, { style: styles.paragraph }, 'The full solution and expected benefit for every assessed area.'),
    buildAnalysisTable(columns, rows),
    buildInternalFooter()
  );
};

// ── Consultant Discussion Guide (Dossier only) ─────────────────────

export const consultantDiscussionGuideSection: InternalSectionBuilder = (_assessment, content) =>
  h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Consultant Discussion Guide'),
    h(
      Text,
      { style: styles.paragraph },
      'Questions grouped by module, ordered weakest-first — use this as a live call script.'
    ),
    ...content.problemRegister.map((entry) =>
      h(
        View,
        { key: entry.moduleId, style: { marginBottom: 10 }, wrap: false },
        h(Text, { style: styles.subsectionTitle }, `${entry.moduleName} (${entry.percentage}% · ${entry.rating})`),
        buildBulletList(entry.consultantQuestions)
      )
    ),
    buildInternalFooter()
  );

// ── 30/60/90 Day Plan (Dossier only, internal — a real execution plan
// is appropriate here since the audience is NAC itself, not the customer) ──

export const actionPlanSection: InternalSectionBuilder = (_assessment, content) => {
  const columns: AnalysisTableColumn[] = [
    { key: 'phase', header: 'Phase', width: '14%', strong: true },
    { key: 'module', header: 'Module', width: '22%' },
    { key: 'action', header: 'Suggested Action', width: '36%' },
    { key: 'service', header: 'Potential NAC Service', width: '28%' },
  ];
  const phases: { phase: string; entries: ProblemEntry[] }[] = [
    { phase: '0–30 Days', entries: content.problemRegister.filter((e) => e.priority === 'High') },
    { phase: '31–60 Days', entries: content.problemRegister.filter((e) => e.priority === 'Medium') },
    {
      phase: '61–90 Days',
      entries: content.problemRegister.filter((e) => e.priority === 'Low' || e.priority === 'Maintain'),
    },
  ];
  const rows = phases.flatMap((p) =>
    p.entries.map((e) => ({ phase: p.phase, module: e.moduleName, action: e.suggestedAction, service: e.nacServiceOpportunity }))
  );

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, '30/60/90 Day Plan'),
    h(
      Text,
      { style: styles.paragraph },
      'A phased internal working plan for NAC to sequence follow-up with this customer — not shown to the customer.'
    ),
    rows.length > 0
      ? buildAnalysisTable(columns, rows)
      : h(Text, { style: styles.paragraph }, 'No modules currently require phased follow-up.'),
    buildInternalFooter()
  );
};

// ── NAC Service Opportunity (both tiers) ───────────────────────────

export const nacServiceOpportunitySection: InternalSectionBuilder = (_assessment, content) => {
  const columns: AnalysisTableColumn[] = [
    { key: 'module', header: 'Module', width: '24%', strong: true },
    { key: 'priority', header: 'Priority', width: '16%', badge: priorityBadgeColors },
    { key: 'service', header: 'Potential NAC Service', width: '60%' },
  ];
  const rows = content.problemRegister.map((e) => ({
    module: e.moduleName,
    priority: e.priority,
    service: e.nacServiceOpportunity,
  }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'NAC Service Opportunity'),
    buildCalloutBox(
      'These are potential opportunities, not a purchase or entitlement',
      `Each row maps a finding to one of NAC's existing services based on the assessment result — it does not ` +
        `mean the customer has purchased, requested, or agreed to that service. The only service actually engaged ` +
        `at this stage is the ${CONSULTATION.serviceName} (${formatInr(CONSULTATION.fee)}), if booked.`,
      'info'
    ),
    buildAnalysisTable(columns, rows),
    buildInternalFooter()
  );
};
