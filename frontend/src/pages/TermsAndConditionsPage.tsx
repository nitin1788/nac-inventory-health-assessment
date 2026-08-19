import { MarketingPageLayout } from '@/shared/layouts/MarketingPageLayout';
import { COMPANY_NAME, CONTACT, ROUTES } from '@/config/constants';

const LAST_UPDATED = 'August 2026';

export function TermsAndConditionsPage() {
  return (
    <MarketingPageLayout
      title={`Terms & Conditions | ${COMPANY_NAME}`}
      description={`The terms and conditions governing use of the ${COMPANY_NAME} website.`}
      path={ROUTES.termsAndConditions}
      eyebrow="Legal"
      heading="Terms & Conditions"
    >
      <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

      <p>
        These Terms &amp; Conditions govern your use of this website, provided by {COMPANY_NAME}.
        By using this website, you agree to these terms.
      </p>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Informational Content</h2>
        <p className="mt-3">
          The content on this website — including service, industry, and blog pages — is provided
          for general informational purposes. It describes our Inventory &amp; Operations
          Consulting and Digital Marketing & Growth offerings and does not itself constitute a
          completed engagement, audit, or deliverable.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Not Professional Advice</h2>
        <p className="mt-3">
          General content on this site (including blog articles) is provided as general guidance
          and does not constitute professional consulting, financial, legal, medical, or
          operational advice specific to your business. For advice tailored to your situation,
          please contact us directly to scope an engagement.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Accuracy of Information</h2>
        <p className="mt-3">
          We aim to keep the information on this site accurate and current, but we do not
          guarantee it is free of errors or fully up to date at all times.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Acceptable Use</h2>
        <p className="mt-3">
          You agree to use this website only for its intended purpose — learning about our
          services and getting in touch — and not to attempt to disrupt the service, submit false
          information, or misuse the site in any way.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">No Warranty</h2>
        <p className="mt-3">
          This website is provided "as is," without warranties of any kind, express or implied. We
          do not guarantee that the service will be uninterrupted or error-free.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Limitation of Liability</h2>
        <p className="mt-3">
          To the fullest extent permitted by law, {COMPANY_NAME} is not liable for any decisions
          made or actions taken based on general content published on this website.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Changes to These Terms</h2>
        <p className="mt-3">
          We may update these Terms from time to time. The "Last updated" date above reflects the
          most recent revision. Continued use of this website after changes means you accept the
          updated terms.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Contact Us</h2>
        <p className="mt-3">
          Questions about these terms can be sent to{' '}
          <a href={`mailto:${CONTACT.email}`} className="font-medium text-brand hover:underline">
            {CONTACT.email}
          </a>{' '}
          or {CONTACT.phone}.
        </p>
      </section>
    </MarketingPageLayout>
  );
}
