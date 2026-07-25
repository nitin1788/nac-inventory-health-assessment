import { PageLayout } from '@/shared/layouts/PageLayout';

/**
 * Placeholder. The 52-question multi-step form is built in the
 * Assessment Flow milestone.
 */
export function AssessmentQuestionsPage() {
  return (
    <PageLayout>
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Assessment — Questions</h1>
        <p className="text-slate-600">This step is built in the Assessment Flow milestone.</p>
      </main>
    </PageLayout>
  );
}
