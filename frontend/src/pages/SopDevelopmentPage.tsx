import { ServiceLandingView } from '@/features/services/ServiceLandingView';
import { getServiceBySlug } from '@/features/landing/landing.data';

const service = getServiceBySlug('sop-development');

export function SopDevelopmentPage() {
  return <ServiceLandingView service={service} />;
}
