import { ResourceComingSoonView } from '@/features/resources/ResourceComingSoonView';
import { ROUTES } from '@/config/constants';

export function FreeDownloadsPage() {
  return (
    <ResourceComingSoonView
      label="Free Downloads"
      path={ROUTES.freeDownloads}
      previewCopy="Free tools and guides to help pharmacy and healthcare businesses improve inventory, operations, and digital marketing on their own."
    />
  );
}
