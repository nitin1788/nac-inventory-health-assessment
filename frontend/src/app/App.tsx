import { AppProviders } from '@/app/AppProviders';
import { AppRoutes } from '@/app/routes';

export function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
