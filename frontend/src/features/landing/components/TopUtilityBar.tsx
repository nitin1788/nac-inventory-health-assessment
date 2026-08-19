import { Mail, Phone } from 'lucide-react';
import { CONTACT } from '@/config/constants';

/**
 * Thin utility bar above the main navigation — direct contact details
 * and a short positioning statement. Collapses away as soon as the page
 * scrolls (see Navbar.tsx's `isScrolled` state) so the sticky header
 * stays compact once a visitor starts reading.
 */
export function TopUtilityBar() {
  return (
    <div className="hidden border-b border-white/10 bg-brand-dark py-2 text-white/80 lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-xs lg:px-8">
        <div className="flex items-center gap-6">
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <Mail className="h-3.5 w-3.5" />
            {CONTACT.email}
          </a>
          <a
            href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <Phone className="h-3.5 w-3.5" />
            {CONTACT.phone}
          </a>
        </div>
        <p className="font-medium">Helping Pharmacy &amp; Healthcare Businesses Operate Better &amp; Grow Faster</p>
      </div>
    </div>
  );
}
