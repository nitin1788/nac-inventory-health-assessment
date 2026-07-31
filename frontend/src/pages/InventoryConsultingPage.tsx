import { ServiceLandingView } from '@/features/services/ServiceLandingView';
import { getServiceBySlug } from '@/features/landing/landing.data';

const service = getServiceBySlug('inventory-consulting');

export function InventoryConsultingPage() {
  return <ServiceLandingView service={service} />;
}
