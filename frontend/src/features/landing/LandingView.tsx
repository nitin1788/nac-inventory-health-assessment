import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustStatistics } from './components/TrustStatistics';
import { WhyChooseNAC } from './components/WhyChooseNAC';
import { Services } from './components/Services';
import { HowItWorks } from './components/HowItWorks';
import { ReportPreview } from './components/ReportPreview';
import { IndustriesServed } from './components/IndustriesServed';
import { Testimonials } from './components/Testimonials';
import { FinalCTABanner } from './components/FinalCTABanner';
import { Footer } from './components/Footer';

/**
 * Full landing page composition. Pages stay thin (see routing
 * convention in ARCHITECTURE.md) — this is where the landing page's
 * sections are assembled.
 */
export function LandingView() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main id="main-content">
        <Hero />
        <TrustStatistics />
        <WhyChooseNAC />
        <Services />
        <HowItWorks />
        <ReportPreview />
        <IndustriesServed />
        <Testimonials />
        <FinalCTABanner />
      </main>
      <Footer />
    </div>
  );
}
