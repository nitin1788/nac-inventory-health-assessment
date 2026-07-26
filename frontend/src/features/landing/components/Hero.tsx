import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { ROUTES } from '@/config/constants';

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
    <section className="relative overflow-hidden bg-gradient-to-b from-ink-900 via-ink-800 to-brand-dark pb-24 pt-40 text-white sm:pb-32 sm:pt-48">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,90,128,0.35),_transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <motion.div
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-white/90"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent-light" />
          Free 52-Question Inventory Diagnostic
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          custom={0.1}
          variants={fadeUp}
          className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Know Exactly Where Your Inventory Operations Stand
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          custom={0.2}
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-200"
        >
          Answer 52 targeted questions and get a scored, expert-backed report — with clear
          recommendations — delivered to your inbox in minutes. Built by Nitin Anand Consulting for
          manufacturers, distributors, and warehouse operators.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          custom={0.3}
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link to={ROUTES.assessmentStart}>
            <Button variant="inverse" size="lg">
              Start Free Assessment
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#services">
            <Button variant="outline" size="lg">
              Explore Our Services
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
