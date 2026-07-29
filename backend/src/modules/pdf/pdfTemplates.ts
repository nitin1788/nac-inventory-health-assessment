import { createElement as h } from 'react';
import { Document, Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { COMPANY_NAME, CONSULTATION, CONTACT, SERVICES_LIST } from '../../config/constants';
import { buildConsultationWhatsAppUrl } from '../../utils/whatsapp';
import { NAC_LOGO_FULL_DATA_URI } from '../../assets/nacLogo';
import type { AssessmentDetail, HealthRating, ModuleScoreInput } from '../assessment/assessment.types';
import { generateRecommendations } from '../recommendations/recommendationEngine';
import type { ModuleRecommendation, PriorityLevel } from '../recommendations/recommendationTypes';

/**
 * Built with React.createElement rather than JSX — this file is a
 * plain `.ts` module (the backend has no JSX/TSX build step), and
 * @react-pdf/renderer's components render to PDF primitives rather
 * than DOM, so there's no markup to preview anyway. Styling mirrors
 * frontend/src/features/assessment/pdf/pdfTemplates.ts (same brand
 * palette) so the server-generated report looks consistent with the
 * product's visual identity, adapted here to render from data already
 * persisted in Supabase rather than live in-browser state.
 */

const RATING_COLORS: Record<HealthRating, { bg: string; text: string }> = {
  Excellent: { bg: '#ECFDF5', text: '#047857' },
  Good: { bg: '#F0FDFA', text: '#0F766E' },
  'Needs Improvement': { bg: '#FFFBEB', text: '#B45309' },
  Critical: { bg: '#FEF2F2', text: '#B91C1C' },
};

const PRIORITY_COLORS: Record<PriorityLevel, { bg: string; text: string }> = {
  High: { bg: '#FEF2F2', text: '#B91C1C' },
  Medium: { bg: '#FFFBEB', text: '#B45309' },
  Low: { bg: '#F0FDFA', text: '#0F766E' },
  Maintain: { bg: '#ECFDF5', text: '#047857' },
};

const PRIORITY_ORDER: PriorityLevel[] = ['High', 'Medium', 'Low', 'Maintain'];

const PRIORITY_GROUP_LABELS: Record<PriorityLevel, string> = {
  High: 'High Priority — Act Immediately',
  Medium: 'Medium Priority — Plan Next',
  Low: 'Low Priority — Monitor',
  Maintain: 'Maintain — Sustain Current Practices',
};

const DISCLAIMER_TEXT =
  'Disclaimer: This report is generated based on self-reported responses to the NAC Inventory Health ' +
  'Assessment and is intended for general informational purposes only. It does not constitute professional ' +
  'consulting advice and should not be relied upon as a substitute for a detailed operational audit. For a ' +
  'comprehensive, tailored assessment, please contact Nitin Anand Consulting directly. This document is ' +
  'confidential and intended solely for the named recipient.';

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1E293B',
  },
  coverPage: {
    paddingTop: 130,
    paddingHorizontal: 48,
    fontFamily: 'Helvetica',
    color: '#0F2A52',
  },
  coverLogo: {
    width: 220,
    alignSelf: 'center',
  },
  coverDivider: {
    marginTop: 32,
    marginBottom: 24,
    height: 3,
    width: 80,
    backgroundColor: '#C89B3C',
    alignSelf: 'center',
  },
  coverTitle: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    color: '#0F2A52',
  },
  coverSubtitle: {
    marginTop: 12,
    fontSize: 13,
    textAlign: 'center',
    color: '#3B5A80',
  },
  coverMeta: {
    marginTop: 40,
    fontSize: 10,
    textAlign: 'center',
    color: '#64748B',
    lineHeight: 1.6,
  },
  coverAssessmentNumber: {
    marginTop: 20,
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    color: '#0F2A52',
  },
  coverContact: {
    position: 'absolute',
    bottom: 48,
    left: 48,
    right: 48,
    textAlign: 'center',
    fontSize: 9,
    color: '#94A3B8',
    lineHeight: 1.6,
  },
  pageHeading: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#0F2A52',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#0F2A52',
    marginTop: 16,
    marginBottom: 10,
  },
  subsectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0F2A52',
    marginTop: 14,
    marginBottom: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 8,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 10,
    color: '#0F172A',
    marginTop: 2,
    fontFamily: 'Helvetica-Bold',
  },
  scoreCard: {
    marginTop: 4,
    marginBottom: 12,
    padding: 16,
    borderRadius: 6,
    backgroundColor: '#EEF3F8',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: '#0F2A52',
  },
  scoreCaption: {
    fontSize: 9,
    color: '#3B5A80',
    marginTop: 2,
  },
  ratingBadge: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#334155',
    marginBottom: 8,
  },
  table: {
    marginTop: 4,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    paddingBottom: 4,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#64748B',
  },
  tableCell: {
    fontSize: 9,
    color: '#1E293B',
  },
  colModule: { width: '40%' },
  colScore: { width: '20%', textAlign: 'right' },
  colMax: { width: '20%', textAlign: 'right' },
  colPct: { width: '20%', textAlign: 'right' },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 4,
    borderRadius: 4,
  },
  listRowLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  listRowValue: {
    fontSize: 9,
  },
  moduleBlock: {
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  moduleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginLeft: 6,
  },
  bulletList: {
    marginTop: 4,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bulletDot: {
    width: 10,
    fontSize: 9,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 8,
    color: '#94A3B8',
  },
  brandFooter: {
    marginTop: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
  },
  brandFooterName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0F2A52',
  },
  brandFooterLine: {
    marginTop: 3,
    fontSize: 8,
    color: '#64748B',
    textAlign: 'center',
  },
  priorityGroup: {
    marginBottom: 16,
  },
  disclaimer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 4,
    fontSize: 8,
    color: '#64748B',
    lineHeight: 1.5,
  },
  consultationBox: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#EEF3F8',
    borderRadius: 6,
  },
  consultationTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#0F2A52',
    marginBottom: 6,
  },
  consultationText: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#334155',
    marginBottom: 6,
  },
  consultationButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: '#0F2A52',
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    textDecoration: 'none',
  },
});

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function buildFooter() {
  return h(
    View,
    { style: styles.footer, fixed: true },
    h(Text, { style: styles.footerText }, `${COMPANY_NAME} — Inventory Health Assessment Report`),
    h(Text, {
      style: styles.footerText,
      fixed: true,
      render: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
        `Page ${pageNumber} of ${totalPages}`,
    })
  );
}

