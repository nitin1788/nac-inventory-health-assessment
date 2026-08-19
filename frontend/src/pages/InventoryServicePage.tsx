import { useParams } from 'react-router-dom';
import { ServiceLandingView } from '@/features/services/ServiceLandingView';
import { INVENTORY_SERVICES } from '@/config/services.inventory.data';
import { ROUTES } from '@/config/constants';
import { NotFoundPage } from './NotFoundPage';

export function InventoryServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service = INVENTORY_SERVICES.find((item) => item.slug === slug);

  if (!service) {
    return <NotFoundPage />;
  }

  return (
    <ServiceLandingView
      service={service}
      verticalServices={INVENTORY_SERVICES}
      hubPath={ROUTES.inventoryHub}
      hubLabel="Inventory & Operations Consulting"
      vertical="inventory"
    />
  );
}
