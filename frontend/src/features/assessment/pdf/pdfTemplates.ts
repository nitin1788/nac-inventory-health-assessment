import { createElement as h } from 'react';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { COMPANY_NAME, CONTACT } from '@/config/constants';
import nacLogoFull from '@/assets/images/nac-logo-full.png';
import type { ModuleRecommendation, PriorityLevel } from '../recommendations/recommendationTypes';
import type { HealthRating, ModuleScore } from '../scoring/scoreTypes';
import type { PdfReportData } from './pdfTypes';

/**
 * Built with React.createElement rather than JSX — this file is a
 * plain `.ts` module (Vite only enables the JSX transform for
 * `.tsx`), and @react-pdf/renderer's components render to PDF
 * primitives rather than DOM, so there's no markup to preview anyway.
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
    marginTop: 60,
    fontSize: 10,
    textAlign: 'center',
    color: '#64748B',
    lineHeight: 1.6,
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
});

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
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

function buildListRow(moduleScore: ModuleScore, colors: { bg: string; text: string }) {
  return h(
    View,
    { key: moduleScore.moduleId, style: [styles.listRow, { backgroundColor: colors.bg }] },
    h(Text, { style: [styles.listRowLabel, { color: colors.text }] }, moduleScore.moduleTitle),
    h(Text, { style: [styles.listRowValue, { color: colors.text }] }, `${moduleScore.percentage}%`)
  );
}

function buildCoverPage(data: PdfReportData) {
  const { companyInfo, generatedAt } = data;

  return h(
    Page,
    { size: 'A4', style: styles.coverPage },
    h(Image, { src: nacLogoFull, style: styles.coverLogo }),
    h(View, { style: styles.coverDivider }),
    h(Text, { style: styles.coverTitle }, 'Inventory Health Assessment Report'),
    h(Text, { style: styles.coverSubtitle }, `Prepared for ${companyInfo.companyName}`),
    h(
      Text,
      { style: styles.coverMeta },
      `Contact: ${companyInfo.contactPerson} (${companyInfo.designation})\nGenerated on ${formatDate(generatedAt)}`
    ),
    h(
      Text,
      { style: styles.coverContact },
      `${COMPANY_NAME}  ·  ${CONTACT.email}  ·  ${CONTACT.phone}\n` +
        'Inventory Audit · Warehouse Audit · Inventory Optimization · SOP Development · Business Process Improvement'
    )
  );
}

function buildSummaryPage(data: PdfReportData) {
  const { companyInfo, scoringResult, recommendationResult } = data;
  const ratingColors = RATING_COLORS[scoringResult.overallRating];
  const businessType =
    companyInfo.businessType === 'Other' ? companyInfo.businessTypeOther || 'Other' : companyInfo.businessType;

  return h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Assessment Summary'),

    h(Text, { style: styles.sectionTitle }, 'Company Information'),
    h(
      View,
      { style: styles.infoGrid },
      buildInfoItem('Company Name', companyInfo.companyName),
      buildInfoItem('Contact Person', `${companyInfo.contactPerson} (${companyInfo.designation})`),
      buildInfoItem('Industry', companyInfo.industry),
      buildInfoItem('Business Type', businessType),
      buildInfoItem('Number of Employees', companyInfo.numberOfEmployees),
      buildInfoItem('Inventory Locations', companyInfo.numberOfInventoryLocations),
      buildInfoItem('Approximate Active SKUs', companyInfo.approximateActiveSkus),
      buildInfoItem('Contact Email', companyInfo.email)
    ),

    h(Text, { style: styles.sectionTitle }, 'Overall Result'),
    h(
      View,
      { style: styles.scoreCard },
      h(Text, { style: styles.scoreValue }, `${scoringResult.overallScore} / ${scoringResult.overallMaxScore}`),
      h(Text, { style: styles.scoreCaption }, `${scoringResult.overallPercentage}% overall`),
      h(
        Text,
        { style: [styles.ratingBadge, { backgroundColor: ratingColors.bg, color: ratingColors.text }] },
        scoringResult.overallRating
      )
    ),
    h(Text, { style: styles.paragraph }, recommendationResult.overallSummary),

    buildFooter()
  );
}

function buildModuleScoresPage(data: PdfReportData) {
  const { scoringResult } = data;

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
      ...scoringResult.moduleScores.map((moduleScore) =>
        h(
          View,
          { key: moduleScore.moduleId, style: styles.tableRow },
          h(Text, { style: [styles.tableCell, styles.colModule] }, moduleScore.moduleTitle),
          h(Text, { style: [styles.tableCell, styles.colScore] }, String(moduleScore.score)),
          h(Text, { style: [styles.tableCell, styles.colMax] }, String(moduleScore.maxScore)),
          h(Text, { style: [styles.tableCell, styles.colPct] }, `${moduleScore.percentage}%`)
        )
      )
    ),

    h(Text, { style: styles.subsectionTitle }, 'Strongest Modules'),
    scoringResult.strengthModules.length > 0
      ? h(View, null, ...scoringResult.strengthModules.map((m) => buildListRow(m, RATING_COLORS.Good)))
      : h(Text, { style: styles.paragraph }, 'No modules reached the "Good" threshold yet.'),

    h(Text, { style: styles.subsectionTitle }, 'Weakest Modules'),
    scoringResult.weakModules.length > 0
      ? h(View, null, ...scoringResult.weakModules.map((m) => buildListRow(m, RATING_COLORS.Critical)))
      : h(Text, { style: styles.paragraph }, 'No modules fell below the "Needs Improvement" threshold — great job.'),

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
      h(Text, { style: styles.moduleTitle }, recommendation.moduleTitle),
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

function buildRecommendationsPage(data: PdfReportData) {
  const { recommendationResult } = data;

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Recommendations'),
    h(Text, { style: styles.paragraph }, 'Ordered by priority — highest-priority modules appear first.'),
    ...recommendationResult.moduleRecommendations.map(buildModuleRecommendationBlock),
    buildFooter()
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
        h(Text, { style: styles.moduleTitle }, recommendation.moduleTitle),
        buildBulletList(recommendation.recommendations)
      )
    )
  );
}

function buildPriorityActionPlanPage(data: PdfReportData) {
  const { recommendationResult } = data;
  const grouped = PRIORITY_ORDER.map((priority) => ({
    priority,
    recommendations: recommendationResult.moduleRecommendations.filter(
      (recommendation) => recommendation.priority === priority
    ),
  }));

  return h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Priority Action Plan'),
    h(Text, { style: styles.paragraph }, 'A consolidated action plan across all modules, grouped by business urgency.'),
    ...grouped.map(({ priority, recommendations }) => buildPriorityGroup(priority, recommendations)),
    h(Text, { style: styles.disclaimer }, DISCLAIMER_TEXT),
    buildFooter()
  );
}

/** Assembles the complete, print-ready Document from already-computed scoring and recommendation data. */
export function buildReportDocument(data: PdfReportData) {
  return h(
    Document,
    { title: `${data.companyInfo.companyName} — Inventory Health Assessment Report`, author: COMPANY_NAME },
    buildCoverPage(data),
    buildSummaryPage(data),
    buildModuleScoresPage(data),
    buildRecommendationsPage(data),
    buildPriorityActionPlanPage(data)
  );
}
