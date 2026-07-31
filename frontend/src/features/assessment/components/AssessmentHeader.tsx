import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { COMPANY_NAME, ROUTES } from '@/config/constants';
import nacLogoIcon from '@/assets/images/nac-logo-icon.png';

/** Minimal brand header for the assessment flow — not the full marketing navbar. */
export function AssessmentHeader() {
  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to={ROUTES.landing} className="flex items-center gap-3">
          <img src={nacLogoIcon} alt={`${COMPANY_NAME} logo`} width={743} height={358} className="h-9 w-auto" />
          <span className="hidden text-sm font-semibold tracking-tight text-slate-900 sm:inline">
            {COMPANY_NAME}
          </span>
        </Link>
        <Link
          to={ROUTES.landing}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </header>
  );
}
