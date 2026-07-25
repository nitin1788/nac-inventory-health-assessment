import { PageLayout } from '@/shared/layouts/PageLayout';

/**
 * Placeholder. Final confirmation copy + booking CTA are built once
 * the submission workflow (Milestones 4-6) is in place.
 */
export function ThankYouPage() {
  return (
    <PageLayout>
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Thank You</h1>
        <p className="text-slate-600">
          This page is completed once the submission workflow is built.
        </p>
      </main>
    </PageLayout>
  );
}
