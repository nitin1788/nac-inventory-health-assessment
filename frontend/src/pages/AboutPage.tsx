import { Link } from 'react-router-dom';
import { MarketingPageLayout } from '@/shared/layouts/MarketingPageLayout';
import { WHY_CHOOSE_NAC, TRUST_STATS } from '@/features/landing/landing.data';
import { INVENTORY_SERVICES } from '@/config/services.inventory.data';
import { DIGITAL_SERVICES } from '@/config/services.digital.data';
import { INDUSTRIES_LIST } from '@/config/industries.data';
import { COMPANY_NAME, ROUTES } from '@/config/constants';

export function AboutPage() {
  return (
    <MarketingPageLayout
      title={`About Us | ${COMPANY_NAME} — Pharmacy & Healthcare Consulting`}
      description={`Learn about ${COMPANY_NAME} — specialist Inventory & Operations Consulting and Digital Marketing & Growth for pharmacy, healthcare, and allied businesses.`}
      path={ROUTES.about}
      eyebrow="About Us"
      heading={`About ${COMPANY_NAME}`}
    >
      <p>
        {COMPANY_NAME} works exclusively with pharmacy, healthcare, and allied businesses — not as
        a generalist consultancy that happens to take healthcare clients, but as a specialist
        built around how these businesses actually operate. We work across two distinct
        disciplines: making inventory and day-to-day operations more accurate and efficient, and
        building the digital presence that brings in more patients and customers.
      </p>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Founder Background</h2>
        <p className="mt-3">
          Nitin Anand Consulting is built on a pharmacy background and 16+ years of hands-on
          inventory and operations experience, paired with formal operations management
          education. That combination of real pharmacy/healthcare industry understanding and
          structured operations training shapes how we approach both verticals — operations
          recommendations grounded in how a pharmacy or healthcare business actually runs, not
          generic consulting theory.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Inventory &amp; Operations Consulting</h2>
        <p className="mt-3">
          {INVENTORY_SERVICES.length} services covering inventory audits, reconciliation,
          ABC/FSN and expiry analysis, stock optimization, SOP development, and KPI dashboards —
          built around pharmacy and healthcare stock handling specifically.{' '}
          <Link to={ROUTES.inventoryHub} className="font-medium text-brand hover:underline">
            Explore Operations Consulting
          </Link>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Digital Marketing &amp; Growth</h2>
        <p className="mt-3">
          {DIGITAL_SERVICES.length} services covering websites, SEO, local visibility, social
          media, and Google/Meta advertising — built around how patients and customers actually
          search for and choose a healthcare business.{' '}
          <Link to={ROUTES.digitalMarketingHub} className="font-medium text-brand hover:underline">
            Explore Digital Marketing
          </Link>
          .
        </p>
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
          {INDUSTRIES_LIST.map((industry) => industry.name).join(', ')}.{' '}
          <Link to={ROUTES.industriesHub} className="font-medium text-brand hover:underline">
            See all industries we serve
          </Link>
          .
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">By the Numbers</h2>
        <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-slate-200 p-4 text-center shadow-soft">
              <dt className="text-xs text-slate-500">{stat.label}</dt>
              <dd className="mt-1 text-xl font-bold text-brand">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p>
        Whether you need tighter inventory control, better store operations, stronger local
        visibility, or all of the above,{' '}
        <Link to={ROUTES.contactUs} className="font-medium text-brand hover:underline">
          get in touch
        </Link>{' '}
        and we&apos;ll help you figure out where to start.
      </p>
    </MarketingPageLayout>
  );
}
