import { ServiceLandingView } from '@/features/services/ServiceLandingView';
import { getServiceBySlug } from '@/features/landing/landing.data';

const service = getServiceBySlug('operations-consulting');

export function OperationsConsultingPage() {
  return <ServiceLandingView service={service} />;
}
