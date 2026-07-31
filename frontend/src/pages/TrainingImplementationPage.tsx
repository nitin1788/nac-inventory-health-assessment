import { ServiceLandingView } from '@/features/services/ServiceLandingView';
import { getServiceBySlug } from '@/features/landing/landing.data';

const service = getServiceBySlug('training-implementation');

export function TrainingImplementationPage() {
  return <ServiceLandingView service={service} />;
}
