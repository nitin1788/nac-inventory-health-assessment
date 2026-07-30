import { COMPANY_NAME } from '@/config/constants';
import { useDocumentMeta } from '@/shared/hooks/useDocumentMeta';
import { AssessmentHeader } from './components/AssessmentHeader';
import { AssessmentIntro } from './components/AssessmentIntro';
import { CompanyInfoForm } from './components/CompanyInfoForm';

export function AssessmentStartView() {
  useDocumentMeta(
    `Free Inventory Health Assessment | ${COMPANY_NAME}`,
    `Take the free ${COMPANY_NAME} Inventory Health Assessment — a fast, expert-backed evaluation of your inventory, warehouse, and operations with a personalized scored report.`
  );

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
