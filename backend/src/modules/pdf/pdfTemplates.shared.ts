import { createElement as h } from 'react';
import { Circle, Image, Line, Page, Path, Polygon, StyleSheet, Svg, Text, View } from '@react-pdf/renderer';
import { COMPANY_NAME, CONTACT, SERVICES_LIST } from '../../config/constants';
import { NAC_LOGO_FULL_DATA_URI } from '../../assets/nacLogo';
import type { AssessmentDetail, HealthRating, ModuleScoreInput } from '../assessment/assessment.types';
import type { ModuleRecommendation, PriorityLevel } from '../recommendations/recommendationTypes';
import type { RootCauseCategory } from './pdfReportContent';

/**
 * Every visual primitive both report tiers are built from — styles,
 * color systems, the cover page, footers, and small reusable renderers
 * (score card, module-scores table, finding row, bullet list). Neither
 * tier has its own copy of any of this, which is what makes the two
 * PDFs' shared branding (logo, color palette, typography, header,
 * footer) structural rather than a style guideline to keep in sync by
 * hand. Built with React.createElement rather than JSX — this file is
 * a plain `.ts` module (the backend has no JSX/TSX build step), and
 * @react-pdf/renderer's components render to PDF primitives rather
 * than DOM, so there's no markup to preview anyway.
 */

export const RATING_COLORS: Record<HealthRating, { bg: string; text: string }> = {
  Excellent: { bg: '#ECFDF5', text: '#047857' },
  Good: { bg: '#F0FDFA', text: '#0F766E' },
  'Needs Improvement': { bg: '#FFFBEB', text: '#B45309' },
  Critical: { bg: '#FEF2F2', text: '#B91C1C' },
};

export const PRIORITY_COLORS: Record<PriorityLevel, { bg: string; text: string }> = {
  High: { bg: '#FEF2F2', text: '#B91C1C' },
  Medium: { bg: '#FFFBEB', text: '#B45309' },
  Low: { bg: '#F0FDFA', text: '#0F766E' },
  Maintain: { bg: '#ECFDF5', text: '#047857' },
};

export const PRIORITY_ORDER: PriorityLevel[] = ['High', 'Medium', 'Low', 'Maintain'];

export const PRIORITY_GROUP_LABELS: Record<PriorityLevel, string> = {
  High: 'High Priority — Act Immediately',
  Medium: 'Medium Priority — Plan Next',
  Low: 'Low Priority — Monitor',
  Maintain: 'Maintain — Sustain Current Practices',
};

/** More saturated than RATING_COLORS — used only by the Heat Map, where cells need to read as "hot/cold" at a glance. */
export const HEATMAP_COLORS: Record<HealthRating, { bg: string; text: string }> = {
  Excellent: { bg: '#059669', text: '#FFFFFF' },
  Good: { bg: '#65A30D', text: '#FFFFFF' },
  'Needs Improvement': { bg: '#D97706', text: '#FFFFFF' },
  Critical: { bg: '#DC2626', text: '#FFFFFF' },
};

/** Fixed palette for the Fishbone diagram's root-cause categories — distinct from rating/priority colors on purpose. */
export const CATEGORY_COLORS: Record<RootCauseCategory, string> = {
  People: '#B45309',
  Process: '#0F766E',
  Systems: '#1D4ED8',
  'Data & Visibility': '#7C3AED',
  Governance: '#B91C1C',
};

export const DISCLAIMER_TEXT =
  'Disclaimer: This report is generated based on self-reported responses to the NAC Inventory Health ' +
  'Assessment and is intended for general informational purposes only. It does not constitute professional ' +
  'consulting advice and should not be relied upon as a substitute for a detailed operational audit. For a ' +
  'comprehensive, tailored assessment, please contact Nitin Anand Consulting directly. This document is ' +
  'confidential and intended solely for the named recipient.';

