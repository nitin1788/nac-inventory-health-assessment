import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ConsultingValueSection } from './components/ConsultingValueSection';
import { TrustStatistics } from './components/TrustStatistics';
import { TwoVerticalsSection } from './components/TwoVerticalsSection';
import { OperationsSection } from './components/OperationsSection';
import { DigitalMarketingSection } from './components/DigitalMarketingSection';
import { HowWeHelp } from './components/HowWeHelp';
import { WhyChooseNAC } from './components/WhyChooseNAC';
import { IndustriesServed } from './components/IndustriesServed';
import { InsightsTeaser } from './components/InsightsTeaser';
import { BusinessProblemsSection } from './components/BusinessProblemsSection';
import { FinalCTABanner } from './components/FinalCTABanner';
import { Footer } from './components/Footer';

/**
 * Full landing page composition. Pages stay thin (see routing
 * convention in ARCHITECTURE.md) — this is where the landing page's
 * sections are assembled.
 *
 * Services.tsx, HowItWorks.tsx, ReportPreview.tsx, and Testimonials.tsx
 * are intentionally no longer rendered here — the first three describe
 * the discontinued free assessment flow specifically (4-step diagnostic,
 * sample PDF/KPI report), and Testimonials.tsx's "Client Success
 * Stories" section is superseded by BusinessProblemsSection.tsx (no
 * fabricated testimonials exist for this business). Files are kept, not
 * deleted — see NAC_PHASE_1_IMPLEMENTATION_PLAN.md §4.
 */
export function LandingView() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main id="main-content">
        <Hero />
        <ConsultingValueSection />
        <TrustStatistics />
        <TwoVerticalsSection />
        <OperationsSection />
        <DigitalMarketingSection />
        <HowWeHelp />
        <WhyChooseNAC />
        <IndustriesServed />
        <InsightsTeaser />
        <BusinessProblemsSection />
        <FinalCTABanner />
      </main>
      <Footer />
    </div>
  );
}
