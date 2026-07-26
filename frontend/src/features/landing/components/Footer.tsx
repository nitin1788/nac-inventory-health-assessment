import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { COMPANY_NAME, CONTACT, ROUTES } from '@/config/constants';
import { SERVICES, NAV_LINKS } from '../landing.data';
import { FooterLogo } from './FooterLogo';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="scroll-mt-20 border-t border-slate-800 bg-[#14233d] py-16 text-white/70">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <FooterLogo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              A free, expert-backed inventory health assessment for manufacturers, distributors, and
              warehouse operators — the starting point for a more efficient inventory operation.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Quick Links</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </a>
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
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {COMPANY_NAME}. All rights reserved.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4" />
              {CONTACT.email}
            </a>
            <a
              href={`tel:${CONTACT.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <Phone className="h-4 w-4" />
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
