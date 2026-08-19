import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';

/**
 * Superseded by the new /inventory-operations-consulting structure (see
 * pages/InventoryHubPage.tsx, InventoryServicePage.tsx). This route is
 * already redirected at the router level (see app/routes.tsx) — this
 * component is kept, not deleted, only as a safety net for any direct
 * import, and mirrors that same redirect.
 */
export function InventoryConsultingPage() {
  return <Navigate to={ROUTES.inventoryHub} replace />;
}
