import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { CONSULTATION, ROUTES } from '@/config/constants';
import { buildConsultationWhatsAppUrl } from '@/shared/utils/whatsapp';

export function FinalCTABanner() {
  return (
    <section className="relative overflow-hidden bg-mesh-brand py-20 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.06),_transparent_65%)]"
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Improve Your Inventory Operations?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
            Start with a free, 10-minute diagnostic, or talk to a consultant directly — either way,
            your next step is clear and completely confidential.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to={ROUTES.assessmentStart} className="w-full sm:w-auto">
              <Button variant="inverse" size="lg" className="w-full sm:w-auto">
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
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {CONSULTATION.ctaLabel}
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
