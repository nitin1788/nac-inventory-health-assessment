import {
  Globe,
  LayoutTemplate,
  Search,
  MapPin,
  ClipboardCheck,
  Share2,
  PenTool,
  Sparkles,
  MousePointerClick,
  Megaphone,
  Target,
  LineChart,
} from 'lucide-react';
import type { ServiceCategory } from './serviceTypes';

/**
 * Vertical 2 — Digital Marketing & Growth. One dedicated page per entry,
 * rendered by the shared ServiceLandingView template at
 * /services/digital-marketing/:slug (see features/services).
 *
 * "PPC" and "Performance Marketing" are combined into one page, as are
 * "Analytics" and "Conversion Tracking" — closely overlapping services
 * that read as duplicates as separate pages. "Digital Growth" is treated
 * as the vertical's overall framing rather than a standalone service.
 */
export const DIGITAL_SERVICES: ServiceCategory[] = [
  {
    icon: Globe,
    slug: 'website-development',
    path: '/services/digital-marketing/website-development',
    title: 'Website Development',
    description: 'A professional, trust-building website built for pharmacy, healthcare, and allied businesses.',
    services: [
      'Business/practice website design and build',
      'Mobile-friendly, fast-loading pages',
      'Clear service, contact, and location information',
      'Built with SEO fundamentals from the start',
    ],
    metaDescription:
      'Website development from Nitin Anand Consulting for pharmacies, clinics, and healthcare businesses — professional, mobile-friendly websites built with SEO fundamentals in place.',
    intro:
      'For a pharmacy, clinic, or diagnostic centre, your website is often the first place a prospective patient or customer forms an opinion of you. We build professional, mobile-friendly websites for healthcare and allied businesses — fast, clear, and built with SEO fundamentals from day one, not bolted on afterward.',
    benefits: [
      { title: 'Built for Trust', description: 'A professional online presence that matches the credibility of your in-person practice.' },
      { title: 'Mobile-First', description: 'Most local healthcare searches happen on a phone — your site is built to work well there.' },
      { title: 'SEO-Ready From Day One', description: 'Structured so search engines can find and understand your business, not an afterthought.' },
    ],
    faqs: [
      {
        question: 'Do you build websites for clinics and diagnostic centres, not just pharmacies?',
        answer: 'Yes — we build for any business in the pharmacy, healthcare, and allied space named in our Industries.',
      },
      {
        question: 'Will the site be easy for us to update ourselves later?',
        answer: 'We build with maintainability in mind and can discuss the right setup for your team\'s technical comfort level.',
      },
    ],
  },
  {
    icon: LayoutTemplate,
    slug: 'landing-pages',
    path: '/services/digital-marketing/landing-pages',
    title: 'Landing Pages',
    description: 'Focused, single-purpose pages built to convert a specific campaign or offer.',
    services: [
      'Campaign-specific landing page design',
      'Clear, single call-to-action structure',
      'Built for fast load times and mobile visitors',
      'Ready to pair with Google Ads or Meta Ads campaigns',
    ],
    metaDescription:
      'Landing page design from Nitin Anand Consulting for pharmacy and healthcare businesses — focused, conversion-oriented pages built for specific campaigns and offers.',
    intro:
      'A general website page tries to do everything; a landing page is built to do one thing well — convert a visitor from a specific campaign or offer into an enquiry. We design focused landing pages that pair directly with your ad or promotion.',
    benefits: [
      { title: 'Higher Conversion Focus', description: 'One clear action per page, not a dozen competing options.' },
      { title: 'Built for Paid Traffic', description: 'Designed to work well alongside Google Ads and Meta Ads campaigns.' },
      { title: 'Fast to Launch', description: 'A focused page can go live faster than a full website redesign.' },
    ],
    faqs: [
      {
        question: 'Do we need a full website before we can get a landing page?',
        answer: 'No — a landing page can work as a standalone page for a specific campaign, independent of your main website.',
      },
      {
        question: 'Can you build multiple landing pages for different campaigns?',
        answer: 'Yes — each campaign or offer can have its own dedicated page.',
      },
    ],
  },
  {
    icon: Search,
    slug: 'seo',
    path: '/services/digital-marketing/seo',
    title: 'SEO',
    description: 'Search engine optimization to help your pharmacy or healthcare business show up when people search.',
    services: [
      'On-page SEO (titles, meta descriptions, structure)',
      'Keyword research relevant to your services and location',
      'Technical SEO fundamentals (site speed, structure, sitemap)',
      'Content recommendations to support ranking',
    ],
    metaDescription:
      'SEO services from Nitin Anand Consulting for pharmacies and healthcare businesses — on-page and technical SEO built around the searches your actual customers make.',
    intro:
      'SEO for a pharmacy or healthcare business is different from SEO for a generic e-commerce store — the searches, the intent, and the trust signals that matter are specific to healthcare. We build SEO around keywords and content relevant to how your actual customers search.',
    benefits: [
      { title: 'Found by the Right Searches', description: 'Keyword research grounded in your actual services and location, not generic terms.' },
      { title: 'Technical Fundamentals Done Right', description: 'Site speed, structure, and sitemap set up correctly, not skipped.' },
      { title: 'A Long-Term Asset', description: 'Organic visibility that compounds over time, unlike paid ads that stop the moment spend stops.' },
    ],
    faqs: [
      {
        question: 'How long does SEO take to show results?',
        answer: 'Organic SEO is a medium-to-long-term investment — meaningful movement typically takes a few months, not days, which is why it\'s often paired with paid campaigns for near-term visibility.',
      },
      {
        question: 'Is this different from Local SEO?',
        answer: 'Local SEO is a specific, location-focused subset of SEO (Google Business Profile, local search rankings) — we offer it separately for businesses whose customers search locally first.',
      },
    ],
  },
  {
    icon: MapPin,
    slug: 'local-seo',
    path: '/services/digital-marketing/local-seo',
    title: 'Local SEO',
    description: 'Getting your pharmacy, clinic, or store found in local search results and Google Maps.',
    services: [
      'Google Business Profile optimization',
      'Local citation and directory consistency',
      'Location-specific keyword targeting',
      'Review and local reputation guidance',
    ],
    metaDescription:
      'Local SEO from Nitin Anand Consulting for pharmacies, clinics, and medical stores — Google Business Profile optimization and local search visibility for nearby customers.',
    intro:
      '"Pharmacy near me" and "clinic near me" searches are exactly the moments a local SEO strategy is built for. We optimize your Google Business Profile and local search presence so nearby customers find you first.',
    benefits: [
      { title: 'Show Up for "Near Me" Searches', description: 'Optimized for the exact searches local customers actually make.' },
      { title: 'Stronger Google Maps Presence', description: 'A complete, accurate, well-optimized Google Business Profile.' },
      { title: 'Consistent Business Information', description: 'Accurate name, address, and phone details across directories, which search engines weigh heavily.' },
    ],
    faqs: [
      {
        question: 'Do we already need a Google Business Profile set up?',
        answer: 'No — we can set one up from scratch, or optimize an existing one.',
      },
      {
        question: 'Does local SEO help with multiple store locations?',
        answer: 'Yes — each location can have its own optimized profile and local presence.',
      },
    ],
  },
  {
    icon: ClipboardCheck,
    slug: 'google-business-profile',
    path: '/services/digital-marketing/google-business-profile',
    title: 'Google Business Profile',
    description: 'Setting up and actively managing your Google Business Profile — the first thing most local customers see.',
    services: [
      'Profile setup and verification support',
      'Business information, hours, and category accuracy',
      'Photo and update management',
      'Ongoing review response guidance',
    ],
    metaDescription:
      'Google Business Profile setup and management from Nitin Anand Consulting for pharmacies and healthcare businesses — accurate, actively maintained local listings.',
    intro:
      'Your Google Business Profile is often the very first impression a nearby customer gets — hours, location, photos, and reviews, all before they ever visit your website. We set it up correctly and keep it actively maintained.',
    benefits: [
      { title: 'Accurate First Impression', description: 'Correct hours, location, and category information, always up to date.' },
      { title: 'Actively Maintained', description: 'Ongoing updates, not a profile set up once and forgotten.' },
      { title: 'Supports Local SEO', description: 'A well-maintained profile is one of the strongest local search ranking factors.' },
    ],
    faqs: [
      {
        question: 'Is this the same as Local SEO?',
        answer: 'Google Business Profile management is a core part of Local SEO — we offer it standalone for businesses that just need the profile itself handled.',
      },
      {
        question: 'Can you help respond to reviews?',
        answer: 'We provide guidance and templates for professional review responses; you retain full control over what\'s posted under your business name.',
      },
    ],
  },
  {
    icon: Share2,
    slug: 'social-media-management',
    path: '/services/digital-marketing/social-media-management',
    title: 'Social Media Management',
    description: 'Ongoing management of your social media presence — posting, scheduling, and engagement.',
    services: [
      'Content calendar and posting schedule',
      'Platform management (Instagram, Facebook, and similar)',
      'Community engagement and response support',
      'Monthly performance review',
    ],
    metaDescription:
      'Social media management from Nitin Anand Consulting for pharmacies and healthcare businesses — ongoing content scheduling, posting, and engagement support.',
    intro:
      'Consistent social media presence builds familiarity and trust over time, but it takes ongoing effort most healthcare businesses don\'t have spare time for. We manage the calendar, posting, and engagement so your presence stays active without it falling on you.',
    benefits: [
      { title: 'Consistent Presence', description: 'Regular posting on a schedule, not sporadic bursts.' },
      { title: 'One Less Thing to Manage', description: 'Frees up your team to focus on running the business.' },
      { title: 'Tracked Performance', description: 'Monthly review of what\'s actually working.' },
    ],
    faqs: [
      {
        question: 'Which platforms do you manage?',
        answer: 'Primarily Instagram and Facebook, with other platforms available depending on where your customers actually are.',
      },
      {
        question: 'Do you also create the content, or just post it?',
        answer: 'Both are available — see Social Media Content for the dedicated content-creation service, often paired with management.',
      },
    ],
  },
  {
    icon: PenTool,
    slug: 'social-media-content',
    path: '/services/digital-marketing/social-media-content',
    title: 'Social Media Content',
    description: 'Content creation for your social channels — graphics, captions, and healthcare-appropriate messaging.',
    services: [
      'Post graphics and visual content',
      'Caption writing aligned to your brand voice',
      'Healthcare-appropriate content review',
      'Content batches planned around your calendar',
    ],
    metaDescription:
      'Social media content creation from Nitin Anand Consulting for pharmacies and healthcare businesses — graphics and captions built around a healthcare-appropriate voice.',
    intro:
      'Healthcare and pharmacy content needs a different tone than a typical retail brand — informative and trustworthy, without overstepping into claims that aren\'t appropriate to make. We create content built around that balance.',
    benefits: [
      { title: 'On-Brand, Every Post', description: 'Consistent visual and written style across your channels.' },
      { title: 'Healthcare-Appropriate Tone', description: 'Content reviewed for a professional, trustworthy healthcare voice.' },
      { title: 'Planned, Not Scrambled', description: 'Content created in batches against your calendar, not last-minute.' },
    ],
    faqs: [
      {
        question: 'Do you make medical claims in the content?',
        answer: 'No — content is built around your services, operations, and general health-and-wellness awareness, not clinical or medical claims.',
      },
      {
        question: 'Can this be paired with social media management?',
        answer: 'Yes — content creation and management are commonly paired so the whole channel is handled end-to-end.',
      },
    ],
  },
  {
    icon: Sparkles,
    slug: 'ai-content-creation',
    path: '/services/digital-marketing/ai-content-creation',
    title: 'AI Content Creation',
    description: 'AI-assisted content production for blogs, social posts, and marketing copy — reviewed before it goes out.',
    services: [
      'AI-assisted drafting for blog and social content',
      'Human review and healthcare-appropriate editing',
      'Faster content turnaround at scale',
      'Consistent voice across a larger content volume',
    ],
    metaDescription:
      'AI content creation from Nitin Anand Consulting for pharmacies and healthcare businesses — AI-assisted content production with human review for accuracy and tone.',
    intro:
      'AI tools can speed up content production significantly, but healthcare content needs a human review step before anything goes public — for accuracy, tone, and to avoid overstated claims. We use AI to draft faster, then review and edit every piece before it\'s used.',
    benefits: [
      { title: 'Faster Turnaround', description: 'More content produced in less time, without sacrificing quality.' },
      { title: 'Always Human-Reviewed', description: 'Every piece checked for accuracy and appropriate tone before publishing.' },
      { title: 'Consistent at Scale', description: 'A consistent voice maintained even as content volume grows.' },
    ],
    faqs: [
      {
        question: 'Is AI-generated content published without review?',
        answer: 'No — every piece is human-reviewed and edited before it\'s used, specifically to check for accuracy and appropriate healthcare tone.',
      },
      {
        question: 'What kind of content is this used for?',
        answer: 'Blog articles, social captions, and general marketing copy — not clinical or regulatory content.',
      },
    ],
  },
  {
    icon: MousePointerClick,
    slug: 'google-ads',
    path: '/services/digital-marketing/google-ads',
    title: 'Google Ads',
    description: 'Search and display advertising on Google, set up and managed for healthcare and pharmacy businesses.',
    services: [
      'Campaign strategy and keyword targeting',
      'Ad copywriting and creative',
      'Budget management and bid optimization',
      'Monthly performance reporting',
    ],
    metaDescription:
      'Google Ads management from Nitin Anand Consulting for pharmacies and healthcare businesses — search and display campaigns set up and managed for measurable results.',
    intro:
      'Google Ads can put you in front of customers actively searching for what you offer, right now — if the campaign is set up and managed correctly. We handle strategy, keyword targeting, ad copy, and ongoing optimization.',
    benefits: [
      { title: 'Immediate Visibility', description: 'Show up for relevant searches without waiting on organic SEO timelines.' },
      { title: 'Budget Under Control', description: 'Active bid and budget management, not a campaign left to run unattended.' },
      { title: 'Clear Reporting', description: 'Monthly performance reporting so you know what your spend is producing.' },
    ],
    faqs: [
      {
        question: 'What\'s the minimum budget to get started?',
        answer: 'It depends on your market and goals — we\'ll recommend a realistic starting budget after understanding your objectives.',
      },
      {
        question: 'How is this different from PPC & Performance Marketing?',
        answer: 'Google Ads is one specific platform; our combined PPC & Performance Marketing service covers strategy across Google, Meta, and other paid channels together.',
      },
    ],
  },
  {
    icon: Megaphone,
    slug: 'meta-ads',
    path: '/services/digital-marketing/meta-ads',
    title: 'Meta Ads',
    description: 'Facebook and Instagram advertising, set up and managed for healthcare and pharmacy businesses.',
    services: [
      'Campaign strategy across Facebook and Instagram',
      'Audience targeting and creative development',
      'Budget management and optimization',
      'Monthly performance reporting',
    ],
    metaDescription:
      'Meta Ads (Facebook and Instagram advertising) from Nitin Anand Consulting for pharmacies and healthcare businesses — campaigns built and managed for measurable reach.',
    intro:
      'Meta\'s advertising platforms (Facebook and Instagram) reach people based on interest and location, not just active search — useful for building awareness of a pharmacy or healthcare business in its local area. We build and manage these campaigns end-to-end.',
    benefits: [
      { title: 'Local Awareness Building', description: 'Reach nearby audiences even before they\'re actively searching.' },
      { title: 'Visual, Engaging Formats', description: 'Creative suited to Meta\'s image and video-driven platforms.' },
      { title: 'Managed, Not Set-and-Forget', description: 'Active optimization based on what\'s actually performing.' },
    ],
    faqs: [
      {
        question: 'Do you create the ad creative too?',
        answer: 'Yes — campaign strategy, targeting, and creative development are all included.',
      },
      {
        question: 'Can Meta Ads and Google Ads run together?',
        answer: 'Yes, and often should — they reach customers at different points in the decision process.',
      },
    ],
  },
  {
    icon: Target,
    slug: 'ppc-performance-marketing',
    path: '/services/digital-marketing/ppc-performance-marketing',
    title: 'PPC & Performance Marketing',
    description: 'Paid advertising strategy across platforms, managed toward measurable business outcomes, not just clicks.',
    services: [
      'Cross-platform paid campaign strategy',
      'Budget allocation across channels',
      'Ongoing optimization toward business outcomes',
      'Performance reporting tied to enquiries, not just clicks',
    ],
    metaDescription:
      'PPC and performance marketing from Nitin Anand Consulting for pharmacies and healthcare businesses — cross-platform paid advertising managed toward measurable outcomes.',
    intro:
      'Running Google Ads and Meta Ads as two disconnected campaigns leaves budget and strategy on the table. Our PPC & Performance Marketing service coordinates paid spend across platforms toward one goal: measurable enquiries and results, not just clicks and impressions.',
    benefits: [
      { title: 'Coordinated, Not Siloed', description: 'Budget and strategy managed across platforms together.' },
      { title: 'Outcome-Focused', description: 'Optimized toward enquiries and conversions, not vanity metrics.' },
      { title: 'Clear ROI Visibility', description: 'Reporting tied to what the campaigns actually produced for your business.' },
    ],
    faqs: [
      {
        question: 'Is this the same as buying Google Ads and Meta Ads separately?',
        answer: 'It builds on both, but manages them as one coordinated strategy with shared budget logic and reporting, rather than two disconnected campaigns.',
      },
      {
        question: 'How do you measure performance?',
        answer: 'Tied to Analytics & Conversion Tracking — enquiries, calls, and form submissions, not just clicks or impressions.',
      },
    ],
  },
  {
    icon: LineChart,
    slug: 'analytics-conversion-tracking',
    path: '/services/digital-marketing/analytics-conversion-tracking',
    title: 'Analytics & Conversion Tracking',
    description: 'Setting up the tracking and reporting that shows what your website and campaigns are actually producing.',
    services: [
      'Website analytics setup',
      'Conversion tracking (calls, forms, enquiries)',
      'Campaign performance dashboards',
      'Regular reporting in plain language, not just raw numbers',
    ],
    metaDescription:
      'Analytics and conversion tracking setup from Nitin Anand Consulting for pharmacies and healthcare businesses — clear reporting on what your website and campaigns actually produce.',
    intro:
      'Without proper tracking, it\'s impossible to know whether a website or ad campaign is actually working. We set up analytics and conversion tracking so you can see, in plain terms, how many enquiries, calls, and form submissions your digital presence is actually generating.',
    benefits: [
      { title: 'Know What\'s Working', description: 'Clear visibility into which channels and campaigns actually drive enquiries.' },
      { title: 'Informed Budget Decisions', description: 'Spend allocated based on real performance, not assumptions.' },
      { title: 'Plain-Language Reporting', description: 'Reports that explain what happened, not just a dashboard of numbers.' },
    ],
    faqs: [
      {
        question: 'Do we need this if we\'re not running paid ads?',
        answer: 'Yes — analytics tracking is valuable for understanding organic/SEO performance too, not just paid campaigns.',
      },
      {
        question: 'What does "conversion" mean in this context?',
        answer: 'Any meaningful action — a phone call, a contact form submission, a WhatsApp enquiry — that indicates real business interest, not just a page visit.',
      },
    ],
  },
];
