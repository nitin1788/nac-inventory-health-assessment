import { useParams } from 'react-router-dom';
import { ServiceLandingView } from '@/features/services/ServiceLandingView';
import { DIGITAL_SERVICES } from '@/config/services.digital.data';
import { ROUTES } from '@/config/constants';
import { NotFoundPage } from './NotFoundPage';

export function DigitalServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service = DIGITAL_SERVICES.find((item) => item.slug === slug);

  if (!service) {
    return <NotFoundPage />;
  }

  return (
    <ServiceLandingView
      service={service}
      verticalServices={DIGITAL_SERVICES}
      hubPath={ROUTES.digitalMarketingHub}
      hubLabel="Digital Marketing & Growth"
      vertical="digital"
    />
  );
}
