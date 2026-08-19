import { LandingView } from '@/features/landing/LandingView';
import { useSeo } from '@/shared/hooks/useSeo';
import { COMPANY_NAME, ROUTES } from '@/config/constants';

export function LandingPage() {
  useSeo({
    title: `${COMPANY_NAME} | Inventory & Operations Consulting + Digital Marketing for Pharmacy & Healthcare`,
    description:
      'Nitin Anand Consulting specializes in pharmacy, healthcare, and allied businesses — Inventory & Operations Consulting and Digital Marketing & Growth from one partner who understands both.',
    path: ROUTES.landing,
  });

  return <LandingView />;
}
