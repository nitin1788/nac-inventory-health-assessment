import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { SectionGlow } from '@/shared/components/SectionGlow';
import { fadeUp } from '@/shared/motion/variants';
import { COMPANY_NAME, CONSULTATION, ROUTES } from '@/config/constants';
import { buildConsultationWhatsAppUrl } from '@/shared/utils/whatsapp';
import { TRUST_PILLARS } from '../landing.data';
import nacLogoIcon from '@/assets/images/nac-logo-icon.png';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-24 pt-40 sm:pb-32 sm:pt-48">
      <SectionGlow tone="navy" grid />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-mesh-gold blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <motion.img
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          src={nacLogoIcon}
          alt={`${COMPANY_NAME} logo`}
          width={743}
          height={358}
          fetchPriority="high"
          className="mx-auto h-16 w-auto sm:h-20"
        />

        <motion.div
          initial="hidden"
          animate="show"
          custom={0.1}
          variants={fadeUp}
          className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-brand/10 bg-brand-50 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-brand"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent-dark" />
          Free 52-Question Inventory Diagnostic
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          custom={0.15}
          variants={fadeUp}
          aria-hidden
          className="mx-auto mt-6 h-1 w-14 rounded-full bg-accent"
        />

        <motion.h1
          initial="hidden"
          animate="show"
          custom={0.2}
          variants={fadeUp}
          className="mt-6 text-4xl font-bold leading-[1.08] tracking-tighter text-slate-900 sm:text-5xl lg:text-7xl"
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
          custom={0.3}
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600"
        >
          A free, expert-backed diagnostic that scores your inventory, warehouse, and process
          health — then points you toward the specific consulting, audit, or SOP work that will
          move the needle. Built by Nitin Anand Consulting for manufacturers, distributors, and
          warehouse operators.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          custom={0.4}
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
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
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              {CONSULTATION.ctaLabel}
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          custom={0.5}
          variants={fadeUp}
          className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-3"
        >
          {TRUST_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <span
                key={pillar.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-xs font-medium text-slate-700 shadow-soft backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5 text-brand" />
                {pillar.label}
              </span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
