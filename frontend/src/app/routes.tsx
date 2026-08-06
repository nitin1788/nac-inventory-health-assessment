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
const PaymentPage = lazy(() => import('@/pages/PaymentPage').then((m) => ({ default: m.PaymentPage })));
const ThankYouPage = lazy(() => import('@/pages/ThankYouPage').then((m) => ({ default: m.ThankYouPage })));
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

const InventoryConsultingPage = lazy(() =>
  import('@/pages/InventoryConsultingPage').then((m) => ({ default: m.InventoryConsultingPage }))
);
const WarehouseConsultingPage = lazy(() =>
  import('@/pages/WarehouseConsultingPage').then((m) => ({ default: m.WarehouseConsultingPage }))
);
const OperationsConsultingPage = lazy(() =>
  import('@/pages/OperationsConsultingPage').then((m) => ({ default: m.OperationsConsultingPage }))
);
const SopDevelopmentPage = lazy(() =>
  import('@/pages/SopDevelopmentPage').then((m) => ({ default: m.SopDevelopmentPage }))
);
const BusinessAnalyticsPage = lazy(() =>
  import('@/pages/BusinessAnalyticsPage').then((m) => ({ default: m.BusinessAnalyticsPage }))
);
const TrainingImplementationPage = lazy(() =>
  import('@/pages/TrainingImplementationPage').then((m) => ({ default: m.TrainingImplementationPage }))
);

const BlogPage = lazy(() => import('@/pages/BlogPage').then((m) => ({ default: m.BlogPage })));
const CaseStudiesPage = lazy(() => import('@/pages/CaseStudiesPage').then((m) => ({ default: m.CaseStudiesPage })));
const FreeDownloadsPage = lazy(() =>
  import('@/pages/FreeDownloadsPage').then((m) => ({ default: m.FreeDownloadsPage }))
);
const ChecklistsPage = lazy(() => import('@/pages/ChecklistsPage').then((m) => ({ default: m.ChecklistsPage })));
const TemplatesPage = lazy(() => import('@/pages/TemplatesPage').then((m) => ({ default: m.TemplatesPage })));

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
        <Route path={ROUTES.payment} element={<PaymentPage />} />
        <Route path={ROUTES.thankYou} element={<ThankYouPage />} />
        <Route path={ROUTES.about} element={<AboutPage />} />
        <Route path={ROUTES.faq} element={<FaqPage />} />
        <Route path={ROUTES.contactUs} element={<ContactUsPage />} />
        <Route path={ROUTES.privacyPolicy} element={<PrivacyPolicyPage />} />
        <Route path={ROUTES.termsAndConditions} element={<TermsAndConditionsPage />} />
        <Route path={ROUTES.inventoryConsulting} element={<InventoryConsultingPage />} />
        <Route path={ROUTES.warehouseConsulting} element={<WarehouseConsultingPage />} />
        <Route path={ROUTES.operationsConsulting} element={<OperationsConsultingPage />} />
        <Route path={ROUTES.sopDevelopment} element={<SopDevelopmentPage />} />
        <Route path={ROUTES.businessAnalytics} element={<BusinessAnalyticsPage />} />
        <Route path={ROUTES.trainingImplementation} element={<TrainingImplementationPage />} />
        <Route path={ROUTES.blog} element={<BlogPage />} />
        <Route path={ROUTES.caseStudies} element={<CaseStudiesPage />} />
        <Route path={ROUTES.freeDownloads} element={<FreeDownloadsPage />} />
        <Route path={ROUTES.checklists} element={<ChecklistsPage />} />
        <Route path={ROUTES.templates} element={<TemplatesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
