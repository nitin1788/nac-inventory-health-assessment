import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { CONSULTATION, ROUTES } from '@/config/constants';
import { buildConsultationWhatsAppUrl } from '@/shared/utils/whatsapp';
import { SERVICE_CATEGORIES } from '../landing.data';

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">Services</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything You Need for Healthier Inventory
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            From a free diagnostic to hands-on process redesign — services built around real
            manufacturing, distribution, and warehouse operations.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link
                  to={category.path}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-xl"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{category.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{category.description}</p>

                  <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5">
                    {category.services.map((service) => (
                      <li key={service} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>

                  <span className="mt-5 inline-flex items-center gap-1 border-t border-slate-100 pt-5 text-sm font-medium text-brand">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to={ROUTES.assessmentStart} className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Start Free Inventory Health Assessment
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
        </div>
      </div>
    </section>
  );
}
