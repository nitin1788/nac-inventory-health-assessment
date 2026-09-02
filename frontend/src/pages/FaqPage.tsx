import { Link } from 'react-router-dom';
import { MarketingPageLayout } from '@/shared/layouts/MarketingPageLayout';
import { useJsonLd } from '@/shared/hooks/useJsonLd';
import { COMPANY_NAME, ROUTES } from '@/config/constants';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'What does Nitin Anand Consulting do?',
    answer:
      `${COMPANY_NAME} is a consulting company serving pharmacy, healthcare, and allied businesses across two specialized verticals: Inventory & Operations Consulting (audits, stock control, expiry management, SOPs, and process improvement) and Digital Marketing & Growth (websites, SEO, Google Business Profile, social media, and paid ads). We're a consulting firm — not a pharmacy, and not a healthcare provider.`,
  },
  {
    question: 'Who does NAC work with?',
    answer:
      'Retail pharmacies, hospital pharmacies, chain pharmacies, medical stores, clinics, hospitals, diagnostic centres, pathology labs, dental clinics, physiotherapy centres, pharma distributors, and medical equipment/surgical suppliers — pharmacy, healthcare, and allied businesses of most sizes.',
  },
  {
    question: 'What is Inventory & Operations Consulting?',
    answer:
      'Our first vertical: inventory audits and reconciliation, stock control, expiry and near-expiry management, ABC/FSN analysis, store and warehouse operations, SOP development, process improvement, and MIS/KPI reporting — built around how pharmacy and healthcare stock actually behaves (batch numbers, expiry risk, tight margins).',
  },
  {
    question: 'What is Digital Marketing & Growth?',
    answer:
      'Our second vertical: website development, SEO and local SEO, Google Business Profile setup and optimization, social media management and content, Google Ads/PPC, Meta Ads, performance marketing, and analytics — focused on helping pharmacy and healthcare businesses get found and get more enquiries.',
  },
  {
    question: 'Does NAC work with retail pharmacies?',
    answer:
      'Yes — single-store retail pharmacies are one of our core segments, on both the inventory/operations side (stock accuracy, expiry control) and the digital side (local SEO, Google Business Profile).',
  },
  {
    question: 'Does NAC work with hospital pharmacies?',
    answer:
      'Yes. Hospital pharmacy engagements are usually scoped to a specific process or stocking point rather than the whole facility at once, given the added complexity of hospital-scale operations.',
  },
  {
    question: 'Does NAC work with chain pharmacies?',
    answer:
      'Yes — chain pharmacies are a core segment, particularly for standardizing SOPs and stock processes across multiple outlets, and for consistent local SEO/Google Business Profile management across locations.',
  },
  {
    question: 'Can NAC help with pharmacy inventory and expiry management?',
    answer:
      'Yes — this is core to our Inventory & Operations vertical: inventory audits, expiry and near-expiry analysis, ABC/FSN analysis, dead and slow-moving stock reduction, and reorder-level (min-max) planning.',
  },
  {
    question: 'Can NAC help with pharmacy digital marketing?',
    answer:
      'Yes — website development, local SEO, Google Business Profile optimization, and social media management for pharmacies, so more nearby customers can find and trust the business online.',
  },
  {
    question: 'Does NAC provide website and SEO services?',
    answer:
      'Yes — website development and both general and local SEO are part of the Digital Marketing & Growth vertical, built specifically for pharmacy and healthcare businesses.',
  },
  {
    question: 'Does NAC provide Google Ads/PPC?',
    answer:
      "Yes — Google Ads, PPC, and Meta Ads are part of our performance marketing services. We don't promise guaranteed rankings, leads, or ROI; every recommendation is scoped to what's realistic for your budget.",
  },
  {
    question: 'How does a consulting engagement work?',
    answer:
      'It starts with a free consultation to understand your business and which vertical (or both) is the priority. From there we scope a focused engagement — we don\'t take a one-size-fits-all approach across businesses of very different sizes and setups. Reach out via our Contact page or WhatsApp to start that conversation.',
  },
];

export function FaqPage() {
  useJsonLd({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  });

  return (
    <MarketingPageLayout
      title={`Frequently Asked Questions | ${COMPANY_NAME}`}
      description="Answers to common questions about NAC's pharmacy and healthcare consulting — Inventory & Operations Consulting, Digital Marketing & Growth, and how an engagement works."
      path={ROUTES.faq}
      eyebrow="Support"
      heading="Frequently Asked Questions"
    >
      <div className="space-y-6">
        {FAQS.map((faq) => (
          <div key={faq.question} className="rounded-xl border border-slate-200 p-5 shadow-soft transition-shadow hover:shadow-soft-lg">
            <h2 className="text-sm font-semibold text-slate-900 sm:text-base">{faq.question}</h2>
            <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-600">
        Still have a question?{' '}
        <Link to={ROUTES.contactUs} className="font-medium text-brand hover:underline">
          Contact us
        </Link>{' '}
        and we'll get back to you.
      </p>
    </MarketingPageLayout>
  );
}
