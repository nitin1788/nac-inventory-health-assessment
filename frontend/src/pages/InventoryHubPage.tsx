import { ClipboardList } from 'lucide-react';
import { ServiceVerticalHubView } from '@/features/services/ServiceVerticalHubView';
import { INVENTORY_SERVICES } from '@/config/services.inventory.data';
import { ROUTES } from '@/config/constants';

export function InventoryHubPage() {
  return (
    <ServiceVerticalHubView
      path={ROUTES.inventoryHub}
      title="Inventory & Operations Consulting"
      metaDescription="Inventory and operations consulting from Nitin Anand Consulting for pharmacies, medical stores, and healthcare businesses — audits, ABC/FSN and expiry analysis, stock optimization, SOPs, and KPI dashboards."
      eyebrow="Vertical 1"
      heroIcon={ClipboardList}
      intro="Structured, practical consulting from a pharmacy inventory management consultant who understands how pharmacy, healthcare, and allied businesses handle stock and run day-to-day operations — from inventory audits and expiry control to SOPs and KPI dashboards."
      services={INVENTORY_SERVICES}
      accentGradient="from-accent to-accent-dark"
      accentTextClass="text-accent-dark"
    />
  );
}
