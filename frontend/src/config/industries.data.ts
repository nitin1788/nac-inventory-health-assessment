import type { LucideIcon } from 'lucide-react';
import { Store, Hospital, Building2, Pill, Stethoscope, FlaskConical, Smile, Activity, Truck, PackageCheck } from 'lucide-react';
import type { ServiceFaq } from './serviceTypes';

export interface IndustryRelatedService {
  label: string;
  path: string;
}

export interface IndustryProfile {
  icon: LucideIcon;
  slug: string;
  path: string;
  name: string;
  /** Card/nav blurb. */
  description: string;
  metaDescription: string;
  intro: string;
  /**
   * Real photography for this industry's detail page hero, where
   * available. Optional — only populated for industries with a
   * commissioned photo; the rest keep the text-only hero.
   * `objectPosition`/`aspectClassName` override the default crop — used on
   * a couple of entries whose source photo has a fabricated on-screen
   * dashboard on one edge that a tighter, left-biased crop needs to keep
   * out of frame entirely.
   */
  image?: { src: string; alt: string; objectPosition?: string; aspectClassName?: string };
  /** Cross-links into both verticals — the site's internal-linking mechanism between industries and services. */
  relevantServices: IndustryRelatedService[];
  faqs: ServiceFaq[];
}

/**
 * The 12 target industries, each with its own dedicated page at
 * /industries/:slug (see features/industries). Cross-links into both
 * INVENTORY_SERVICES and DIGITAL_SERVICES so a visitor from an industry
 * page can reach the specific service most relevant to them.
 */
