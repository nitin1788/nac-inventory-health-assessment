import { motion } from 'framer-motion';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { buildResponsiveSrcSet } from '@/shared/utils/responsiveImage';

/**
 * Hero's right-side visual — a single real photograph (see
 * public/images/hero/nac-hero-consultant.webp). No SVG illustration, no
 * floating stat cards — the photo carries the section on its own. The
 * supplied photo is landscape (~16:9), not portrait — aspect-video and a
 * right-biased object-position keep the consultant's face in frame without
 * forcing a portrait crop the source image wasn't shot for.
 */
export function HeroVisualPremium() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] shadow-soft-lg lg:mx-0 lg:max-w-none"
    >
      <ResponsiveImage
        src="/images/hero/nac-hero-consultant.webp"
        srcSet={buildResponsiveSrcSet('/images/hero/nac-hero-consultant.webp', 1600)}
        sizes="(min-width: 1024px) 530px, 100vw"
        alt="NAC healthcare business consultant working at his desk in a pharmacy consulting office"
        width={1600}
        height={900}
        priority
        className="aspect-video w-full object-cover"
        style={{ objectPosition: '72% 20%' }}
      />
    </motion.div>
  );
}
