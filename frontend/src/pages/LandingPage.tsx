import { LandingView } from '@/features/landing/LandingView';
import { useSeo } from '@/shared/hooks/useSeo';
import { COMPANY_NAME, ROUTES } from '@/config/constants';

export function LandingPage() {
  useSeo({
    title: `${COMPANY_NAME} | Inventory, Warehouse & Operations Consulting`,
    description:
      'Nitin Anand Consulting helps businesses improve inventory accuracy, warehouse operations and business performance through professional inventory assessments and consulting services.',
    path: ROUTES.landing,
  });

  return <LandingView />;
}