export const INDUSTRIES_LIST: IndustryProfile[] = [
  {
    icon: Store,
    slug: 'retail-pharmacy',
    path: '/industries/retail-pharmacy',
    name: 'Retail Pharmacy',
    description: 'Inventory accuracy, expiry control, and local visibility for standalone retail pharmacies.',
    metaDescription:
      'Nitin Anand Consulting works with retail pharmacies on inventory audits, expiry control, and local SEO/Google Business Profile visibility.',
    intro:
      'Retail pharmacies operate on thin margins with stock that has real expiry risk and strict handling requirements. We work with retail pharmacies on both sides of the business — tighter inventory and expiry control on the operations side, and stronger local visibility (Google Business Profile, local SEO) to bring in more nearby customers.',
    image: {
      src: '/images/industries/nac-retail-pharmacy-inventory-consulting.webp.png',
      alt: 'Consultant reviewing shelf stock with a pharmacist inside a retail pharmacy',
    },
    relevantServices: [
      { label: 'Inventory Audit', path: '/services/inventory-operations-consulting/inventory-audit' },
      { label: 'Expiry / Near-Expiry Analysis', path: '/services/inventory-operations-consulting/expiry-near-expiry-analysis' },
      { label: 'Local SEO', path: '/services/digital-marketing/local-seo' },
      { label: 'Google Business Profile', path: '/services/digital-marketing/google-business-profile' },
    ],
    faqs: [
      {
        question: 'Do you work with single-store pharmacies, or only chains?',
        answer: 'Both — single-store retail pharmacies are one of our core segments, not just chain pharmacies.',
      },
      {
        question: 'What\'s the most common starting point for a retail pharmacy?',
        answer: 'Usually an inventory audit or expiry analysis on the operations side, or a Google Business Profile setup on the digital side — depending on which is the more pressing concern.',
      },
    ],
  },
  {
    icon: Hospital,
    slug: 'hospital-pharmacy',
    path: '/industries/hospital-pharmacy',
    name: 'Hospital Pharmacy',
    description: 'Higher-volume stock control, SOPs, and reconciliation for in-hospital pharmacy operations.',
    metaDescription:
      'Nitin Anand Consulting supports hospital pharmacies with inventory reconciliation, SOP development, and stock optimization for higher-volume, higher-stakes operations.',
    intro:
      'Hospital pharmacies handle higher stock volumes, more SKUs, and tighter accountability requirements than a standalone store. Our inventory reconciliation, SOP development, and stock optimization work is built to handle that scale and complexity.',
    image: {
      src: '/images/industries/hospital-pharmacy-inventory-consulting.webp.png',
      alt: 'Consultant reviewing hospital pharmacy inventory with pharmacy staff',
    },
    relevantServices: [
      { label: 'Inventory Reconciliation', path: '/services/inventory-operations-consulting/inventory-reconciliation' },
      { label: 'SOP Development', path: '/services/inventory-operations-consulting/sop-development' },
      { label: 'Reorder / Min-Max', path: '/services/inventory-operations-consulting/reorder-min-max' },
      { label: 'KPI / MIS / Dashboards', path: '/services/inventory-operations-consulting/kpi-mis-dashboards' },
    ],
    faqs: [
      {
        question: 'Do you work directly with hospital administration, or the pharmacy department?',
        answer: 'Typically the pharmacy department directly, coordinated with administration as needed for the specific engagement.',
      },
      {
        question: 'Can you handle multi-department stock tracking within a hospital?',
        answer: 'Yes — reconciliation and reorder-level work can be scoped across multiple stocking points within a single facility.',
      },
    ],
  },
  {
    icon: Building2,
    slug: 'chain-pharmacy',
    path: '/industries/chain-pharmacy',
    name: 'Chain Pharmacy',
    description: 'Consistency across locations — standardized SOPs, purchasing, and multi-store reporting.',
    metaDescription:
      'Nitin Anand Consulting helps chain pharmacies standardize SOPs, purchasing, and reporting across multiple store locations.',
    intro:
      'The core challenge for a chain pharmacy is consistency — the same standards applied across every location, not just the flagship store. We help standardize SOPs, purchasing decisions, and KPI reporting across your full network of stores.',
    image: {
      src: '/images/industries/nac-chain-pharmacy-performance-consulting.webp.png',
      alt: 'Consultant discussing multi-store performance and stock standards with chain pharmacy staff',
    },
    relevantServices: [
      { label: 'SOP Development', path: '/services/inventory-operations-consulting/sop-development' },
      { label: 'Purchase Analysis', path: '/services/inventory-operations-consulting/purchase-analysis' },
      { label: 'KPI / MIS / Dashboards', path: '/services/inventory-operations-consulting/kpi-mis-dashboards' },
      { label: 'PPC & Performance Marketing', path: '/services/digital-marketing/ppc-performance-marketing' },
    ],
    faqs: [
      {
        question: 'How many locations do you typically work with?',
        answer: 'It varies — the standardization approach scales from a handful of stores to a larger regional chain.',
      },
      {
        question: 'Can reporting be consolidated across all our stores?',
        answer: 'Yes — our KPI/MIS/dashboard work is well suited to a consolidated, multi-location view.',
      },
    ],
  },
  {
    icon: Pill,
    slug: 'medical-stores',
    path: '/industries/medical-stores',
    name: 'Medical Stores',
    description: 'Practical inventory control and digital visibility for general medical stores.',
    metaDescription:
      'Nitin Anand Consulting works with medical stores on inventory audits, stock optimization, and digital visibility to grow local customer reach.',
    intro:
      'Medical stores share many of the same operating realities as pharmacies — batch/expiry-sensitive stock, thin margins, and strong reliance on local reputation. We support both the inventory side and the digital growth side of running one.',
    image: {
      src: '/images/industries/nac-medical-store-inventory-consulting.webp.png',
      alt: 'Consultant reviewing medical store inventory and stock records with the store owner',
    },
    relevantServices: [
      { label: 'Inventory Audit', path: '/services/inventory-operations-consulting/inventory-audit' },
      { label: 'Stock Optimization', path: '/services/inventory-operations-consulting/stock-optimization' },
      { label: 'Local SEO', path: '/services/digital-marketing/local-seo' },
      { label: 'Social Media Management', path: '/services/digital-marketing/social-media-management' },
    ],
    faqs: [
      {
        question: 'What\'s the difference between a "medical store" and "retail pharmacy" engagement?',
        answer: 'The underlying services are largely the same — the distinction mostly reflects local naming conventions and business registration, not a different approach.',
      },
      {
        question: 'How do I get started?',
        answer: 'Contact us describing your store and whether the inventory or digital side is the more pressing priority.',
      },
    ],
  },
  {
    icon: Stethoscope,
    slug: 'clinics',
    path: '/industries/clinics',
    name: 'Clinics',
    description: 'Operational efficiency and a professional digital presence for medical and specialty clinics.',
    metaDescription:
      'Nitin Anand Consulting supports clinics with operations audits, SOP development, and website/local SEO to build a professional digital presence.',
    intro:
      'A clinic\'s reputation is built as much on how smoothly the practice runs as on the care itself — appointment flow, supply handling, and how easily a new patient can find and trust you online. We support both sides.',
    image: {
      src: '/images/industries/clinic-operations-consulting.webp.png',
      alt: 'Consultant reviewing workflow with a clinic doctor in the reception area',
    },
    relevantServices: [
      { label: 'Operations Audit', path: '/services/inventory-operations-consulting/operations-audit' },
      { label: 'SOP Development', path: '/services/inventory-operations-consulting/sop-development' },
      { label: 'Website Development', path: '/services/digital-marketing/website-development' },
      { label: 'Google Business Profile', path: '/services/digital-marketing/google-business-profile' },
    ],
    faqs: [
      {
        question: 'Do you work with single-practitioner clinics or only larger practices?',
        answer: 'Both — the approach scales to your clinic\'s size and needs.',
      },
      {
        question: 'Can you help with patient-facing content?',
        answer: 'We can support general practice-information and service content; clinical/medical content decisions remain with your practice.',
      },
    ],
  },
  {
    icon: Hospital,
    slug: 'hospitals',
    path: '/industries/hospitals',
    name: 'Hospitals',
    description: 'Operations and inventory consulting scoped for hospital-scale complexity.',
    metaDescription:
      'Nitin Anand Consulting provides operations audits and inventory consulting for hospitals, scoped for facility-wide complexity.',
    intro:
      'Hospital operations span multiple departments, stocking points, and stakeholders. Our operations audit and inventory consulting work is scoped to that complexity — focused engagements on a specific department or process, not an attempt to solve everything at once.',
    image: {
      src: '/images/industries/nac-hospital-operations-consulting.webp.png',
      alt: 'Consultant reviewing hospital operations with a doctor near the ward signage',
      // Tighter, left-biased crop: the source photo has a fabricated
      // on-screen KPI dashboard on its right edge that a standard 4:3 crop
      // wouldn't fully exclude.
      objectPosition: '0% 20%',
      aspectClassName: 'aspect-square',
    },
    relevantServices: [
      { label: 'Operations Audit', path: '/services/inventory-operations-consulting/operations-audit' },
      { label: 'Inventory Analysis', path: '/services/inventory-operations-consulting/inventory-analysis' },
      { label: 'KPI / MIS / Dashboards', path: '/services/inventory-operations-consulting/kpi-mis-dashboards' },
      { label: 'Website Development', path: '/services/digital-marketing/website-development' },
    ],
    faqs: [
      {
        question: 'What\'s a realistic starting scope for a hospital engagement?',
        answer: 'A single department or process (e.g. pharmacy stock, a specific store) rather than a facility-wide engagement out of the gate.',
      },
      {
        question: 'Do you work with hospital administration or department heads?',
        answer: 'Typically whichever stakeholder owns the specific process being reviewed — we scope this with you at the outset.',
      },
    ],
  },
  {
    icon: Activity,
    slug: 'diagnostic-centres',
    path: '/industries/diagnostic-centres',
    name: 'Diagnostic Centres',
    description: 'Reagent and consumable stock control, plus digital visibility for diagnostic and imaging centres.',
    metaDescription:
      'Nitin Anand Consulting works with diagnostic centres on reagent/consumable stock control and local SEO to attract more patient referrals.',
    intro:
      'Diagnostic centres carry consumables and reagents with their own expiry and storage sensitivities, alongside a strong dependence on being easy to find and trust online for both walk-ins and doctor referrals.',
    image: {
      src: '/images/industries/nac-diagnostic-centre-operations-consulting.webp.png',
      alt: 'Consultant reviewing operations with diagnostic centre staff near the imaging room',
      // Same reasoning as Hospitals — crop stays left of the source
      // photo's fabricated on-screen stats monitor.
      objectPosition: '0% 15%',
      aspectClassName: 'aspect-square',
    },
    relevantServices: [
      { label: 'Expiry / Near-Expiry Analysis', path: '/services/inventory-operations-consulting/expiry-near-expiry-analysis' },
      { label: 'Reorder / Min-Max', path: '/services/inventory-operations-consulting/reorder-min-max' },
      { label: 'Local SEO', path: '/services/digital-marketing/local-seo' },
      { label: 'SEO', path: '/services/digital-marketing/seo' },
    ],
    faqs: [
      {
        question: 'Do you handle consumables and reagent stock specifically?',
        answer: 'Yes — our expiry and reorder-level work applies directly to reagent and consumable stock, not just retail-style products.',
      },
      {
        question: 'How does digital marketing help a diagnostic centre?',
        answer: 'Stronger local search visibility and a clear website help both walk-in patients and referring doctors find and trust the centre.',
      },
    ],
  },
  {
    icon: FlaskConical,
    slug: 'pathology-labs',
    path: '/industries/pathology-labs',
    name: 'Pathology Labs',
    description: 'Consumable stock accuracy and referral-driven digital presence for pathology labs.',
    metaDescription:
      'Nitin Anand Consulting supports pathology labs with inventory accuracy for lab consumables and SEO/website support to strengthen referral visibility.',
    intro:
      'Pathology labs depend on precise consumable and reagent stock control and, often, referral relationships that a professional, easy-to-find digital presence supports. We work across both.',
    image: {
      src: '/images/industries/pathology-lab-workflow-consulting.webp.png',
      alt: 'Consultant reviewing lab workflow and consumables with pathology lab technicians',
    },
    relevantServices: [
      { label: 'Stock Verification', path: '/services/inventory-operations-consulting/stock-verification' },
      { label: 'Purchase Analysis', path: '/services/inventory-operations-consulting/purchase-analysis' },
      { label: 'Website Development', path: '/services/digital-marketing/website-development' },
      { label: 'Local SEO', path: '/services/digital-marketing/local-seo' },
    ],
    faqs: [
      {
        question: 'Can you help with supplier/purchase consistency for lab consumables?',
        answer: 'Yes — purchase analysis covers supplier reliability and ordering patterns for lab consumables specifically.',
      },
      {
        question: 'How do I get started?',
        answer: 'Contact us describing your lab\'s operations and whether inventory or digital visibility is the more immediate priority.',
      },
    ],
  },
  {
    icon: Smile,
    slug: 'dental-clinics',
    path: '/industries/dental-clinics',
    name: 'Dental Clinics',
    description: 'Supply and consumable tracking, plus a professional website and local presence for dental practices.',
    metaDescription:
      'Nitin Anand Consulting supports dental clinics with supply/consumable inventory tracking and website/local SEO to attract new patients.',
    intro:
      'Dental clinics manage a mix of consumables, instruments, and materials alongside a strong dependence on local reputation and an easy-to-find online presence for new patient enquiries.',
    image: {
      src: '/images/industries/nac-dental-clinic-operations-consulting.webp.png',
      alt: 'Consultant discussing operations with a dentist inside a dental treatment room',
    },
    relevantServices: [
      { label: 'Inventory Audit', path: '/services/inventory-operations-consulting/inventory-audit' },
      { label: 'Reorder / Min-Max', path: '/services/inventory-operations-consulting/reorder-min-max' },
      { label: 'Website Development', path: '/services/digital-marketing/website-development' },
      { label: 'Social Media Content', path: '/services/digital-marketing/social-media-content' },
    ],
    faqs: [
      {
        question: 'Do you work with single-practitioner dental clinics?',
        answer: 'Yes — the approach scales to solo practices as well as larger multi-chair clinics.',
      },
      {
        question: 'Can you help build a new website for our clinic?',
        answer: 'Yes — see Website Development for a dedicated look at what that includes.',
      },
    ],
  },
  {
    icon: Activity,
    slug: 'physiotherapy-centres',
    path: '/industries/physiotherapy-centres',
    name: 'Physiotherapy Centres',
    description: 'Practical operations support and digital growth for physiotherapy and rehabilitation practices.',
    metaDescription:
      'Nitin Anand Consulting supports physiotherapy centres with operations improvement and digital marketing to grow local patient enquiries.',
    intro:
      'Physiotherapy centres compete heavily on local visibility and word-of-mouth trust. We support the operational side (process improvement, equipment/consumable tracking) alongside the digital side (local SEO, social content) that drives new patient enquiries.',
    image: {
      src: '/images/industries/physiotherapy-centre-workflow-consulting.webp.png',
      alt: 'Consultant reviewing workflow with a physiotherapist on the treatment floor',
    },
    relevantServices: [
      { label: 'Process Improvement', path: '/services/inventory-operations-consulting/process-improvement' },
      { label: 'Operations Audit', path: '/services/inventory-operations-consulting/operations-audit' },
      { label: 'Local SEO', path: '/services/digital-marketing/local-seo' },
      { label: 'Social Media Content', path: '/services/digital-marketing/social-media-content' },
    ],
    faqs: [
      {
        question: 'What does an operations audit look like for a physiotherapy centre?',
        answer: 'A review of appointment flow, equipment/consumable handling, and general floor workflow — the same structured approach we use across healthcare operations.',
      },
      {
        question: 'How do I get started?',
        answer: 'Contact us with a description of your centre and current priorities.',
      },
    ],
  },
  {
    icon: Truck,
    slug: 'pharma-distributors',
    path: '/industries/pharma-distributors',
    name: 'Pharma Distributors',
    description: 'Higher-volume inventory, purchase, and reorder consulting for pharma distribution operations.',
    metaDescription:
      'Nitin Anand Consulting works with pharma distributors on inventory analysis, purchase analysis, and reorder-level consulting at distribution scale.',
    intro:
      'Distribution operations run on volume, turnover, and supplier reliability. Our inventory analysis, purchase analysis, and reorder/min-max work is built to operate at that scale, not just single-store retail volume.',
    image: {
      src: '/images/industries/nac-pharma-distributor-warehouse-consulting.webp.png',
      alt: 'Consultant reviewing warehouse stock with distribution staff among pallet racking',
    },
    relevantServices: [
      { label: 'Inventory Analysis', path: '/services/inventory-operations-consulting/inventory-analysis' },
      { label: 'Purchase Analysis', path: '/services/inventory-operations-consulting/purchase-analysis' },
      { label: 'Reorder / Min-Max', path: '/services/inventory-operations-consulting/reorder-min-max' },
      { label: 'KPI / MIS / Dashboards', path: '/services/inventory-operations-consulting/kpi-mis-dashboards' },
    ],
    faqs: [
      {
        question: 'Do you work with distributors that supply multiple pharmacies/hospitals?',
        answer: 'Yes — this is a core use case for our purchase analysis and reorder-level consulting.',
      },
      {
        question: 'Can you help with warehouse-level stock optimization for distribution?',
        answer: 'Yes — see Stock Optimization and Pharmacy / Store / Warehouse Operations for the related services.',
      },
    ],
  },
  {
    icon: PackageCheck,
    slug: 'medical-equipment-suppliers',
    path: '/industries/medical-equipment-suppliers',
    name: 'Medical Equipment & Surgical Suppliers',
    description: 'Inventory control for higher-value equipment/surgical stock, and B2B-focused digital visibility.',
    metaDescription:
      'Nitin Anand Consulting supports medical equipment and surgical suppliers with inventory analysis and digital marketing built for B2B/institutional buyers.',
    intro:
      'Medical equipment and surgical suppliers carry higher-value stock with different turnover patterns than retail pharmacy, and typically sell to institutional or B2B buyers rather than walk-in customers — both the inventory approach and the marketing approach need to reflect that.',
    image: {
      src: '/images/industries/nac-medical-equipment-surgical-suppliers-consulting.webp.png',
      alt: 'Consultant reviewing medical equipment inventory with supplier staff among stocked shelving',
    },
    relevantServices: [
      { label: 'Inventory Analysis', path: '/services/inventory-operations-consulting/inventory-analysis' },
      { label: 'ABC Analysis', path: '/services/inventory-operations-consulting/abc-analysis' },
      { label: 'Website Development', path: '/services/digital-marketing/website-development' },
      { label: 'SEO', path: '/services/digital-marketing/seo' },
    ],
    faqs: [
      {
        question: 'Is your digital marketing approach different for B2B/institutional buyers?',
        answer: 'Yes — website content, SEO targeting, and campaign strategy are adapted for how institutional buyers actually search and evaluate suppliers, not a retail-consumer approach.',
      },
      {
        question: 'Do you handle high-value, low-turnover equipment stock?',
        answer: 'Yes — ABC analysis and inventory analysis are particularly relevant for higher-value, lower-turnover equipment inventory.',
      },
    ],
  },
];
