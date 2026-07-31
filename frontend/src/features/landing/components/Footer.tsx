import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { COMPANY_NAME, CONTACT, ROUTES } from '@/config/constants';
import { SERVICES } from '../landing.data';
import { FooterLogo } from './FooterLogo';

const FOOTER_QUICK_LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'Why NAC', href: '/#why-nac' },
  { label: 'How It Works', href: '/#how-it-works' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative scroll-mt-20 bg-[#14233d] py-20 text-white/70">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-light to-transparent"
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <FooterLogo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Helping businesses optimize inventory, warehouse operations, and business processes
              through expert consulting, audits, SOP development, analytics, and implementation
              support. Start with a FREE Inventory Health Assessment.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Quick Links</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to={ROUTES.assessmentStart} className="transition-colors hover:text-white">
                  Start Free Assessment
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Services</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {SERVICES.map((service) => (
                <li key={service.title}>{service.title}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Company</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link to={ROUTES.about} className="transition-colors hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to={ROUTES.faq} className="transition-colors hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to={ROUTES.contactUs} className="transition-colors hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to={ROUTES.privacyPolicy} className="transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to={ROUTES.termsAndConditions} className="transition-colors hover:text-white">
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
