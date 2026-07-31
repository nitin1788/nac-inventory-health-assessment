import { COMPANY_NAME, ROUTES } from '@/config/constants';
import { useSeo } from '@/shared/hooks/useSeo';
import { AssessmentHeader } from './components/AssessmentHeader';
import { AssessmentIntro } from './components/AssessmentIntro';
import { CompanyInfoForm } from './components/CompanyInfoForm';

export function AssessmentStartView() {
  useSeo({
    title: `Free Inventory Health Assessment | ${COMPANY_NAME}`,
    description: `Take the free ${COMPANY_NAME} Inventory Health Assessment — a 52-question, expert-backed evaluation of your inventory, warehouse, and operations with a personalized scored report.`,
    path: ROUTES.assessmentStart,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <AssessmentHeader />
      <main id="main-content" className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <AssessmentIntro />
        <CompanyInfoForm />
      </main>
    </div>
  );
}
