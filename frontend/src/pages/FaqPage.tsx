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
    question: 'Is the Inventory Health Assessment really free?',
    answer:
      'Yes. The assessment, your scored report, and the emailed PDF are completely free, with no obligation to purchase any consulting service.',
  },
  {
    question: 'How long does it take to complete?',
    answer:
      'Most people complete the 52 diagnostic questions in about 10 minutes. You can pause and resume — your answers are saved on your device until you finish.',
  },
  {
    question: 'What do I get at the end?',
    answer:
      "An instant on-screen results page with your overall score, health rating, and module-wise breakdown, plus a branded PDF report emailed to the address you provide — with the same findings and recommendations.",
  },
  {
    question: 'Is my company information kept confidential?',
    answer:
      "Yes. Your responses are used only to generate your report and, if you choose to follow up, to contact you about our consulting services. See our Privacy Policy for full details.",
  },
  {
    question: "I didn't receive my report email — what should I do?",
    answer:
      'Emails are typically delivered within a minute. Please check your Spam/Junk folder first. If it still hasn\'t arrived, contact us and we\'ll resend it.',
  },
  {
    question: 'Can I get help acting on my results?',
    answer:
      `Yes — you can book a consultation directly from your results page, or reach out via our Contact page. ${COMPANY_NAME} offers inventory audits, warehouse audits, optimization, SOP development, and process improvement services.`,
  },
  {
    question: 'Can I retake the assessment later?',
    answer:
      'Yes, you can complete a new assessment at any time — for example, after implementing changes, to track how your inventory health score has improved.',
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
      description="Answers to common questions about the free Inventory Health Assessment, your scored report, data privacy, and how the process works."
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
