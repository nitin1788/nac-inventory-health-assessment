import { Link } from 'react-router-dom';
import { MarketingPageLayout } from '@/shared/layouts/MarketingPageLayout';
import { Button } from '@/shared/components/Button';
import { COMPANY_NAME, ROUTES } from '@/config/constants';

interface ResourceComingSoonViewProps {
  label: string;
  path: string;
  /** One sentence describing what this resource will contain once published. */
  previewCopy: string;
}

/**
 * Shared template for Resources dropdown entries that don't have real
 * content yet (Blog, Case Studies, etc.). Keeps the route and nav
 * entry live and indexable-when-ready — see MarketingPageLayout's
 * `noindex` prop, set true here since there's no real content yet.
 */
export function ResourceComingSoonView({ label, path, previewCopy }: ResourceComingSoonViewProps) {
  return (
    <MarketingPageLayout
      title={`${label} | ${COMPANY_NAME}`}
      description={`${previewCopy} Coming soon from ${COMPANY_NAME}.`}
      path={path}
      eyebrow="Resources"
      heading={label}
      noindex
    >
      <p>{previewCopy}</p>
      <p>
        We&apos;re building this out — check back soon. In the meantime, the free Inventory Health
        Assessment is the fastest way to get a scored, actionable read on your own operation.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link to={ROUTES.assessmentStart} className="w-full sm:w-auto">
          <Button variant="primary" className="w-full sm:w-auto">
            Start Free Assessment
          </Button>
        </Link>
        <Link to={ROUTES.contactUs} className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto">
            Contact Us
          </Button>
        </Link>
      </div>
    </MarketingPageLayout>
  );
}
