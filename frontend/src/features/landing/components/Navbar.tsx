import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { clsx } from '@/shared/utils/clsx';
import { Button } from '@/shared/components/Button';
import { ROUTES } from '@/config/constants';
import { NAV_LINKS, SERVICE_CATEGORIES } from '../landing.data';
import { NavbarLogo } from './NavbarLogo';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the desktop dropdown on outside click or Escape — standard
  // disclosure-menu behavior so it doesn't stay stuck open while
  // browsing the rest of the page.
  useEffect(() => {
    if (!isServicesOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsServicesOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isServicesOpen]);

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
    setIsMobileServicesOpen(false);
  };

  const servicesLink = NAV_LINKS.find((link) => link.label === 'Services');
  const otherNavLinks = NAV_LINKS.filter((link) => link.label !== 'Services');

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
          {servicesLink ? (
            <div ref={servicesRef} className="relative">
              <div className="flex items-center gap-1">
                <Link
                  to={servicesLink.href}
                  className="group relative text-sm font-medium text-slate-600 transition-colors hover:text-brand"
                >
                  {servicesLink.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-brand to-accent transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
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
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute left-1/2 top-full mt-3 w-[26rem] -translate-x-1/2 rounded-2xl border border-slate-200/60 bg-white/95 p-3 shadow-soft-lg backdrop-blur-lg"
                  >
                    <div className="grid grid-cols-2 gap-1">
                      {SERVICE_CATEGORIES.map((category) => {
                        const Icon = category.icon;
                        return (
                          <Link
                            key={category.slug}
                            to={category.path}
                            onClick={() => setIsServicesOpen(false)}
                            className="flex items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-slate-50"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-dark text-white">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-slate-900">{category.title}</span>
                              <span className="mt-0.5 block truncate text-xs text-slate-500">
                                {category.description}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}

          {otherNavLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="group relative text-sm font-medium text-slate-600 transition-colors hover:text-brand"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-brand to-accent transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
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
              <div>
                <button
                  type="button"
                  onClick={() => setIsMobileServicesOpen((open) => !open)}
                  aria-expanded={isMobileServicesOpen}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Services
                  <ChevronDown
                    className={clsx('h-4 w-4 transition-transform duration-200', isMobileServicesOpen && 'rotate-180')}
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

              {otherNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeMobileMenu}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {link.label}
                </Link>
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
