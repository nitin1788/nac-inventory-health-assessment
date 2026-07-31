import { ResourceComingSoonView } from '@/features/resources/ResourceComingSoonView';
import { ROUTES } from '@/config/constants';

export function FreeDownloadsPage() {
  return (
    <ResourceComingSoonView
      label="Free Downloads"
      path={ROUTES.freeDownloads}
      previewCopy="Free tools and guides to help you improve inventory and warehouse operations on your own."
    />
  );
}