export const styles = StyleSheet.create({
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
  coverReportLabel: {
    marginTop: 16,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    color: '#C89B3C',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  colModule: { width: '28%' },
  colScore: { width: '15%', textAlign: 'right' },
  colMax: { width: '15%', textAlign: 'right' },
  colPct: { width: '20%', textAlign: 'right', paddingRight: 10 },
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
  matrixRow: {
    fontSize: 9,
    color: '#334155',
    marginBottom: 3,
  },
  questionRow: {
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  questionText: {
    fontSize: 9,
    color: '#1E293B',
    lineHeight: 1.4,
  },
  questionAnswer: {
    marginTop: 2,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0F2A52',
  },
  colRating: { width: '22%', alignItems: 'flex-end', textAlign: 'right' },
  ratingBadgeCell: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 4,
  },
  statBlock: {
    width: '25%',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#0F2A52',
  },
  statLabel: {
    fontSize: 8,
    color: '#64748B',
    marginTop: 2,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  kpiCard: {
    width: '31%',
    marginRight: '2%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  kpiValue: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#0F2A52',
  },
  kpiLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#3B5A80',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  kpiCaption: {
    fontSize: 8,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 1.4,
  },
  gaugeWrap: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  gaugeValue: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    marginTop: -46,
  },
  gaugeCaption: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  barChart: {
    marginTop: 8,
  },
  barRow: {
    marginBottom: 12,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  barLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
  },
  barPct: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  barTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EEF2F6',
    position: 'relative',
  },
  barFill: {
    height: 10,
    borderRadius: 5,
  },
  progressMarker: {
    position: 'absolute',
    top: -2,
    bottom: -2,
    width: 2,
    backgroundColor: '#475569',
  },
  progressLegend: {
    fontSize: 8,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 4,
  },
  heatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  heatCell: {
    width: '48%',
    marginRight: '2%',
    marginBottom: 10,
    padding: 12,
    borderRadius: 6,
    justifyContent: 'center',
  },
  heatCellName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  heatCellPct: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginTop: 4,
  },
  heatCellRating: {
    fontSize: 8,
    marginTop: 2,
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  priorityPanel: {
    width: '48%',
    marginRight: '2%',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 90,
  },
  priorityPanelHeader: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  emptyPanelText: {
    fontSize: 8,
    color: '#94A3B8',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  iconBadgeItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBadgeCircleWrap: {
    width: 56,
    height: 56,
    position: 'relative',
  },
  iconBadgeInitials: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    paddingTop: 19,
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
  },
  iconBadgeName: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
    textAlign: 'center',
    marginTop: 6,
  },
  iconBadgePct: {
    fontSize: 8,
    color: '#64748B',
    marginTop: 1,
  },
  timelineColumns: {
    flexDirection: 'row',
    marginTop: 12,
  },
  timelineColumn: {
    flex: 1,
    paddingHorizontal: 6,
  },
  timelineColumnHeading: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0F2A52',
    marginBottom: 6,
    textAlign: 'center',
  },
  timelineModule: {
    fontSize: 8,
    color: '#334155',
    textAlign: 'center',
    marginBottom: 3,
  },
  fishboneLegendRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  fishboneLegendSwatch: {
    width: 9,
    height: 9,
    borderRadius: 2,
    marginTop: 2,
    marginRight: 8,
  },
  fishboneLegendCategory: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0F172A',
  },
  fishboneLegendModules: {
    fontSize: 9,
    color: '#334155',
    marginTop: 1,
  },
});

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

/**
 * @react-pdf/renderer's Helvetica is the standard PDF base-14 font, which
 * only covers WinAnsi/Latin-1 — it has no ₹ (U+20B9) glyph, so the
 * character renders as a broken box/apostrophe. Every rupee amount shown
 * in a PDF must go through this, whether it starts as a number (price in
 * paise) or a string already containing "₹" (e.g. the shared CONSULTATION
 * constant, which frontend renders fine since browsers aren't limited to
 * base-14 fonts).
 */
export function formatInr(amount: string | number): string {
  if (typeof amount === 'number') return `Rs. ${amount}`;
  return amount.replace(/₹\s*/g, 'Rs. ');
}

