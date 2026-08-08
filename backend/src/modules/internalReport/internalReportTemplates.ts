import { createElement as h } from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { COMPANY_NAME } from '../../config/constants';
import { styles } from '../pdf/pdfTemplates.shared';

/**
 * The internal report's own small set of visual primitives — deliberately
 * NOT the customer report's buildCoverPage()/buildFooter() (see
 * pdfTemplates.shared.ts), even though it imports that file's generic
 * `styles` for typography consistency. Reusing the exact customer cover/
 * footer here would risk this document being mistaken for (or
 * accidentally reused as) something customer-facing; a distinct,
 * clearly-labeled internal cover and footer make that mistake much
 * harder to make by accident.
 */

export const INTERNAL_BANNER_TEXT = 'INTERNAL — NAC CONSULTING USE ONLY — NOT FOR CUSTOMER DISTRIBUTION';

export function buildInternalCoverPage(companyName: string, assessmentNumber: string, reportLabel: string) {
  return h(
    Page,
    { size: 'A4', style: styles.coverPage },
    h(Text, { style: [styles.coverReportLabel, { color: '#B91C1C' }] }, INTERNAL_BANNER_TEXT),
    h(View, { style: styles.coverDivider }),
    h(Text, { style: styles.coverTitle }, 'NAC Internal Consulting Report'),
    h(Text, { style: styles.coverSubtitle }, reportLabel),
    h(Text, { style: styles.coverAssessmentNumber }, `${companyName} — Assessment No. ${assessmentNumber}`),
    h(
      Text,
      { style: styles.coverMeta },
      'Prepared to support the NAC consultant\'s own review and the live consultation call — not a deliverable ' +
        'for the customer.'
    ),
    h(
      Text,
      { style: styles.coverContact },
      'Confidential — for internal NAC consultant preparation only. Do not forward to the customer.'
    )
  );
}

/** Fixed page-number footer, clearly labeled "INTERNAL" on every page. */
export function buildInternalFooter() {
  return h(
    View,
    { style: styles.footer, fixed: true },
    h(
      Text,
      { style: [styles.footerText, { color: '#B91C1C' }] },
      `${COMPANY_NAME} — INTERNAL Consulting Report (confidential)`
    ),
    h(Text, {
      style: styles.footerText,
      fixed: true,
      render: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
        `Page ${pageNumber} of ${totalPages}`,
    })
  );
}
