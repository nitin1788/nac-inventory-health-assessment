import { ResourceComingSoonView } from '@/features/resources/ResourceComingSoonView';
import { ROUTES } from '@/config/constants';

export function ChecklistsPage() {
  return (
    <ResourceComingSoonView
      label="Checklists"
      path={ROUTES.checklists}
      previewCopy="Practical, printable checklists for common inventory and warehouse tasks."
    />
  );
}
