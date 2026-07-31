import { Link } from 'react-router-dom';
import { COMPANY_NAME, ROUTES } from '@/config/constants';
import nacLogoFull from '@/assets/images/nac-logo-full.png';

/**
 * Full lockup (icon + wordmark) for the footer — already carries the
 * company name, so unlike NavbarLogo it isn't paired with adjacent text.
 * Shown on a white card since the artwork is navy/gold and would
 * otherwise disappear against the dark navy footer background.
 */
export function FooterLogo() {
  return (
    <Link to={ROUTES.landing} className="inline-block w-[180px] rounded-xl bg-white p-4 shadow-md">
      <img
        src={nacLogoFull}
        alt={`${COMPANY_NAME} logo`}
        width={1043}
        height={587}
        loading="lazy"
        decoding="async"
        className="h-16 w-full object-contain"
      />
    </Link>
  );
}
