import type { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}

/**
 * Wraps every top-level page with consistent structure. Kept
 * deliberately minimal in Milestone 3 — header/footer/nav are built
 * out with the landing page in a later milestone.
 */
export function PageLayout({ children }: PageLayoutProps) {
  return <div className="min-h-screen bg-white text-slate-900">{children}</div>;
}
