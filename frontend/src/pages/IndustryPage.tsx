import { useParams } from 'react-router-dom';
import { IndustryLandingView } from '@/features/industries/IndustryLandingView';
import { INDUSTRIES_LIST } from '@/config/industries.data';
import { NotFoundPage } from './NotFoundPage';

export function IndustryPage() {
  const { slug } = useParams<{ slug: string }>();
  const industry = INDUSTRIES_LIST.find((item) => item.slug === slug);

  if (!industry) {
    return <NotFoundPage />;
  }

  return <IndustryLandingView industry={industry} />;
}
