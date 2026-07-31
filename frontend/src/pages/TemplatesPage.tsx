import { ResourceComingSoonView } from '@/features/resources/ResourceComingSoonView';
import { ROUTES } from '@/config/constants';

export function TemplatesPage() {
  return (
    <ResourceComingSoonView
      label="Templates"
      path={ROUTES.templates}
      previewCopy="Ready-to-use spreadsheet and document templates for inventory and warehouse management."
    />
  );
}
