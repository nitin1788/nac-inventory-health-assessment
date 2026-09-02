import { SITE_URL } from '@/config/constants';

export interface BreadcrumbItem {
  label: string;
  /** Route path, e.g. "/services". The last item's path is the current page — rendered as plain text, not a link, by <Breadcrumbs>. */
  path: string;
}

/**
 * Builds a `BreadcrumbList` JSON-LD object from the exact same item array
 * passed to `<Breadcrumbs>`, so the visible trail and the structured data
 * can never drift apart — one array, two renderers.
 */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
