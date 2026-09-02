import { ResourceComingSoonView } from '@/features/resources/ResourceComingSoonView';
import { ROUTES } from '@/config/constants';

export function CaseStudiesPage() {
  return (
    <ResourceComingSoonView
      label="Case Studies"
      path={ROUTES.caseStudies}
      previewCopy="Real engagement outcomes across pharmacy, healthcare, and allied businesses."
    />
  );
}
