import { Link, useLocation } from 'react-router-dom';
import { PageLayout } from '@/shared/layouts/PageLayout';
import { Button } from '@/shared/components/Button';
import { useSeo } from '@/shared/hooks/useSeo';
import { COMPANY_NAME, ROUTES } from '@/config/constants';

export function NotFoundPage() {
  const location = useLocation();
  useSeo({
    title: `Page Not Found | ${COMPANY_NAME}`,
    description: "The page you're looking for doesn't exist or may have moved.",
    path: location.pathname,
    noindex: true,
  });

  return (
    <PageLayout>
      <main
        id="main-content"
        className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 text-center"
      >
        <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="text-slate-600">The page you're looking for doesn't exist.</p>
        <Link to={ROUTES.landing}>
          <Button variant="secondary">Back to home</Button>
        </Link>
      </main>
    </PageLayout>
  );
}
