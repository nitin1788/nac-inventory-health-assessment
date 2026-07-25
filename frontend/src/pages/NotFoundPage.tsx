import { Link } from 'react-router-dom';
import { PageLayout } from '@/shared/layouts/PageLayout';
import { Button } from '@/shared/components/Button';
import { ROUTES } from '@/config/constants';

export function NotFoundPage() {
  return (
    <PageLayout>
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="text-slate-600">The page you're looking for doesn't exist.</p>
        <Link to={ROUTES.landing}>
          <Button variant="secondary">Back to home</Button>
        </Link>
      </main>
    </PageLayout>
  );
}
