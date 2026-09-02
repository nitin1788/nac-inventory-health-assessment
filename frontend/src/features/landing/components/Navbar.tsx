import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { ChevronDown, Menu, X, ArrowRight, MessageCircle } from 'lucide-react';
import { clsx } from '@/shared/utils/clsx';
import { Button } from '@/shared/components/Button';
import { ROUTES } from '@/config/constants';
import { buildConsultationWhatsAppUrl } from '@/shared/utils/whatsapp';
import { INVENTORY_SERVICES } from '@/config/services.inventory.data';
import { DIGITAL_SERVICES } from '@/config/services.digital.data';
import { INDUSTRIES_LIST } from '@/config/industries.data';
import { NAV_LINKS } from '../landing.data';
import { NavbarLogo } from './NavbarLogo';
import { TopUtilityBar } from './TopUtilityBar';

interface DropdownItem {
  icon: LucideIcon;
  label: string;
  path: string;
  description: string;
}

function bySlug<T extends { slug: string }>(items: T[], slugs: string[]): T[] {
  return slugs.map((slug) => items.find((item) => item.slug === slug)).filter((item): item is T => Boolean(item));
}

/** A curated, flagship subset of each vertical's full service list — the full list lives on each hub page. */
const FEATURED_INVENTORY_SERVICES = bySlug(INVENTORY_SERVICES, [
  'inventory-audit',
  'abc-analysis',
  'expiry-near-expiry-analysis',
  'stock-optimization',
  'sop-development',
]);
const FEATURED_DIGITAL_SERVICES = bySlug(DIGITAL_SERVICES, [
  'website-development',
  'seo',
  'local-seo',
  'google-ads',
  'social-media-management',
]);

const industryDropdownItems: DropdownItem[] = INDUSTRIES_LIST.map((industry) => ({
  icon: industry.icon,
  label: industry.name,
  path: industry.path,
  description: industry.description,
}));

/** Shared glass panel used by the Industries dropdown — a flat grid of items. */
function DropdownPanel({ items, onItemClick }: { items: DropdownItem[]; onItemClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute left-1/2 top-full mt-3 w-[30rem] -translate-x-1/2 rounded-2xl border border-slate-200/60 bg-white/95 p-3 shadow-soft-lg backdrop-blur-lg"
    >
      <div className="grid grid-cols-2 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className="flex items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-slate-50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark text-white">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">{item.description}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

/**
 * Two-column mega menu for Services — Inventory & Operations Consulting
 * and Digital Marketing & Growth rendered as two clearly separate
 * groups, each with its own heading, accent, and "View all" link to its
 * hub page. Deliberately never merges the two verticals into one list.
 */
function ServicesMegaMenu({ onItemClick }: { onItemClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute left-1/2 top-full mt-3 w-[42rem] -translate-x-1/2 rounded-2xl border border-slate-200/60 bg-white/95 p-4 shadow-soft-lg backdrop-blur-lg"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-brand/10 bg-brand-50/40 p-3">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-brand">
            Inventory &amp; Operations Consulting
          </p>
          <div className="mt-1">
            {FEATURED_INVENTORY_SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.path}
                  to={service.path}
                  onClick={onItemClick}
                  className="flex items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-white"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-slate-800">{service.title}</span>
                </Link>
              );
            })}
          </div>
          <Link
            to={ROUTES.inventoryHub}
            onClick={onItemClick}
            className="mt-1 flex items-center gap-1 rounded-lg p-2 text-xs font-semibold text-brand hover:underline"
          >
            View all Inventory &amp; Operations services
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="rounded-xl border border-accent/20 bg-accent/5 p-3">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-accent-dark">
            Digital Marketing & Growth
          </p>
          <div className="mt-1">
            {FEATURED_DIGITAL_SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.path}
                  to={service.path}
                  onClick={onItemClick}
                  className="flex items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-white"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-dark to-accent text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-slate-800">{service.title}</span>
                </Link>
              );
            })}
          </div>
          <Link
            to={ROUTES.digitalMarketingHub}
            onClick={onItemClick}
            className="mt-1 flex items-center gap-1 rounded-lg p-2 text-xs font-semibold text-accent-dark hover:underline"
          >
            View all Digital Marketing services
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/** Desktop plain nav link (Home/About/Insights/Contact) with the persistent-underline active state. */
function DesktopNavLink({ to, label, isActive }: { to: string; label: string; isActive: boolean }) {
  return (
    <Link
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'group relative text-sm font-medium transition-colors',
        isActive ? 'text-brand' : 'text-slate-600 hover:text-brand'
      )}
    >
      {label}
      <span
        className={clsx(
          'absolute -bottom-1 left-0 h-px w-full origin-left bg-gradient-to-r from-brand to-accent transition-transform duration-300',
          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        )}
      />
    </Link>
  );
}

