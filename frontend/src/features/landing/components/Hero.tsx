import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { COMPANY_NAME, CONSULTATION, ROUTES } from '@/config/constants';
import { buildConsultationWhatsAppUrl } from '@/shared/utils/whatsapp';
import nacLogoIcon from '@/assets/images/nac-logo-icon.png';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-24 pt-40 sm:pb-32 sm:pt-48">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(15,42,82,0.06),_transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(#0F2A52_1px,transparent_1px),linear-gradient(90deg,#0F2A52_1px,transparent_1px)] [background-size:56px_56px]"
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
          className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
        >
          Know Exactly Where Your Inventory Operations Stand
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
      </div>
    </section>
  );
}