/** Page-number footer, fixed on every page. */
export function buildFooter() {
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

/** Full NAC branding block — services list, contact, confidentiality — placed at the end of a report. */
export function buildBrandFooter() {
  return h(
    View,
    { style: styles.brandFooter },
    h(Text, { style: styles.brandFooterName }, COMPANY_NAME),
    h(Text, { style: styles.brandFooterLine }, SERVICES_LIST),
    h(Text, { style: styles.brandFooterLine }, `${CONTACT.email}  ·  ${CONTACT.phone}`)
  );
}

export function buildInfoItem(label: string, value: string) {
  return h(
    View,
    { key: label, style: styles.infoItem },
    h(Text, { style: styles.infoLabel }, label),
    h(Text, { style: styles.infoValue }, value)
  );
}

export function buildBulletList(items: string[]) {
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

export function buildFindingRow(moduleScore: ModuleScoreInput, colors: { bg: string; text: string }) {
  return h(
    View,
    { key: moduleScore.moduleId, style: [styles.listRow, { backgroundColor: colors.bg }] },
    h(Text, { style: [styles.listRowLabel, { color: colors.text }] }, moduleScore.moduleName),
    h(Text, { style: [styles.listRowValue, { color: colors.text }] }, `${moduleScore.percentage}% (${moduleScore.rating})`)
  );
}

/**
 * The branded cover page — same logo, divider, layout, and typography
 * for every tier. `title` defaults to the real report's heading so
 * most callers can omit it; only the per-tier report label differs.
 */
export function buildCoverPage(
  assessment: AssessmentDetail,
  reportLabel: string,
  title = 'Inventory Health Assessment Report'
) {
  return h(
    Page,
    { size: 'A4', style: styles.coverPage },
    h(Image, { src: NAC_LOGO_FULL_DATA_URI, style: styles.coverLogo }),
    h(View, { style: styles.coverDivider }),
    h(Text, { style: styles.coverTitle }, title),
    h(Text, { style: styles.coverReportLabel }, reportLabel),
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

/** The Overall Score / Health Rating card — shared by both tiers. */
export function buildScoreCard(assessment: AssessmentDetail, overallMaxScore: number) {
  const ratingColors = RATING_COLORS[assessment.healthRating];
  return h(
    View,
    { style: styles.scoreCard },
    h(Text, { style: styles.scoreValue }, `${assessment.overallScore} / ${overallMaxScore}`),
    h(Text, { style: styles.scoreCaption }, `${assessment.overallPercentage}% overall`),
    h(
      Text,
      { style: [styles.ratingBadge, { backgroundColor: ratingColors.bg, color: ratingColors.text }] },
      assessment.healthRating
    )
  );
}

/** The full module-wise score table — every module, shared by both tiers. */
export function buildModuleScoresTable(moduleScores: ModuleScoreInput[]) {
  return h(
    View,
    { style: styles.table },
    h(
      View,
      { style: styles.tableHeaderRow },
      h(Text, { style: [styles.tableHeaderCell, styles.colModule] }, 'Module'),
      h(Text, { style: [styles.tableHeaderCell, styles.colScore] }, 'Score'),
      h(Text, { style: [styles.tableHeaderCell, styles.colMax] }, 'Max'),
      h(Text, { style: [styles.tableHeaderCell, styles.colPct] }, 'Percentage'),
      h(Text, { style: [styles.tableHeaderCell, styles.colRating] }, 'Rating')
    ),
    ...moduleScores.map((moduleScore) => {
      const ratingColors = RATING_COLORS[moduleScore.rating];
      return h(
        View,
        { key: moduleScore.moduleId, style: styles.tableRow },
        h(Text, { style: [styles.tableCell, styles.colModule] }, moduleScore.moduleName),
        h(Text, { style: [styles.tableCell, styles.colScore] }, String(moduleScore.score)),
        h(Text, { style: [styles.tableCell, styles.colMax] }, String(moduleScore.maxScore)),
        h(Text, { style: [styles.tableCell, styles.colPct] }, `${moduleScore.percentage}%`),
        h(
          View,
          { style: styles.colRating },
          h(
            Text,
            { style: [styles.ratingBadgeCell, { backgroundColor: ratingColors.bg, color: ratingColors.text }] },
            moduleScore.rating
          )
        )
      );
    })
  );
}

// ── Full-tier visual primitives ─────────────────────────────────────
// Every function below draws from data already computed in
// pdfReportContent.ts — none of them recompute a score, rating, or
// priority. @react-pdf/renderer's Svg primitives (Path/Circle/Line/
// Polygon) are used directly rather than a charting library, matching
// how the rest of this module already avoids external dependencies.

/** A single stat tile — used for both the KPI Cards page and Business Impact Cards. */
export function buildKpiCard(label: string, value: string, caption?: string, valueColor = '#0F2A52') {
  return h(
    View,
    { key: label, style: styles.kpiCard },
    h(Text, { style: [styles.kpiValue, { color: valueColor }] }, value),
    h(Text, { style: styles.kpiLabel }, label),
    caption ? h(Text, { style: styles.kpiCaption }, caption) : null
  );
}

function polarToCartesian(cx: number, cy: number, r: number, t: number) {
  const angle = Math.PI - t * Math.PI;
  return { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) };
}

/** `d` attribute for a semicircle arc from t=0 (left) to t=endT (0..1 across the dome). */
function describeSemicircleArc(cx: number, cy: number, r: number, endT: number) {
  const clampedT = Math.min(Math.max(endT, 0.001), 0.999);
  const start = polarToCartesian(cx, cy, r, 0);
  const end = polarToCartesian(cx, cy, r, clampedT);
  const largeArcFlag = clampedT > 0.5 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

/** Semicircle health gauge — the overall percentage as a filled arc, colour-banded by rating. */
export function buildHealthGauge(percentage: number, rating: HealthRating) {
  const cx = 130;
  const cy = 90;
  const r = 80;
  const ratingColors = RATING_COLORS[rating];
  const strokeColor = ratingColors.text;

  return h(
    View,
    { style: styles.gaugeWrap },
    h(
      Svg,
      { width: 260, height: 100, viewBox: '0 0 260 100' },
      h(Path, {
        d: describeSemicircleArc(cx, cy, r, 1),
        stroke: '#E2E8F0',
        strokeWidth: 16,
        fill: 'none',
        strokeLinecap: 'round',
      }),
      h(Path, {
        d: describeSemicircleArc(cx, cy, r, percentage / 100),
        stroke: strokeColor,
        strokeWidth: 16,
        fill: 'none',
        strokeLinecap: 'round',
      })
    ),
    h(Text, { style: [styles.gaugeValue, { color: strokeColor }] }, `${percentage}%`),
    h(
      Text,
      { style: [styles.ratingBadge, { backgroundColor: ratingColors.bg, color: ratingColors.text, marginTop: 8 }] },
      rating
    )
  );
}

/** Horizontal bar chart — every module's percentage, colour-coded by rating. */
export function buildModuleBarChart(moduleScores: ModuleScoreInput[]) {
  return h(
    View,
    { style: styles.barChart },
    ...moduleScores.map((moduleScore) => {
      const ratingColors = RATING_COLORS[moduleScore.rating];
      return h(
        View,
        { key: moduleScore.moduleId, style: styles.barRow },
        h(
          View,
          { style: styles.barLabelRow },
          h(Text, { style: styles.barLabel }, moduleScore.moduleName),
          h(Text, { style: [styles.barPct, { color: ratingColors.text }] }, `${moduleScore.percentage}%`)
        ),
        h(
          View,
          { style: styles.barTrack },
          h(View, { style: [styles.barFill, { width: `${moduleScore.percentage}%`, backgroundColor: ratingColors.text }] })
        )
      );
    })
  );
}

/** Same horizontal-bar visual language as buildModuleBarChart, plus a benchmark marker at 80%. */
export function buildProgressBarRow(moduleScores: ModuleScoreInput[]) {
  return h(
    View,
    { style: styles.barChart },
    h(Text, { style: styles.progressLegend }, 'Filled bar = current score.  Grey marker = 80% benchmark level.'),
    ...moduleScores.map((moduleScore) => {
      const ratingColors = RATING_COLORS[moduleScore.rating];
      return h(
        View,
        { key: moduleScore.moduleId, style: styles.barRow },
        h(
          View,
          { style: styles.barLabelRow },
          h(Text, { style: styles.barLabel }, moduleScore.moduleName),
          h(Text, { style: [styles.barPct, { color: ratingColors.text }] }, `${moduleScore.percentage}%`)
        ),
        h(
          View,
          { style: styles.barTrack },
          h(View, { style: [styles.barFill, { width: `${moduleScore.percentage}%`, backgroundColor: ratingColors.text }] }),
          h(View, { style: [styles.progressMarker, { left: '80%' }] })
        )
      );
    })
  );
}

/** Colour-graded grid — one cell per module, shaded by rating severity. */
export function buildHeatMapGrid(moduleScores: ModuleScoreInput[]) {
  return h(
    View,
    { style: styles.heatGrid },
    ...moduleScores.map((moduleScore) => {
      const colors = HEATMAP_COLORS[moduleScore.rating];
      return h(
        View,
        { key: moduleScore.moduleId, style: [styles.heatCell, { backgroundColor: colors.bg }] },
        h(Text, { style: [styles.heatCellName, { color: colors.text }] }, moduleScore.moduleName),
        h(Text, { style: [styles.heatCellPct, { color: colors.text }] }, `${moduleScore.percentage}%`),
        h(Text, { style: [styles.heatCellRating, { color: colors.text }] }, moduleScore.rating)
      );
    })
  );
}

/** 2x2 visual grid of priority panels with module-name chips — a card-based upgrade of a plain bullet list. */
export function buildPriorityMatrixGrid(byPriority: Record<PriorityLevel, ModuleRecommendation[]>) {
  return h(
    View,
    { style: styles.priorityGrid },
    ...PRIORITY_ORDER.map((priority) => {
      const modules = byPriority[priority];
      const colors = PRIORITY_COLORS[priority];
      return h(
        View,
        { key: priority, style: [styles.priorityPanel, { borderColor: colors.text }] },
        h(Text, { style: [styles.priorityPanelHeader, { color: colors.text }] }, PRIORITY_GROUP_LABELS[priority]),
        modules.length === 0
          ? h(Text, { style: styles.emptyPanelText }, 'No modules in this band.')
          : h(
              View,
              { style: styles.chipRow },
              ...modules.map((m) =>
                h(
                  Text,
                  { key: m.moduleId, style: [styles.chip, { backgroundColor: colors.bg, color: colors.text }] },
                  m.moduleName
                )
              )
            )
      );
    })
  );
}

function initialsFor(moduleName: string): string {
  const initials = moduleName
    .split(/[\s/-]+/)
    .filter(Boolean)
    .map((word) => word[0]!.toUpperCase())
    .join('');
  return initials.slice(0, 3) || moduleName.slice(0, 2).toUpperCase();
}

/** SVG icon-badge grid — one ring badge per module, the report's "infographic" page. */
export function buildModuleIconGrid(moduleScores: ModuleScoreInput[]) {
  return h(
    View,
    { style: styles.iconGrid },
    ...moduleScores.map((moduleScore) => {
      const ratingColors = RATING_COLORS[moduleScore.rating];
      return h(
        View,
        { key: moduleScore.moduleId, style: styles.iconBadgeItem },
        h(
          View,
          { style: styles.iconBadgeCircleWrap },
          h(
            Svg,
            { width: 56, height: 56, viewBox: '0 0 56 56' },
            h(Circle, { cx: 28, cy: 28, r: 24, fill: ratingColors.bg, stroke: ratingColors.text, strokeWidth: 3 })
          ),
          h(Text, { style: [styles.iconBadgeInitials, { color: ratingColors.text }] }, initialsFor(moduleScore.moduleName))
        ),
        h(Text, { style: styles.iconBadgeName }, moduleScore.moduleName),
        h(Text, { style: styles.iconBadgePct }, `${moduleScore.percentage}% · ${moduleScore.rating}`)
      );
    })
  );
}

/** 3-column high-level roadmap — which modules fall into each horizon, never a step-by-step task list. */
export function buildTimeline(byPriority: Record<PriorityLevel, ModuleRecommendation[]>) {
  const columns: { heading: string; modules: ModuleRecommendation[] }[] = [
    { heading: 'Immediate Focus', modules: byPriority.High },
    { heading: 'Near-Term', modules: [...byPriority.Medium, ...byPriority.Low] },
    { heading: 'Ongoing', modules: byPriority.Maintain },
  ];

  const spineY = 20;
  const nodeXs: [number, number, number] = [45, 130, 215];

  return h(
    View,
    null,
    h(
      View,
      { style: { position: 'relative', width: 260, height: 40 } },
      h(
        Svg,
        { width: 260, height: 40, viewBox: '0 0 260 40' },
        h(Line, { x1: nodeXs[0], y1: spineY, x2: nodeXs[2], y2: spineY, stroke: '#CBD5E1', strokeWidth: 2 }),
        ...nodeXs.map((x) => h(Circle, { key: x, cx: x, cy: spineY, r: 9, fill: '#0F2A52' }))
      ),
      ...nodeXs.map((x, i) =>
        h(
          Text,
          {
            key: `n${x}`,
            style: {
              position: 'absolute',
              top: spineY - 5,
              left: x - 6,
              width: 12,
              textAlign: 'center',
              fontSize: 9,
              color: '#FFFFFF',
            },
          },
          String(i + 1)
        )
      )
    ),
    h(
      View,
      { style: styles.timelineColumns },
      ...columns.map((col) =>
        h(
          View,
          { key: col.heading, style: styles.timelineColumn },
          h(Text, { style: styles.timelineColumnHeading }, col.heading),
          col.modules.length === 0
            ? h(Text, { style: [styles.timelineModule, { color: '#94A3B8' }] }, '—')
            : col.modules.map((m) => h(Text, { key: m.moduleId, style: styles.timelineModule }, m.moduleName))
        )
      )
    )
  );
}

/** Fishbone (Ishikawa) root-cause diagram: SVG spine/bones as the visual, a legend below names categories → modules. */
export function buildFishboneDiagram(
  categorized: { category: RootCauseCategory; modules: ModuleRecommendation[] }[]
) {
  if (categorized.length === 0) {
    return h(
      Text,
      { style: styles.paragraph },
      'No significant root-cause clusters were identified — current gaps, if any, are minor and isolated rather ' +
        'than systemic.'
    );
  }

  const svgWidth = 515;
  const svgHeight = 170;
  const spineY = 85;
  const spineStartX = 20;
  const spineEndX = svgWidth - 30;
  const boneCount = categorized.length;
  const step = (spineEndX - spineStartX - 60) / Math.max(boneCount, 1);

  const bones = categorized.map((entry, i) => {
    const attachX = spineStartX + 40 + step * i;
    const above = i % 2 === 0;
    const tipX = attachX - 45;
    const tipY = above ? spineY - 55 : spineY + 55;
    const color = CATEGORY_COLORS[entry.category];
    return { attachX, tipX, tipY, color, key: entry.category };
  });

  return h(
    View,
    null,
    h(
      Svg,
      { width: svgWidth, height: svgHeight, viewBox: `0 0 ${svgWidth} ${svgHeight}` },
      h(Line, { x1: spineStartX, y1: spineY, x2: spineEndX, y2: spineY, stroke: '#0F2A52', strokeWidth: 3 }),
      h(Polygon, {
        points: `${spineEndX},${spineY - 8} ${spineEndX + 14},${spineY} ${spineEndX},${spineY + 8}`,
        fill: '#0F2A52',
      }),
      ...bones.map((bone) =>
        h(Line, {
          key: bone.key,
          x1: bone.attachX,
          y1: spineY,
          x2: bone.tipX,
          y2: bone.tipY,
          stroke: bone.color,
          strokeWidth: 2.5,
        })
      ),
      ...bones.map((bone) => h(Circle, { key: `c${bone.key}`, cx: bone.tipX, cy: bone.tipY, r: 5, fill: bone.color }))
    ),
    ...categorized.map((entry) =>
      h(
        View,
        { key: entry.category, style: styles.fishboneLegendRow },
        h(View, { style: [styles.fishboneLegendSwatch, { backgroundColor: CATEGORY_COLORS[entry.category] }] }),
        h(
          View,
          null,
          h(Text, { style: styles.fishboneLegendCategory }, entry.category),
          h(Text, { style: styles.fishboneLegendModules }, entry.modules.map((m) => m.moduleName).join(', '))
        )
      )
    )
  );
}

/** The Company Details grid — used by the Full tier's Executive/Summary content. */
export function buildCompanyDetailsGrid(assessment: AssessmentDetail) {
  const { company } = assessment;
  return h(
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
  );
}
