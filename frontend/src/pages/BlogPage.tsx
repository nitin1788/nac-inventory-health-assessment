import { ResourceComingSoonView } from '@/features/resources/ResourceComingSoonView';
import { ROUTES } from '@/config/constants';

export function BlogPage() {
  return (
    <ResourceComingSoonView
      label="Blog"
      path={ROUTES.blog}
      previewCopy="Articles on inventory accuracy, warehouse efficiency, and operations best practices."
    />
  );
}
