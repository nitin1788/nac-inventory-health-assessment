import { Megaphone } from 'lucide-react';
import { ServiceVerticalHubView } from '@/features/services/ServiceVerticalHubView';
import { DIGITAL_SERVICES } from '@/config/services.digital.data';
import { ROUTES } from '@/config/constants';

export function DigitalMarketingHubPage() {
  return (
    <ServiceVerticalHubView
      path={ROUTES.digitalMarketingHub}
      title="Digital Marketing & Growth"
      metaDescription="Digital marketing services from Nitin Anand Consulting for pharmacies and healthcare businesses — websites, SEO, Google Business Profile, social media, and Google/Meta Ads."
      eyebrow="Vertical 2"
      heroIcon={Megaphone}
      intro="Websites, SEO, local visibility, social media, and paid advertising, built around how patients and customers actually search for and choose a pharmacy or healthcare business."
      services={DIGITAL_SERVICES}
      accentGradient="from-sky to-sky-dark"
      accentTextClass="text-sky-dark"
    />
  );
}
