import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { clsx } from '@/shared/utils/clsx';
import { Button } from '@/shared/components/Button';
import { ROUTES } from '@/config/constants';
import { NAV_LINKS, RESOURCE_LINKS, SERVICE_CATEGORIES } from '../landing.data';
import { NavbarLogo } from './NavbarLogo';

interface DropdownItem {
  icon: LucideIcon;
  label: string;
  path: string;
  description: string;
}

/** Shared glass panel used by both the Services and Resources dropdowns — identical shape, different data. */
function DropdownPanel({ items, onItemClick }: { items: DropdownItem[]; onItemClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute left-1/2 top-full mt-3 w-[26rem] -translate-x-1/2 rounded-2xl border border-slate-200/60 bg-white/95 p-3 shadow-soft-lg backdrop-blur-lg"
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

/** Desktop plain nav link (Home/About/FAQ/Contact) with the persistent-underline active state. */
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

/** Mobile plain nav row (Home/About/FAQ/Contact) with a background+text active state. */
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
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close whichever desktop dropdown is open on outside click or Escape —
  // standard disclosure-menu behavior so it doesn't stay stuck open.
  useEffect(() => {
    if (!isServicesOpen && !isResourcesOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (isServicesOpen && servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (isResourcesOpen && resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setIsResourcesOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsServicesOpen(false);
      setIsResourcesOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isServicesOpen, isResourcesOpen]);

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
    setIsMobileServicesOpen(false);
    setIsMobileResourcesOpen(false);
  };

  const homeLink = NAV_LINKS.find((link) => link.label === 'Home');
  const trailingLinks = NAV_LINKS.filter((link) => link.label !== 'Home');

  const serviceDropdownItems: DropdownItem[] = SERVICE_CATEGORIES.map((category) => ({
    icon: category.icon,
    label: category.title,
    path: category.path,
    description: category.description,
  }));
  const resourceDropdownItems: DropdownItem[] = RESOURCE_LINKS;

  const isHomeActive = homeLink ? location.pathname === homeLink.href : false;
  const isServicesActive = SERVICE_CATEGORIES.some((category) => category.path === location.pathname);
  const isResourcesActive = RESOURCE_LINKS.some((resource) => resource.path === location.pathname);

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'border-b border-slate-200/60 bg-white/80 shadow-soft backdrop-blur-lg'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <NavbarLogo />

        <div className="hidden items-center gap-8 lg:flex">
          {homeLink ? <DesktopNavLink to={homeLink.href} label={homeLink.label} isActive={isHomeActive} /> : null}

          <div ref={servicesRef} className="relative">
            <div className="flex items-center gap-1">
              <DesktopNavLink to={`${ROUTES.landing}#services`} label="Services" isActive={isServicesActive} />
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
            </div>
            <AnimatePresence>
              {isServicesOpen && (
                <DropdownPanel items={serviceDropdownItems} onItemClick={() => setIsServicesOpen(false)} />
              )}
            </AnimatePresence>
          </div>

          <div ref={resourcesRef} className="relative">
            <button
              type="button"
              onClick={() => setIsResourcesOpen((open) => !open)}
              aria-haspopup="true"
              aria-expanded={isResourcesOpen}
              className={clsx(
                'group relative flex items-center gap-1 text-sm font-medium transition-colors',
                isResourcesActive ? 'text-brand' : 'text-slate-600 hover:text-brand'
              )}
            >
              Resources
              <ChevronDown
                className={clsx('h-3.5 w-3.5 transition-transform duration-200', isResourcesOpen && 'rotate-180')}
              />
              <span
                className={clsx(
                  'absolute -bottom-1 left-0 h-px w-[calc(100%-1.125rem)] origin-left bg-gradient-to-r from-brand to-accent transition-transform duration-300',
                  isResourcesActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                )}
              />
            </button>
            <AnimatePresence>
              {isResourcesOpen && (
                <DropdownPanel items={resourceDropdownItems} onItemClick={() => setIsResourcesOpen(false)} />
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

        <div className="hidden lg:block">
          <Link to={ROUTES.assessmentStart}>
            <Button variant="primary">Start Free Assessment</Button>
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
                      {SERVICE_CATEGORIES.map((category) => {
                        const Icon = category.icon;
                        return (
                          <Link
                            key={category.slug}
                            to={category.path}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark text-white">
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            {category.title}
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setIsMobileResourcesOpen((open) => !open)}
                  aria-expanded={isMobileResourcesOpen}
                  className={clsx(
                    'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium',
                    isResourcesActive ? 'bg-brand-50 text-brand' : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  Resources
                  <ChevronDown
                    className={clsx(
                      'h-4 w-4 transition-transform duration-200',
                      isMobileResourcesOpen && 'rotate-180'
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isMobileResourcesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden pl-2"
                    >
                      {RESOURCE_LINKS.map((resource) => {
                        const Icon = resource.icon;
                        return (
                          <Link
                            key={resource.path}
                            to={resource.path}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark text-white">
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            {resource.label}
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

              <Link to={ROUTES.assessmentStart} onClick={closeMobileMenu} className="mt-2">
                <Button variant="primary" className="w-full">
                  Start Free Assessment
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
