import { ServiceLandingView } from '@/features/services/ServiceLandingView';
import { getServiceBySlug } from '@/features/landing/landing.data';

const service = getServiceBySlug('warehouse-consulting');

export function WarehouseConsultingPage() {
  return <ServiceLandingView service={service} />;
}