/** Mobile plain nav row (Home/About/Insights/Contact) with a background+text active state. */
function MobileNavLink({
  to,
  label,
  isActive,
  onClick,
}: {
  to: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'rounded-md px-3 py-2 text-sm font-medium',
        isActive ? 'bg-brand-50 text-brand' : 'text-slate-700 hover:bg-slate-50'
      )}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isIndustriesOpen, setIsIndustriesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobileIndustriesOpen, setIsMobileIndustriesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const industriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close whichever desktop dropdown is open on outside click or Escape —
  // standard disclosure-menu behavior so it doesn't stay stuck open.
  useEffect(() => {
    if (!isServicesOpen && !isIndustriesOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (isServicesOpen && servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (isIndustriesOpen && industriesRef.current && !industriesRef.current.contains(event.target as Node)) {
        setIsIndustriesOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsServicesOpen(false);
      setIsIndustriesOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isServicesOpen, isIndustriesOpen]);

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
    setIsMobileServicesOpen(false);
    setIsMobileIndustriesOpen(false);
  };

  const homeLink = NAV_LINKS.find((link) => link.label === 'Home');
  const aboutLink = NAV_LINKS.find((link) => link.label === 'About');
  const trailingLinks = NAV_LINKS.filter((link) => link.label !== 'Home' && link.label !== 'About');

  const isHomeActive = homeLink ? location.pathname === homeLink.href : false;
  const isAboutActive = aboutLink ? location.pathname === aboutLink.href : false;
  const isServicesActive =
    location.pathname.startsWith(ROUTES.servicesHub) ||
    location.pathname.startsWith(ROUTES.inventoryHub) ||
    location.pathname.startsWith(ROUTES.digitalMarketingHub);
  const isIndustriesActive = location.pathname.startsWith(ROUTES.industriesHub);

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'border-b border-slate-200/60 bg-white/80 shadow-soft backdrop-blur-lg'
          : 'border-b border-transparent bg-white'
      )}
    >
      <TopUtilityBar />
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <NavbarLogo />

        <div className="hidden items-center gap-8 lg:flex">
          {homeLink ? <DesktopNavLink to={homeLink.href} label={homeLink.label} isActive={isHomeActive} /> : null}
          {aboutLink ? <DesktopNavLink to={aboutLink.href} label={aboutLink.label} isActive={isAboutActive} /> : null}

          <div ref={servicesRef} className="relative flex items-center gap-1">
            <DesktopNavLink to={ROUTES.servicesHub} label="Services" isActive={isServicesActive} />
            <button
              type="button"
              onClick={() => setIsServicesOpen((open) => !open)}
              aria-haspopup="true"
              aria-expanded={isServicesOpen}
              aria-label="Toggle services menu"
              className="rounded p-0.5 text-slate-400 transition-colors hover:text-brand"
            >
              <ChevronDown
                className={clsx('h-3.5 w-3.5 transition-transform duration-200', isServicesOpen && 'rotate-180')}
              />
            </button>
            <AnimatePresence>
              {isServicesOpen && <ServicesMegaMenu onItemClick={() => setIsServicesOpen(false)} />}
            </AnimatePresence>
          </div>

          <div ref={industriesRef} className="relative">
            <button
              type="button"
              onClick={() => setIsIndustriesOpen((open) => !open)}
              aria-haspopup="true"
              aria-expanded={isIndustriesOpen}
              className={clsx(
                'group relative flex items-center gap-1 text-sm font-medium transition-colors',
                isIndustriesActive ? 'text-brand' : 'text-slate-600 hover:text-brand'
              )}
            >
              Industries
              <ChevronDown
                className={clsx('h-3.5 w-3.5 transition-transform duration-200', isIndustriesOpen && 'rotate-180')}
              />
              <span
                className={clsx(
                  'absolute -bottom-1 left-0 h-px w-[calc(100%-1.125rem)] origin-left bg-gradient-to-r from-brand to-accent transition-transform duration-300',
                  isIndustriesActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                )}
              />
            </button>
            <AnimatePresence>
              {isIndustriesOpen && (
                <DropdownPanel items={industryDropdownItems} onItemClick={() => setIsIndustriesOpen(false)} />
              )}
            </AnimatePresence>
          </div>

          {trailingLinks.map((link) => (
            <DesktopNavLink
              key={link.href}
              to={link.href}
              label={link.label}
              isActive={location.pathname === link.href}
            />
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={buildConsultationWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
          >
            <Button variant="whatsapp" className="gap-1.5 px-3">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden xl:inline">Chat on WhatsApp</span>
            </Button>
          </a>
          <Link to={ROUTES.contactUs}>
            <Button variant="primary">Book a Consultation</Button>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen((open) => !open)}
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-900 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-slate-200/60 bg-white/95 shadow-soft backdrop-blur-lg lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {homeLink ? (
                <MobileNavLink
                  to={homeLink.href}
                  label={homeLink.label}
                  isActive={isHomeActive}
                  onClick={closeMobileMenu}
                />
              ) : null}
              {aboutLink ? (
                <MobileNavLink
                  to={aboutLink.href}
                  label={aboutLink.label}
                  isActive={isAboutActive}
                  onClick={closeMobileMenu}
                />
              ) : null}

              <div>
                <button
                  type="button"
                  onClick={() => setIsMobileServicesOpen((open) => !open)}
                  aria-expanded={isMobileServicesOpen}
                  className={clsx(
                    'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium',
                    isServicesActive ? 'bg-brand-50 text-brand' : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  Services
                  <ChevronDown
                    className={clsx(
                      'h-4 w-4 transition-transform duration-200',
                      isMobileServicesOpen && 'rotate-180'
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isMobileServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden pl-2"
                    >
                      <Link
                        to={ROUTES.servicesHub}
                        onClick={closeMobileMenu}
                        className="block px-3 py-2 text-sm font-semibold text-slate-800"
                      >
                        All Services
                      </Link>
                      <p className="mt-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-brand">
                        Inventory &amp; Operations Consulting
                      </p>
                      {FEATURED_INVENTORY_SERVICES.map((service) => {
                        const Icon = service.icon;
                        return (
                          <Link
                            key={service.path}
                            to={service.path}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark text-white">
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            {service.title}
                          </Link>
                        );
                      })}
                      <Link
                        to={ROUTES.inventoryHub}
                        onClick={closeMobileMenu}
                        className="block px-3 py-2 text-xs font-semibold text-brand"
                      >
                        View all Inventory &amp; Operations services &rarr;
                      </Link>

                      <p className="mt-3 px-3 text-[11px] font-semibold uppercase tracking-wide text-accent-dark">
                        Digital Marketing & Growth
                      </p>
                      {FEATURED_DIGITAL_SERVICES.map((service) => {
                        const Icon = service.icon;
                        return (
                          <Link
                            key={service.path}
                            to={service.path}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-dark to-accent text-white">
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            {service.title}
                          </Link>
                        );
                      })}
                      <Link
                        to={ROUTES.digitalMarketingHub}
                        onClick={closeMobileMenu}
                        className="block px-3 py-2 text-xs font-semibold text-accent-dark"
                      >
                        View all Digital Marketing services &rarr;
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setIsMobileIndustriesOpen((open) => !open)}
                  aria-expanded={isMobileIndustriesOpen}
                  className={clsx(
                    'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium',
                    isIndustriesActive ? 'bg-brand-50 text-brand' : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  Industries
                  <ChevronDown
                    className={clsx(
                      'h-4 w-4 transition-transform duration-200',
                      isMobileIndustriesOpen && 'rotate-180'
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isMobileIndustriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden pl-2"
                    >
                      {INDUSTRIES_LIST.map((industry) => {
                        const Icon = industry.icon;
                        return (
                          <Link
                            key={industry.slug}
                            to={industry.path}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark text-white">
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            {industry.name}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {trailingLinks.map((link) => (
                <MobileNavLink
                  key={link.href}
                  to={link.href}
                  label={link.label}
                  isActive={location.pathname === link.href}
                  onClick={closeMobileMenu}
                />
              ))}

              <a
                href={buildConsultationWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="mt-2"
              >
                <Button variant="whatsapp" className="w-full gap-1.5">
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </Button>
              </a>
              <Link to={ROUTES.contactUs} onClick={closeMobileMenu}>
                <Button variant="primary" className="w-full">
                  Book a Consultation
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
