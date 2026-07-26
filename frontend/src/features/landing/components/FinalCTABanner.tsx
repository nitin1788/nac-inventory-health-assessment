import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { ROUTES } from '@/config/constants';

export function FinalCTABanner() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-brand px-8 py-14 text-center sm:px-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to See How Your Inventory Operations Measure Up?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/70">
            Takes about 10 minutes. Your scored report and recommendations arrive by email —
            completely free, completely confidential.
          </p>
          <div className="mt-8">
            <Link to={ROUTES.assessmentStart}>
              <Button variant="inverse" size="lg">
                Start Free Assessment
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