/** Full NAC branding block — services list, contact, confidentiality — placed at the end of the report. */
function buildBrandFooter() {
  return h(
    View,
    { style: styles.brandFooter },
    h(Text, { style: styles.brandFooterName }, COMPANY_NAME),
    h(Text, { style: styles.brandFooterLine }, SERVICES_LIST),
    h(Text, { style: styles.brandFooterLine }, `${CONTACT.email}  ·  ${CONTACT.phone}`)
  );
}

function buildInfoItem(label: string, value: string) {
  return h(
    View,
    { key: label, style: styles.infoItem },
    h(Text, { style: styles.infoLabel }, label),
    h(Text, { style: styles.infoValue }, value)
  );
}

function buildBulletList(items: string[]) {
  return h(
    View,
    { style: styles.bulletList },
    ...items.map((item) =>
      h(
        View,
        { key: item, style: styles.bulletRow },
        h(Text, { style: styles.bulletDot }, '•'),
        h(Text, { style: styles.bulletText }, item)
      )
    )
  );
}

function buildFindingRow(moduleScore: ModuleScoreInput, colors: { bg: string; text: string }) {
  return h(
    View,
    { key: moduleScore.moduleId, style: [styles.listRow, { backgroundColor: colors.bg }] },
    h(Text, { style: [styles.listRowLabel, { color: colors.text }] }, moduleScore.moduleName),
    h(Text, { style: [styles.listRowValue, { color: colors.text }] }, `${moduleScore.percentage}% (${moduleScore.rating})`)
  );
}

