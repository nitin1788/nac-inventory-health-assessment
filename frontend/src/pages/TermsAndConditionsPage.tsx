import { MarketingPageLayout } from '@/shared/layouts/MarketingPageLayout';
import { COMPANY_NAME, CONTACT, ROUTES } from '@/config/constants';

const LAST_UPDATED = 'July 2026';

export function TermsAndConditionsPage() {
  return (
    <MarketingPageLayout
      title={`Terms & Conditions | ${COMPANY_NAME}`}
      description={`The terms and conditions governing use of the ${COMPANY_NAME} Inventory Health Assessment.`}
      path={ROUTES.termsAndConditions}
      eyebrow="Legal"
      heading="Terms & Conditions"
    >
      <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

      <p>
        These Terms &amp; Conditions govern your use of the free Inventory Health Assessment
        ("the Assessment") provided by {COMPANY_NAME}. By using the Assessment, you agree to these
        terms.
      </p>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">The Assessment Is Free and Informational</h2>
        <p className="mt-3">
          The Assessment is provided free of charge and is intended for general informational
          purposes only. It is based entirely on the answers you provide (self-reported) and does
          not involve an on-site audit or independent verification of your operations.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Not Professional Consulting Advice</h2>
        <p className="mt-3">
          Your results, report, and any recommendations are general guidance based on your answers.
          They do not constitute professional consulting, financial, legal, or operational advice,
          and should not be relied upon as a substitute for a detailed, tailored operational audit.
          For a comprehensive assessment specific to your business, please contact us directly.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Accuracy of Information</h2>
        <p className="mt-3">
          You are responsible for the accuracy of the information you submit. Your score, rating,
          and recommendations are only as accurate as the answers provided.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Acceptable Use</h2>
        <p className="mt-3">
          You agree to use the Assessment only for its intended purpose — evaluating your own
          business's inventory practices — and not to submit false information on behalf of another
          party, attempt to disrupt the service, or misuse the platform in any way.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">No Warranty</h2>
        <p className="mt-3">
          The Assessment is provided "as is," without warranties of any kind, express or implied. We
          do not guarantee that the service will be uninterrupted or error-free.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Limitation of Liability</h2>
        <p className="mt-3">
          To the fullest extent permitted by law, {COMPANY_NAME} is not liable for any decisions made
          or actions taken based on your Assessment results.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Changes to These Terms</h2>
        <p className="mt-3">
          We may update these Terms from time to time. The "Last updated" date above reflects the
          most recent revision. Continued use of the Assessment after changes means you accept the
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
