import { Link } from 'react-router-dom';
import { COMPANY_NAME, ROUTES } from '@/config/constants';
import nacLogoFull from '@/assets/images/nac-logo-full.png';

/**
 * Full lockup (icon + wordmark) for the footer — already carries the
 * company name, so unlike NavbarLogo it isn't paired with adjacent text.
 */
export function FooterLogo() {
  return (
    <Link to={ROUTES.landing} className="inline-block">
      <img src={nacLogoFull} alt={`${COMPANY_NAME} logo`} className="h-auto w-[200px] max-w-full" />
    </Link>
  );
}
