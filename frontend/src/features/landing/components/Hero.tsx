import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, ListChecks, ShieldCheck, Sparkles, Zap, type LucideIcon } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { SectionGlow } from '@/shared/components/SectionGlow';
import { HeroVisual } from './HeroVisual';
import { fadeUp } from '@/shared/motion/variants';
import { useCountUp } from '@/shared/hooks/useCountUp';
import { COMPANY_NAME, ROUTES } from '@/config/constants';
import { buildConsultationWhatsAppUrl } from '@/shared/utils/whatsapp';
import nacLogoIcon from '@/assets/images/nac-logo-icon.png';

function TrustBadge({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-xs font-medium text-slate-700 shadow-soft backdrop-blur-sm">
      <Icon className="h-3.5 w-3.5 text-brand" />
      {children}
    </span>
  );
}

export function Hero() {
  const years = useCountUp(16, 1400, true);
  const questions = useCountUp(52, 1400, true);
  const confidential = useCountUp(100, 1400, true);

  return (
    <section className="relative overflow-hidden bg-white pb-20 pt-36 sm:pb-28 sm:pt-44">
      <SectionGlow tone="navy" grid />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12">
          <div className="text-center lg:text-left">
            <motion.div
              initial="hidden"
              animate="show"
              custom={0}
              variants={fadeUp}
              className="flex items-center justify-center gap-3 lg:justify-start"
            >
              <img
                src={nacLogoIcon}
                alt={`${COMPANY_NAME} logo`}
                width={743}
                height={358}
                fetchPriority="high"
                className="h-8 w-auto"
              />
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/10 bg-brand-50 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-brand">
                <Sparkles className="h-3.5 w-3.5 text-accent-dark" />
                Free 52-Question Diagnostic
              </span>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              custom={0.15}
              variants={fadeUp}
              className="mt-8 text-3xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            >
              Know Exactly Where Your{' '}
              <span className="bg-gradient-to-r from-brand to-accent-dark bg-clip-text text-transparent">
                Inventory Operations
              </span>{' '}
              Stand
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              custom={0.25}
              variants={fadeUp}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0"
            >
              A free, expert-backed diagnostic that scores your inventory, warehouse, and process
              health — then points you toward the specific consulting, audit, or SOP work that
              will move the needle. Built by Nitin Anand Consulting for manufacturers,
              distributors, and warehouse operators.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              custom={0.35}
              variants={fadeUp}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:items-start lg:justify-start"
            >
              <Link to={ROUTES.assessmentStart} className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Free Assessment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href={buildConsultationWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Book Consultation
                </Button>
              </a>
            </motion.div>

            <motion.p
              initial="hidden"
              animate="show"
              custom={0.4}
              variants={fadeUp}
              className="mt-4 text-xs font-medium text-slate-500"
            >
              No credit card required &bull; Takes about 10 minutes &bull; Secure &amp; Confidential
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              custom={0.5}
              variants={fadeUp}
              className="mx-auto mt-10 flex max-w-xl flex-wrap items-center justify-center gap-3 lg:mx-0 lg:justify-start"
            >
              <TrustBadge icon={Award}>{years}+ Years Experience</TrustBadge>
              <TrustBadge icon={ListChecks}>{questions}-Question Assessment</TrustBadge>
              <TrustBadge icon={ShieldCheck}>{confidential}% Free &amp; Confidential</TrustBadge>
              <TrustBadge icon={Zap}>Fast Professional Review</TrustBadge>
            </motion.div>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
