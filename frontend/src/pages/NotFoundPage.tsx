import { Link, useLocation } from 'react-router-dom';
import { Navbar } from '@/features/landing/components/Navbar';
import { Footer } from '@/features/landing/components/Footer';
import { Button } from '@/shared/components/Button';
import { useSeo } from '@/shared/hooks/useSeo';
import { COMPANY_NAME, ROUTES } from '@/config/constants';

/**
 * Full Navbar/Footer (not the bare PageLayout shell) — a visitor or a
 * crawler landing here on a broken/removed link still has a real path
 * back into the site (nav, footer sitemap-equivalent links), not a
 * dead end with a single "back to home" button.
 */
export function NotFoundPage() {
  const location = useLocation();
  useSeo({
    title: `Page Not Found | ${COMPANY_NAME}`,
    description: "The page you're looking for doesn't exist or may have moved.",
    path: location.pathname,
    noindex: true,
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main
        id="main-content"
        className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center"
      >
        <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="text-slate-600">The page you're looking for doesn't exist or may have moved.</p>
        <Link to={ROUTES.landing}>
          <Button variant="secondary">Back to home</Button>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
