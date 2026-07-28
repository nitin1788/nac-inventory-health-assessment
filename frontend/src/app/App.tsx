import { AppProviders } from '@/app/AppProviders';
import { AppRoutes } from '@/app/routes';
import { ScrollManager } from '@/app/ScrollManager';

export function App() {
  return (
    <AppProviders>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand focus:shadow-lg"
      >
        Skip to main content
      </a>
      <ScrollManager />
      <AppRoutes />
    </AppProviders>
  );
}
