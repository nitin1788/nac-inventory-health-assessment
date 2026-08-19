import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Stethoscope } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { SectionGlow } from '@/shared/components/SectionGlow';
import { HeroVisualPremium } from './HeroVisualPremium';
import { fadeUp } from '@/shared/motion/variants';
import { ROUTES } from '@/config/constants';
import { buildConsultationWhatsAppUrl } from '@/shared/utils/whatsapp';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-14 sm:pb-20 sm:pt-20">
      <SectionGlow tone="navy" grid />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_0.82fr] lg:gap-12">
          <div className="text-center lg:text-left">
            <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/10 bg-brand-50 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-brand">
                <Stethoscope className="h-3.5 w-3.5 text-accent" />
                Pharmacy, Healthcare &amp; Allied Businesses
              </span>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              custom={0.15}
              variants={fadeUp}
              className="mt-6 text-3xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            >
              Pharmacy &amp; Healthcare Business Growth,{' '}
              <span className="text-accent">Built Around Your Business</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              custom={0.25}
              variants={fadeUp}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0"
            >
              Nitin Anand Consulting helps pharmacies, clinics, hospitals, diagnostic centres and
              allied healthcare businesses improve operations, manage inventory better, build a
              stronger digital presence and attract more customers.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              custom={0.35}
              variants={fadeUp}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:items-start lg:justify-start"
            >
              <Link to={ROUTES.servicesHub} className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Explore Our Services
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href={buildConsultationWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="whatsapp" size="lg" className="w-full gap-1.5 sm:w-auto">
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </Button>
              </a>
            </motion.div>
          </div>

          <HeroVisualPremium />
        </div>
      </div>
    </section>
  );
}
