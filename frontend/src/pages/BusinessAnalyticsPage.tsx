import { ServiceLandingView } from '@/features/services/ServiceLandingView';
import { getServiceBySlug } from '@/features/landing/landing.data';

const service = getServiceBySlug('business-analytics');

export function BusinessAnalyticsPage() {
  return <ServiceLandingView service={service} />;
}
