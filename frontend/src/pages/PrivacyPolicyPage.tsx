import { MarketingPageLayout } from '@/shared/layouts/MarketingPageLayout';
import { COMPANY_NAME, CONTACT, ROUTES } from '@/config/constants';

const LAST_UPDATED = 'September 2026';

export function PrivacyPolicyPage() {
  return (
    <MarketingPageLayout
      title={`Privacy Policy | ${COMPANY_NAME}`}
      description={`How ${COMPANY_NAME} collects, uses, and protects the information you provide through this website.`}
      path={ROUTES.privacyPolicy}
      eyebrow="Legal"
      heading="Privacy Policy"
    >
      <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

      <p>
        This Privacy Policy explains how {COMPANY_NAME} ("we", "us", "our") collects, uses, and
        protects information when you use this website, including our contact/enquiry channels
        and (where still accessible) our inventory diagnostic tool.
      </p>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Information We Collect</h2>
        <p className="mt-3">
          When you contact us — by email, phone, WhatsApp, or a form on this site — we collect the
          information you choose to provide, which may include:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Company details: company name, business type, industry, and similar business information.</li>
          <li>Contact details: your name, designation, mobile number, and email address.</li>
          <li>Any details you share about the services you're interested in.</li>
        </ul>
        <p className="mt-3">
          We do not collect payment information through this website. If our legacy inventory
          diagnostic tool is used, your in-progress answers are saved temporarily in your
          browser's local storage so you can resume it if you close the tab; this data stays on
          your device.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">How We Use Your Information</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>To respond to your enquiry and discuss the services you're interested in.</li>
          <li>To notify our team internally when someone reaches out, so we can follow up.</li>
          <li>To contact you about your enquiry or our services, if you reach out or express interest.</li>
        </ul>
        <p className="mt-3">We do not sell your information to third parties.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Where Your Data Is Stored</h2>
        <p className="mt-3">
          Submitted data, where applicable, is stored in our database, hosted by Supabase. Any
          email correspondence (including report or document attachments) is sent using Resend,
          our email delivery provider. Both providers process data on our behalf and do not use it
          for their own purposes.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Data Retention</h2>
        <p className="mt-3">
          We retain enquiry and business records to respond to you and maintain accurate business
          records. If you'd like your data deleted, contact us and we will remove it, except where
          we're required to keep records for legal or accounting purposes.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Cookies &amp; Tracking</h2>
        <p className="mt-3">
          We use Google Analytics 4 to understand how visitors use this site — which pages are
          viewed, and clicks on WhatsApp, phone, or email links. Google Analytics sets cookies in
          your browser to do this. We do not send it your name, email address, phone number, or
          any message content — only the destination of the link you clicked and standard,
          non-identifying browsing data. Google processes this data under its own privacy policy.
          We do not use advertising cookies. Any client-side storage used by legacy tools on this
          site is not shared with us or any third party.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Your Rights</h2>
        <p className="mt-3">
          You can ask us at any time what information we hold about you, request a correction, or
          request deletion, by contacting us at{' '}
          <a href={`mailto:${CONTACT.email}`} className="font-medium text-brand hover:underline">
            {CONTACT.email}
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Changes to This Policy</h2>
        <p className="mt-3">
          We may update this Privacy Policy from time to time. The "Last updated" date above
          reflects the most recent revision.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Contact Us</h2>
        <p className="mt-3">
          Questions about this policy can be sent to{' '}
          <a href={`mailto:${CONTACT.email}`} className="font-medium text-brand hover:underline">
            {CONTACT.email}
          </a>{' '}
          or {CONTACT.phone}.
        </p>
      </section>
    </MarketingPageLayout>
  );
}
