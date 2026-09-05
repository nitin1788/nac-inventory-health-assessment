import { Mail, Phone, MessageCircle } from 'lucide-react';
import { MarketingPageLayout } from '@/shared/layouts/MarketingPageLayout';
import { Button } from '@/shared/components/Button';
import { buildConsultationWhatsAppUrl } from '@/shared/utils/whatsapp';
import { COMPANY_NAME, CONTACT, ROUTES } from '@/config/constants';
import { ContactForm } from '@/features/contact/ContactForm';

export function ContactUsPage() {
  return (
    <MarketingPageLayout
      title={`Contact Us | ${COMPANY_NAME}`}
      description={`Get in touch with ${COMPANY_NAME} for Inventory & Operations Consulting or Digital Marketing & Growth for your pharmacy, clinic, or healthcare business.`}
      path={ROUTES.contactUs}
      eyebrow="Get In Touch"
      heading="Contact Us"
    >
      <p>
        Tell us a bit about your business and which side you&apos;re interested in — Inventory
        &amp; Operations Consulting, Digital Marketing & Growth, or both — and we&apos;ll get back
        to you, typically within one business day.
      </p>

      <p className="text-sm text-slate-600">
        We&apos;re based in Mumbai and work in person with pharmacy and healthcare businesses
        across Mumbai and Maharashtra for Inventory &amp; Operations engagements — Digital
        Marketing &amp; Growth clients can be anywhere in India.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <a
          href={`mailto:${CONTACT.email}`}
          className="flex items-center gap-3 rounded-xl border border-slate-200 p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-soft-lg"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark">
            <Mail className="h-5 w-5 text-white" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
            <p className="break-all text-sm font-medium text-slate-900">{CONTACT.email}</p>
          </div>
        </a>

        <a
          href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
          className="flex items-center gap-3 rounded-xl border border-slate-200 p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-soft-lg"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark">
            <Phone className="h-5 w-5 text-white" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</p>
            <p className="text-sm font-medium text-slate-900">{CONTACT.phone}</p>
          </div>
        </a>

        <a
          href={buildConsultationWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-slate-200 p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-soft-lg"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent">
            <MessageCircle className="h-5 w-5 text-white" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">WhatsApp</p>
            <p className="text-sm font-medium text-slate-900">Chat with us</p>
          </div>
        </a>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-sm text-slate-600">
          Ready to talk through your inventory, operations, or digital marketing needs? Book a
          free consultation and we&apos;ll take it from there.
        </p>
        <a href={buildConsultationWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
          <Button variant="primary">Book a Consultation</Button>
        </a>
      </div>

      <ContactForm />
    </MarketingPageLayout>
  );
}
