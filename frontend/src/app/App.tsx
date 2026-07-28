import { AppProviders } from '@/app/AppProviders';
import { AppRoutes } from '@/app/routes';
import { ScrollManager } from '@/app/ScrollManager';

export function App() {
  return (
    <AppProviders>
      <ScrollManager />
      <AppRoutes />
    </AppProviders>
  );
}
