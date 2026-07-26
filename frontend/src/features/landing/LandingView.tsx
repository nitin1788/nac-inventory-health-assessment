import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustIndicators } from './components/TrustIndicators';
import { ServicesPreview } from './components/ServicesPreview';
import { CTASection } from './components/CTASection';
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
      <main>
        <Hero />
        <TrustIndicators />
        <ServicesPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
