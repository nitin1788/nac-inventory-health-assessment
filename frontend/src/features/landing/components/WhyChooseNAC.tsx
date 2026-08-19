import { motion } from 'framer-motion';
import { fadeUpItem, VIEWPORT_ONCE } from '@/shared/motion/variants';
import { WHY_CHOOSE_NAC } from '../landing.data';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';

export function WhyChooseNAC() {
  return (
    <section id="why-nac" className="scroll-mt-20 bg-white py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">Why NAC</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Why Healthcare Businesses Choose NAC
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              16+ years of hands-on experience in inventory and operations, paired with digital
              marketing expertise built specifically for pharmacy and healthcare businesses.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_ONCE}
            variants={fadeUpItem}
            className="overflow-hidden rounded-2xl border border-brand/10 shadow-soft-lg"
          >
            <ResponsiveImage
              src="/images/strategy/nac-healthcare-business-strategy.webp.png"
              alt="NAC consultant presenting a business strategy summary to a healthcare business team"
              width={1536}
              height={1024}
              className="aspect-[4/3] w-full object-cover"
              style={{ objectPosition: 'center 20%' }}
            />
          </motion.div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE_NAC.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT_ONCE}
                variants={fadeUpItem}
                transition={{ delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-soft transition-all hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-soft-lg"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand to-accent transition-transform duration-300 group-hover:scale-x-100"
                />
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark text-white transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
