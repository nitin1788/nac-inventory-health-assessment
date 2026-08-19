import { Link } from 'react-router-dom';
import { clsx } from '@/shared/utils/clsx';
import { COMPANY_NAME, ROUTES } from '@/config/constants';
import nacLogoIcon from '@/assets/images/nac-logo-icon.png';

interface NavbarLogoProps {
  /** Text color to pair with the surface the logo sits on. */
  theme?: 'light' | 'dark';
}

export function NavbarLogo({ theme = 'dark' }: NavbarLogoProps) {
  return (
    <Link to={ROUTES.landing} className="flex items-center gap-3">
      <img
        src={nacLogoIcon}
        alt={`${COMPANY_NAME} logo`}
        width={743}
        height={358}
        className="h-[42px] w-auto shrink-0"
      />
      <span className="hidden flex-col leading-tight sm:flex">
        <span
          className={clsx(
            'whitespace-nowrap text-sm font-semibold tracking-tight sm:text-base',
            theme === 'light' ? 'text-white' : 'text-slate-900'
          )}
        >
          {COMPANY_NAME}
        </span>
        <span
          className={clsx(
            'whitespace-nowrap text-[10px] font-medium uppercase tracking-wider',
            theme === 'light' ? 'text-white/60' : 'text-slate-500'
          )}
        >
          Operations | Growth | Healthcare
        </span>
      </span>
    </Link>
  );
}
