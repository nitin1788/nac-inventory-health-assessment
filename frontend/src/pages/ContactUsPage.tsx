import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { MarketingPageLayout } from '@/shared/layouts/MarketingPageLayout';
import { Button } from '@/shared/components/Button';
import { COMPANY_NAME, CONTACT, ROUTES } from '@/config/constants';

export function ContactUsPage() {
  return (
    <MarketingPageLayout
      title={`Contact Us | ${COMPANY_NAME}`}
      description={`Get in touch with ${COMPANY_NAME} for inventory audits, warehouse audits, optimization, and consulting services.`}
      eyebrow="Get In Touch"
      heading="Contact Us"
    >
      <p>
        Have a question about your assessment results, or want to talk through a consulting
        engagement? Reach out directly — we typically respond within one business day.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <a
          href={`mailto:${CONTACT.email}`}
          className="flex items-center gap-3 rounded-xl border border-slate-200 p-5 transition-colors hover:border-brand"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10">
            <Mail className="h-5 w-5 text-brand" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
            <p className="text-sm font-medium text-slate-900">{CONTACT.email}</p>
          </div>
        </a>

        <a
          href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
          className="flex items-center gap-3 rounded-xl border border-slate-200 p-5 transition-colors hover:border-brand"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10">
            <Phone className="h-5 w-5 text-brand" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</p>
            <p className="text-sm font-medium text-slate-900">{CONTACT.phone}</p>
          </div>
        </a>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-sm text-slate-600">
          Not sure where to start? Take the free Inventory Health Assessment first — it takes about
          10 minutes and gives us a shared starting point for any conversation.
        </p>
        <Link to={ROUTES.assessmentStart} className="mt-4 inline-block">
          <Button variant="primary">Start Free Assessment</Button>
        </Link>
      </div>
    </MarketingPageLayout>
  );
}
