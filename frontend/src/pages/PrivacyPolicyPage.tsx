import { MarketingPageLayout } from '@/shared/layouts/MarketingPageLayout';
import { COMPANY_NAME, CONTACT } from '@/config/constants';

const LAST_UPDATED = 'July 2026';

export function PrivacyPolicyPage() {
  return (
    <MarketingPageLayout
      title={`Privacy Policy | ${COMPANY_NAME}`}
      description={`How ${COMPANY_NAME} collects, uses, and protects the information you provide through the Inventory Health Assessment.`}
      eyebrow="Legal"
      heading="Privacy Policy"
    >
      <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

      <p>
        This Privacy Policy explains how {COMPANY_NAME} ("we", "us", "our") collects, uses, and
        protects information when you use the free Inventory Health Assessment ("the Assessment").
      </p>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Information We Collect</h2>
        <p className="mt-3">When you complete the Assessment, we collect the information you provide, including:</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Company details: company name, business type, industry, number of employees, inventory locations, and approximate active SKUs.</li>
          <li>Contact details: your name, designation, mobile number, and email address.</li>
          <li>Your answers to the Assessment questions and the resulting scores.</li>
        </ul>
        <p className="mt-3">
          We do not collect payment information — the Assessment is free and does not require a
          purchase. Your in-progress answers are also saved temporarily in your browser's local
          storage so you can resume the Assessment if you close the tab; this data stays on your
          device and is cleared once you submit.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">How We Use Your Information</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>To generate your scored results and PDF report.</li>
          <li>To email your report to the address you provide.</li>
          <li>To notify our team internally that a new assessment was completed, so we can follow up if you'd like consulting support.</li>
          <li>To contact you about your results or our services, if you reach out or express interest.</li>
        </ul>
        <p className="mt-3">We do not sell your information to third parties.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Where Your Data Is Stored</h2>
        <p className="mt-3">
          Your submitted data is stored in our database, hosted by Supabase. Your report email
          (including the PDF attachment) is sent using Resend, our email delivery provider. Both
          providers process data on our behalf and do not use it for their own purposes.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Data Retention</h2>
        <p className="mt-3">
          We retain assessment records to provide your report, respond to follow-up requests, and
          maintain accurate business records. If you'd like your data deleted, contact us and we
          will remove it, except where we're required to keep records for legal or accounting
          purposes.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Cookies &amp; Tracking</h2>
        <p className="mt-3">
          We do not currently use advertising or analytics cookies. The only client-side storage
          used is the local-storage autosave described above, which is not shared with us or any
          third party.
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
