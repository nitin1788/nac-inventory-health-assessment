import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { BreadcrumbItem } from '@/shared/utils/breadcrumbs';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Visible breadcrumb trail for inner pages — always built from the same
 * item array passed to `buildBreadcrumbJsonLd()`, so what a visitor sees
 * matches the page's `BreadcrumbList` structured data exactly. Never
 * rendered on the homepage (there's nothing to show a trail back from).
 * The last item is the current page — rendered as plain text, not a link.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className={className ?? 'mb-6 text-xs sm:text-sm'}>
      <ol className="flex flex-wrap items-center gap-1.5 text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight aria-hidden className="h-3.5 w-3.5 shrink-0 text-slate-300" />}
              {isLast ? (
                <span aria-current="page" className="truncate font-medium text-slate-700">
                  {item.label}
                </span>
              ) : (
                <Link to={item.path} className="whitespace-nowrap transition-colors hover:text-brand hover:underline">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
