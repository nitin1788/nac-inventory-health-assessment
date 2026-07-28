import { MarketingPageLayout } from '@/shared/layouts/MarketingPageLayout';
import { SERVICES, WHY_CHOOSE_NAC, TRUST_STATS, INDUSTRIES } from '@/features/landing/landing.data';
import { COMPANY_NAME } from '@/config/constants';

export function AboutPage() {
  return (
    <MarketingPageLayout
      title={`About Us | ${COMPANY_NAME}`}
      description={`Learn about ${COMPANY_NAME} — practical, data-driven inventory and warehouse consulting for manufacturers, distributors, and warehouse operators.`}
      eyebrow="About Us"
      heading={`About ${COMPANY_NAME}`}
    >
      <p>
        {COMPANY_NAME} helps manufacturers, distributors, and warehouse operators find and fix the
        gaps between what their inventory process assumes and what actually happens on the floor.
        We focus on practical, actionable diagnostics and recommendations — not generic advice.
      </p>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">What We Do</h2>
        <ul className="mt-3 space-y-2">
          {SERVICES.map((service) => (
            <li key={service.title}>
              <span className="font-medium text-slate-900">{service.title}:</span>{' '}
              {service.description}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Why Clients Choose Us</h2>
        <ul className="mt-3 space-y-2">
          {WHY_CHOOSE_NAC.map((item) => (
            <li key={item.title}>
              <span className="font-medium text-slate-900">{item.title}:</span> {item.description}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Industries We Work With</h2>
        <p className="mt-3">
          {INDUSTRIES.map((industry) => industry.name).join(', ')}, and other SMEs managing
          physical inventory.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">By the Numbers</h2>
        <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-200 p-4 text-center">
              <dt className="text-xs text-slate-500">{stat.label}</dt>
              <dd className="mt-1 text-xl font-bold text-brand">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p>
        The free Inventory Health Assessment is the starting point for that work — a structured,
        52-question diagnostic that gives you a scored report and clear next steps in minutes,
        before any paid engagement.
      </p>
    </MarketingPageLayout>
  );
}
