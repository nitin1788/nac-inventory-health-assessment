import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { ROUTES } from '@/config/constants';

const AssessmentStartPage = lazy(() =>
  import('@/pages/AssessmentStartPage').then((m) => ({ default: m.AssessmentStartPage }))
);
const AssessmentQuestionsPage = lazy(() =>
  import('@/pages/AssessmentQuestionsPage').then((m) => ({ default: m.AssessmentQuestionsPage }))
);
const ResultsPage = lazy(() => import('@/pages/ResultsPage').then((m) => ({ default: m.ResultsPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const FaqPage = lazy(() => import('@/pages/FaqPage').then((m) => ({ default: m.FaqPage })));
const ContactUsPage = lazy(() => import('@/pages/ContactUsPage').then((m) => ({ default: m.ContactUsPage })));
const PrivacyPolicyPage = lazy(() =>
  import('@/pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsAndConditionsPage = lazy(() =>
  import('@/pages/TermsAndConditionsPage').then((m) => ({ default: m.TermsAndConditionsPage }))
);
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

/**
 * Central route table. Pages stay thin (see pages/ convention in
 * ARCHITECTURE.md) — all business logic lives in features/.
 *
 * Only the landing page is bundled eagerly (the most common entry
 * point); every other route is code-split via React.lazy so a visitor
 * only downloads the JS for the page they actually land on — smaller
 * initial bundle, better LCP/TBT.
 */
export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path={ROUTES.landing} element={<LandingPage />} />
        <Route path={ROUTES.assessmentStart} element={<AssessmentStartPage />} />
        <Route path={ROUTES.assessmentQuestions} element={<AssessmentQuestionsPage />} />
        <Route path={ROUTES.results} element={<ResultsPage />} />
        <Route path={ROUTES.about} element={<AboutPage />} />
        <Route path={ROUTES.faq} element={<FaqPage />} />
        <Route path={ROUTES.contactUs} element={<ContactUsPage />} />
        <Route path={ROUTES.privacyPolicy} element={<PrivacyPolicyPage />} />
        <Route path={ROUTES.termsAndConditions} element={<TermsAndConditionsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
