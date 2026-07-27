import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { AssessmentStartPage } from '@/pages/AssessmentStartPage';
import { AssessmentQuestionsPage } from '@/pages/AssessmentQuestionsPage';
import { ResultsPage } from '@/pages/ResultsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ROUTES } from '@/config/constants';

/**
 * Central route table. Pages stay thin (see pages/ convention in
 * ARCHITECTURE.md) — all business logic lives in features/.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.landing} element={<LandingPage />} />
      <Route path={ROUTES.assessmentStart} element={<AssessmentStartPage />} />
      <Route path={ROUTES.assessmentQuestions} element={<AssessmentQuestionsPage />} />
      <Route path={ROUTES.results} element={<ResultsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
