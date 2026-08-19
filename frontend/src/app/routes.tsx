import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { ROUTES } from '@/config/constants';

// Unlinked from navigation as of the Phase 1 pharmacy/healthcare
// repositioning, but kept fully wired — the assessment/payment backend
// and these pages are untouched. See NAC_PHASE_1_IMPLEMENTATION_PLAN.md.
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

// New two-vertical service structure.
const ServicesHubPage = lazy(() => import('@/pages/ServicesHubPage').then((m) => ({ default: m.ServicesHubPage })));
const InventoryHubPage = lazy(() => import('@/pages/InventoryHubPage').then((m) => ({ default: m.InventoryHubPage })));
const InventoryServicePage = lazy(() =>
  import('@/pages/InventoryServicePage').then((m) => ({ default: m.InventoryServicePage }))
);
const DigitalMarketingHubPage = lazy(() =>
  import('@/pages/DigitalMarketingHubPage').then((m) => ({ default: m.DigitalMarketingHubPage }))
);
const DigitalServicePage = lazy(() =>
  import('@/pages/DigitalServicePage').then((m) => ({ default: m.DigitalServicePage }))
);

// New industries structure.
const IndustriesHubPage = lazy(() =>
  import('@/pages/IndustriesHubPage').then((m) => ({ default: m.IndustriesHubPage }))
);
const IndustryPage = lazy(() => import('@/pages/IndustryPage').then((m) => ({ default: m.IndustryPage })));

const BlogPage = lazy(() => import('@/pages/BlogPage').then((m) => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })));
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

        {/* Assessment/payment flow — unlinked from navigation, not deleted. */}
        <Route path={ROUTES.assessmentStart} element={<AssessmentStartPage />} />
        <Route path={ROUTES.assessmentQuestions} element={<AssessmentQuestionsPage />} />
        <Route path={ROUTES.results} element={<ResultsPage />} />
        <Route path={ROUTES.payment} element={<PaymentPage />} />
        <Route path={ROUTES.thankYou} element={<ThankYouPage />} />

        <Route path={ROUTES.about} element={<AboutPage />} />
        <Route path={ROUTES.faq} element={<FaqPage />} />
        <Route path={ROUTES.contactUs} element={<ContactUsPage />} />
        {/* Old contact URL — redirected, not deleted (may be indexed/bookmarked). */}
        <Route path={ROUTES.contactUsLegacy} element={<Navigate to={ROUTES.contactUs} replace />} />
        <Route path={ROUTES.privacyPolicy} element={<PrivacyPolicyPage />} />
        <Route path={ROUTES.termsAndConditions} element={<TermsAndConditionsPage />} />

        {/* Services structure: /services hub + two vertical hubs. */}
        <Route path={ROUTES.servicesHub} element={<ServicesHubPage />} />
        <Route path={ROUTES.inventoryHub} element={<InventoryHubPage />} />
        <Route path={`${ROUTES.inventoryHub}/:slug`} element={<InventoryServicePage />} />
        <Route path={ROUTES.digitalMarketingHub} element={<DigitalMarketingHubPage />} />
        <Route path={`${ROUTES.digitalMarketingHub}/:slug`} element={<DigitalServicePage />} />
        {/* Phase-1 top-level vertical URLs — redirected to the /services/* structure. */}
        <Route path={ROUTES.inventoryHubLegacy} element={<Navigate to={ROUTES.inventoryHub} replace />} />
        <Route path={`${ROUTES.inventoryHubLegacy}/:slug`} element={<Navigate to={ROUTES.inventoryHub} replace />} />
        <Route path={ROUTES.digitalMarketingHubLegacy} element={<Navigate to={ROUTES.digitalMarketingHub} replace />} />
        <Route
          path={`${ROUTES.digitalMarketingHubLegacy}/:slug`}
          element={<Navigate to={ROUTES.digitalMarketingHub} replace />}
        />

        {/* New industries structure. */}
        <Route path={ROUTES.industriesHub} element={<IndustriesHubPage />} />
        <Route path={`${ROUTES.industriesHub}/:slug`} element={<IndustryPage />} />

        {/* Old fixed-slug service pages — redirected to the new services
            hub rather than left as a dead end or deleted, since they may
            already be indexed or bookmarked. */}
        <Route path={ROUTES.inventoryConsulting} element={<Navigate to={ROUTES.inventoryHub} replace />} />
        <Route path={ROUTES.warehouseConsulting} element={<Navigate to={ROUTES.inventoryHub} replace />} />
        <Route path={ROUTES.operationsConsulting} element={<Navigate to={ROUTES.inventoryHub} replace />} />
        <Route path={ROUTES.sopDevelopment} element={<Navigate to={ROUTES.inventoryHub} replace />} />
        <Route path={ROUTES.businessAnalytics} element={<Navigate to={ROUTES.inventoryHub} replace />} />
        <Route path={ROUTES.trainingImplementation} element={<Navigate to={ROUTES.inventoryHub} replace />} />

        <Route path={ROUTES.blog} element={<BlogPage />} />
        <Route path={`${ROUTES.blog}/:slug`} element={<BlogPostPage />} />
        <Route path={ROUTES.caseStudies} element={<CaseStudiesPage />} />
        <Route path={ROUTES.freeDownloads} element={<FreeDownloadsPage />} />
        <Route path={ROUTES.checklists} element={<ChecklistsPage />} />
        <Route path={ROUTES.templates} element={<TemplatesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