function buildCoverPage(assessment: AssessmentDetail) {
  return h(
    Page,
    { size: 'A4', style: styles.coverPage },
    h(Image, { src: NAC_LOGO_FULL_DATA_URI, style: styles.coverLogo }),
    h(View, { style: styles.coverDivider }),
    h(Text, { style: styles.coverTitle }, 'Inventory Health Assessment Report'),
    h(Text, { style: styles.coverSubtitle }, `Prepared for ${assessment.company.companyName}`),
    h(Text, { style: styles.coverAssessmentNumber }, `Assessment No. ${assessment.assessmentNumber}`),
    h(
      Text,
      { style: styles.coverMeta },
      `Contact: ${assessment.company.contactPerson} (${assessment.company.designation})\n` +
        `Generated on ${formatDate(assessment.createdAt)}`
    ),
    h(
      Text,
      { style: styles.coverContact },
      `${COMPANY_NAME}  ·  ${CONTACT.email}  ·  ${CONTACT.phone}\n${SERVICES_LIST}`
    )
  );
}

function buildSummaryPage(assessment: AssessmentDetail, overallSummary: string, overallMaxScore: number) {
  const ratingColors = RATING_COLORS[assessment.healthRating];
  const { company } = assessment;

  return h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Assessment Summary'),

    h(Text, { style: styles.sectionTitle }, 'Company Details'),
    h(
      View,
      { style: styles.infoGrid },
      buildInfoItem('Company Name', company.companyName),
      buildInfoItem('Contact Person', `${company.contactPerson} (${company.designation})`),
      buildInfoItem('Industry', company.industry),
      buildInfoItem('Business Type', company.businessType),
      buildInfoItem('Number of Employees', company.employeeCount),
      buildInfoItem('Inventory Locations', company.inventoryLocations),
      buildInfoItem('Approximate Active SKUs', company.activeSkus),
      buildInfoItem('Contact Email', company.email)
    ),

    h(Text, { style: styles.sectionTitle }, 'Overall Score & Health Rating'),
    h(
      View,
      { style: styles.scoreCard },
      h(Text, { style: styles.scoreValue }, `${assessment.overallScore} / ${overallMaxScore}`),
      h(Text, { style: styles.scoreCaption }, `${assessment.overallPercentage}% overall`),
      h(
        Text,
        { style: [styles.ratingBadge, { backgroundColor: ratingColors.bg, color: ratingColors.text }] },
        assessment.healthRating
      )
    ),
    h(Text, { style: styles.paragraph }, overallSummary),

    buildFooter()
  );
}

function buildModuleScoresPage(assessment: AssessmentDetail) {
  const { moduleScores } = assessment;

  // "Top Findings" — modules that most need attention. Anything below
  // the "Good" band, weakest first; if every module is Good/Excellent,
  // still surface the single lowest-scoring module so the section
  // always has content.
  const belowGood = [...moduleScores]
    .filter((m) => m.rating === 'Critical' || m.rating === 'Needs Improvement')
    .sort((a, b) => a.percentage - b.percentage);
  const topFindings =
    belowGood.length > 0
      ? belowGood
      : [...moduleScores].sort((a, b) => a.percentage - b.percentage).slice(0, 1);

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Module-Wise Scores'),

    h(
      View,
      { style: styles.table },
      h(
        View,
        { style: styles.tableHeaderRow },
        h(Text, { style: [styles.tableHeaderCell, styles.colModule] }, 'Module'),
        h(Text, { style: [styles.tableHeaderCell, styles.colScore] }, 'Score'),
        h(Text, { style: [styles.tableHeaderCell, styles.colMax] }, 'Max'),
        h(Text, { style: [styles.tableHeaderCell, styles.colPct] }, 'Percentage')
      ),
      ...moduleScores.map((moduleScore) =>
        h(
          View,
          { key: moduleScore.moduleId, style: styles.tableRow },
          h(Text, { style: [styles.tableCell, styles.colModule] }, moduleScore.moduleName),
          h(Text, { style: [styles.tableCell, styles.colScore] }, String(moduleScore.score)),
          h(Text, { style: [styles.tableCell, styles.colMax] }, String(moduleScore.maxScore)),
          h(Text, { style: [styles.tableCell, styles.colPct] }, `${moduleScore.percentage}%`)
        )
      )
    ),

    h(Text, { style: styles.sectionTitle }, 'Top Findings'),
    h(
      Text,
      { style: styles.paragraph },
      'The modules below need the most attention, ranked by how far they fall from a healthy score.'
    ),
    ...topFindings.map((m) => buildFindingRow(m, RATING_COLORS[m.rating])),

    buildFooter()
  );
}

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
    h(Text, { style: styles.paragraph }, recommendation.summary),
    h(Text, { style: styles.subsectionTitle }, 'Recommended Actions'),
    buildBulletList(recommendation.recommendations),
    h(Text, { style: styles.subsectionTitle }, 'Expected Business Benefits'),
    buildBulletList(recommendation.expectedBenefits)
  );
}

