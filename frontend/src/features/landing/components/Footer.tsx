import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { COMPANY_NAME, CONTACT, ROUTES } from '@/config/constants';
import { RESOURCE_LINKS } from '../landing.data';
import { FooterLogo } from './FooterLogo';

const FOOTER_LINK_CLASSES =
  'rounded-sm transition-colors hover:text-white active:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark';

/** A compact, representative subset of the full industries list — the full list lives at /industries. */
const FOOTER_INDUSTRIES = [
  { label: 'Retail Pharmacy', path: '/industries/retail-pharmacy' },
  { label: 'Hospital Pharmacy', path: '/industries/hospital-pharmacy' },
  { label: 'Medical Stores', path: '/industries/medical-stores' },
  { label: 'Clinics', path: '/industries/clinics' },
  { label: 'Hospitals', path: '/industries/hospitals' },
  { label: 'Diagnostic Centres', path: '/industries/diagnostic-centres' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative scroll-mt-20 bg-brand-dark py-16 text-white/70 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-light to-transparent"
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-7">
          <div className="sm:col-span-2 lg:col-span-2">
            <FooterLogo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Specialist consulting for pharmacy, healthcare, and allied businesses — Inventory &amp;
              Operations Consulting and Digital Marketing &amp; Growth, from a single partner who
              understands both.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Services</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link to={ROUTES.inventoryHub} className={FOOTER_LINK_CLASSES}>
                  Inventory &amp; Operations Consulting
                </Link>
              </li>
              <li>
                <Link to={ROUTES.digitalMarketingHub} className={FOOTER_LINK_CLASSES}>
                  Digital Marketing &amp; Growth
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Industries</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {FOOTER_INDUSTRIES.map((industry) => (
                <li key={industry.path}>
                  <Link to={industry.path} className={FOOTER_LINK_CLASSES}>
                    {industry.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Company</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link to={ROUTES.about} className={FOOTER_LINK_CLASSES}>
                  About
                </Link>
              </li>
              <li>
                <Link to={ROUTES.blog} className={FOOTER_LINK_CLASSES}>
                  Insights
                </Link>
              </li>
              <li>
                <Link to={ROUTES.contactUs} className={FOOTER_LINK_CLASSES}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Resources</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {RESOURCE_LINKS.filter((resource) => resource.path !== ROUTES.blog).map((resource) => (
                <li key={resource.path}>
                  <Link to={resource.path} className={FOOTER_LINK_CLASSES}>
                    {resource.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link to={ROUTES.privacyPolicy} className={FOOTER_LINK_CLASSES}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to={ROUTES.termsAndConditions} className={FOOTER_LINK_CLASSES}>
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">Get in Touch</p>
          <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-8">
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-3 transition-colors hover:text-white"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                <Mail className="h-4 w-4" />
              </span>
              {CONTACT.email}
            </a>
            <a
              href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-3 transition-colors hover:text-white"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                <Phone className="h-4 w-4" />
              </span>
              {CONTACT.phone}
            </a>
          </div>

          <p className="mt-8 border-t border-white/10 pt-6 text-sm">
            &copy; {year} {COMPANY_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
