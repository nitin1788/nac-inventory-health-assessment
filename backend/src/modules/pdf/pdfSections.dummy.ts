import { createElement as h } from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import type { AssessmentDetail } from '../assessment/assessment.types';
import { moduleScoresSection, overallScoreSection, type SectionBuilder } from './pdfSections';
import { buildBrandFooter, buildBulletList, buildCoverPage, buildFooter, styles } from './pdfTemplates.shared';

/**
 * TEMPORARY — dummy, placeholder-only sections for the end-to-end
 * purchase/email/download flow validation. None of this is real
 * report content; every section is clearly labeled "(Dummy)" or a
 * generic placeholder. Reuses the exact same shared branding
 * (pdfTemplates.shared.ts) and, for Overall Score / Module Scores,
 * the exact same real-data section builders already used by the real
 * report (pdfSections.ts) — those two aren't "final report content,"
 * they're already-working assessment output, so keeping them real
 * proves the assessment → PDF data path still works end-to-end.
 *
 * Delete this file (and pdfSections.dummy.config.ts, and the
 * DUMMY_MODE flag in pdf.service.ts) once real Summary/Full content
 * replaces it — see pdfSections.ts / pdfSections.config.ts for the
 * real implementation this is standing in for.
 */

export { overallScoreSection, moduleScoresSection };

function buildDummyBanner(pageHeading: string, note: string) {
  return h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, pageHeading),
    h(
      Text,
      { style: styles.paragraph },
      'This page is a placeholder for end-to-end flow testing only. Real report content will replace this ' +
        'section before this report ships to customers.'
    ),
    h(Text, { style: styles.paragraph }, note),
    buildBrandFooter(),
    buildFooter()
  );
}

// ── Dummy Summary tier (₹99 — "NAC Report Summary") ────────────────

export const dummySummaryCoverPageSection: SectionBuilder = (assessment: AssessmentDetail) =>
  buildCoverPage(assessment, 'Report Summary — Dummy Version', 'NAC Report Summary');

export const dummyTop5FindingsSection: SectionBuilder = () =>
  h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Top 5 Findings'),
    buildBulletList([
      'Placeholder finding #1 (Dummy)',
      'Placeholder finding #2 (Dummy)',
      'Placeholder finding #3 (Dummy)',
      'Placeholder finding #4 (Dummy)',
      'Placeholder finding #5 (Dummy)',
    ]),
    buildFooter()
  );

export const dummyTop5RecommendationsSection: SectionBuilder = () =>
  h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Top 5 Recommendations'),
    buildBulletList([
      'Placeholder recommendation #1 (Dummy)',
      'Placeholder recommendation #2 (Dummy)',
      'Placeholder recommendation #3 (Dummy)',
      'Placeholder recommendation #4 (Dummy)',
      'Placeholder recommendation #5 (Dummy)',
    ]),
    buildFooter()
  );

export const dummySummaryClosingSection: SectionBuilder = () =>
  buildDummyBanner('Summary Report - Dummy Version', 'Report tier: Report Summary (₹99).');

// ── Dummy Full tier (₹299 — "NAC Professional Inventory Report") ───

export const dummyFullCoverPageSection: SectionBuilder = (assessment: AssessmentDetail) =>
  buildCoverPage(assessment, 'Professional Inventory Report — Dummy Version', 'NAC Professional Inventory Report');

export const dummyExecutiveSummarySection: SectionBuilder = () =>
  h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Executive Summary'),
    h(
      Text,
      { style: styles.paragraph },
      'Placeholder executive summary text (Dummy). This section will contain a real, data-driven executive ' +
        'summary once professional report content replaces this end-to-end test flow.'
    ),
    buildFooter()
  );

export const dummyRootCauseAnalysisSection: SectionBuilder = () =>
  h(
    Page,
    { size: 'A4', style: styles.page, wrap: true },
    h(Text, { style: styles.pageHeading }, 'Root Cause Analysis (Dummy)'),
    ...['Module A', 'Module B', 'Module C'].map((label) =>
      h(
        View,
        { key: label, style: { marginBottom: 10 } },
        h(Text, { style: styles.moduleTitle }, label),
        h(Text, { style: styles.paragraph }, 'Placeholder root cause narrative (Dummy).')
      )
    ),
    buildFooter()
  );

export const dummyPriorityMatrixSection: SectionBuilder = () =>
  h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Priority Matrix (Dummy)'),
    h(Text, { style: styles.matrixRow }, '•  Placeholder High Priority Item (Dummy)'),
    h(Text, { style: styles.matrixRow }, '•  Placeholder Medium Priority Item (Dummy)'),
    h(Text, { style: styles.matrixRow }, '•  Placeholder Low Priority Item (Dummy)'),
    buildFooter()
  );

export const dummyActionPlanSection: SectionBuilder = () =>
  h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, '30-60-90 Day Action Plan (Dummy)'),
    h(Text, { style: styles.subsectionTitle }, '30-Day Plan (Dummy)'),
    buildBulletList(['Placeholder 30-day action (Dummy)']),
    h(Text, { style: styles.subsectionTitle }, '60-Day Plan (Dummy)'),
    buildBulletList(['Placeholder 60-day action (Dummy)']),
    h(Text, { style: styles.subsectionTitle }, '90-Day Plan (Dummy)'),
    buildBulletList(['Placeholder 90-day action (Dummy)']),
    buildFooter()
  );

export const dummyProfessionalRecommendationsSection: SectionBuilder = () =>
  h(
    Page,
    { size: 'A4', style: styles.page },
    h(Text, { style: styles.pageHeading }, 'Professional Recommendations (Dummy)'),
    buildBulletList([
      'Placeholder professional recommendation #1 (Dummy)',
      'Placeholder professional recommendation #2 (Dummy)',
      'Placeholder professional recommendation #3 (Dummy)',
    ]),
    buildFooter()
  );

export const dummyFullClosingSection: SectionBuilder = () =>
  buildDummyBanner('Professional Report - Dummy Version', 'Report tier: Full Professional Inventory Report (₹299).');