function buildPriorityGroup(priority: PriorityLevel, recommendations: ModuleRecommendation[]) {
  if (recommendations.length === 0) return null;
  const colors = PRIORITY_COLORS[priority];

  return h(
    View,
    { key: priority, style: styles.priorityGroup, wrap: false },
    h(Text, { style: [styles.subsectionTitle, { color: colors.text }] }, PRIORITY_GROUP_LABELS[priority]),
    ...recommendations.map((recommendation) =>
      h(
        View,
        { key: recommendation.moduleId, style: { marginBottom: 8 } },
        h(Text, { style: styles.moduleTitle }, recommendation.moduleName),
        buildBulletList(recommendation.recommendations)
      )
    )
  );
}

function buildRecommendationsPage(moduleRecommendations: ModuleRecommendation[]) {
  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Recommendations'),
    h(Text, { style: styles.paragraph }, 'Ordered by priority — highest-priority modules appear first.'),
    ...moduleRecommendations.map(buildModuleRecommendationBlock),
    buildFooter()
  );
}

function buildConsultationSection(assessmentNumber: string) {
  return h(
    View,
    { style: styles.consultationBox },
    h(Text, { style: styles.consultationTitle }, 'Need Expert Guidance?'),
    h(
      Text,
      { style: styles.consultationText },
      `Book a ${CONSULTATION.duration} ${CONSULTATION.serviceName} to review your assessment report and receive practical recommendations for improving your inventory and store / warehouse operations.`
    ),
    h(
      Text,
      { style: styles.consultationText },
      `Duration: ${CONSULTATION.duration}   ·   Mode: ${CONSULTATION.mode}   ·   Consultation Fee: ${CONSULTATION.fee}`
    ),
    h(
      Link,
      { href: buildConsultationWhatsAppUrl(assessmentNumber), style: styles.consultationButton },
      CONSULTATION.ctaLabel
    )
  );
}

function buildPriorityActionPlanPage(assessment: AssessmentDetail, moduleRecommendations: ModuleRecommendation[]) {
  const grouped = PRIORITY_ORDER.map((priority) => ({
    priority,
    recommendations: moduleRecommendations.filter((r) => r.priority === priority),
  }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Priority Action Plan'),
    h(
      Text,
      { style: styles.paragraph },
      'A consolidated action plan across all modules, grouped by business urgency.'
    ),
    ...grouped.map(({ priority, recommendations }) => buildPriorityGroup(priority, recommendations)),
    h(Text, { style: styles.disclaimer }, DISCLAIMER_TEXT),
    buildConsultationSection(assessment.assessmentNumber),
    buildBrandFooter(),
    buildFooter()
  );
}

/**
 * Assembles the complete, print-ready A4 Document for one assessment
 * already persisted in Supabase. Recommendations are derived here
 * (rule-based, from the stored module ratings) rather than recomputed
 * scoring — this module never touches the scoring engine.
 */
export function buildReportDocument(assessment: AssessmentDetail) {
  const overallMaxScore = assessment.moduleScores.reduce((sum, m) => sum + m.maxScore, 0);
  const { overallSummary, moduleRecommendations } = generateRecommendations(
    assessment.moduleScores,
    assessment.healthRating
  );

  return h(
    Document,
    {
      title: `${assessment.company.companyName} — Inventory Health Assessment Report`,
      author: COMPANY_NAME,
    },
    buildCoverPage(assessment),
    buildSummaryPage(assessment, overallSummary, overallMaxScore),
    buildModuleScoresPage(assessment),
    buildRecommendationsPage(moduleRecommendations),
    buildPriorityActionPlanPage(assessment, moduleRecommendations)
  );
}
