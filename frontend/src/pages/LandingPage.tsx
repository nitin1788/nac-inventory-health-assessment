import { PageLayout } from '@/shared/layouts/PageLayout';
import { Button } from '@/shared/components/Button';
import { COMPANY_NAME, ROUTES } from '@/config/constants';
import { Link } from 'react-router-dom';

/**
 * Placeholder landing page. Confirms routing/layout/Tailwind/component
 * wiring work end-to-end. Full hero/about/services/testimonials/FAQ
 * sections are built in the Landing Page milestone.
 */
export function LandingPage() {
  return (
    <PageLayout>
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-brand">{COMPANY_NAME}</p>
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          Inventory Health Assessment
        </h1>
        <p className="max-w-xl text-slate-600">
          Project foundation is live. The full landing page, assessment flow, and report engine
          are built out in upcoming milestones.
        </p>
        <Link to={ROUTES.assessmentStart}>
          <Button variant="primary">Start Free Assessment</Button>
        </Link>
      </main>
    </PageLayout>
  );
}
