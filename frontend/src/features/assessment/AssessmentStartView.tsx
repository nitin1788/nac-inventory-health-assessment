import { AssessmentHeader } from './components/AssessmentHeader';
import { AssessmentIntro } from './components/AssessmentIntro';
import { CompanyInfoForm } from './components/CompanyInfoForm';

export function AssessmentStartView() {
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
