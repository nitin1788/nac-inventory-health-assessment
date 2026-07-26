import { AnimatePresence } from 'framer-motion';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { AssessmentHeader } from './components/AssessmentHeader';
import { AssessmentProgressBar } from './components/AssessmentProgressBar';
import { QuestionCard } from './components/QuestionCard';
import { AssessmentNavigation } from './components/AssessmentNavigation';
import { useAssessmentEngine } from './useAssessmentEngine';
import { QUESTION_BANK } from './questions';
import type { CompanyInfoFormValues } from './assessment.schema';

export function AssessmentQuestionsView() {
  const navigate = useNavigate();
  const location = useLocation();
  const companyInfo = location.state as CompanyInfoFormValues | null;

  const engine = useAssessmentEngine(QUESTION_BANK.questions);

  // Company info is captured as a prerequisite step (PRD Section 4) —
  // land back on Company Info if someone reaches this route directly.
  if (!companyInfo) {
    return <Navigate to={ROUTES.assessmentStart} replace />;
  }

  if (!engine.currentQuestion) {
    return null;
  }

  const handleNext = () => {
    if (engine.isLast) {
      const finalAnswers = { ...engine.answers };
      engine.clearSavedProgress();
      navigate(ROUTES.thankYou, { state: { companyInfo, answers: finalAnswers } });
      return;
    }
    engine.goNext();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AssessmentHeader />
      <main className="mx-auto max-w-2xl px-6 py-16 lg:px-8">
        <AssessmentProgressBar
          currentIndex={engine.currentIndex}
          total={engine.totalQuestions}
          moduleId={engine.currentQuestion.moduleId}
        />

        <AnimatePresence mode="wait">
          <QuestionCard
            key={engine.currentQuestion.id}
            question={engine.currentQuestion}
            selectedValue={engine.answers[engine.currentQuestion.id]}
            onSelect={engine.answerCurrent}
          />
        </AnimatePresence>

        <AssessmentNavigation
          isFirst={engine.isFirst}
          isLast={engine.isLast}
          canProceed={engine.isCurrentAnswered}
          onBack={engine.goBack}
          onNext={handleNext}
        />
      </main>
    </div>
  );
}
