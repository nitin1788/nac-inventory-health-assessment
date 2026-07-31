import type { Config } from 'tailwindcss';

/**
 * Tailwind theme. Premium light consulting palette — navy primary,
 * gold accent — matching NAC's official brand colors. Swap `brand`,
 * `ink`, and `accent` scales in one place if the brand palette changes.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0F2A52',
          light: '#3B5A80',
          dark: '#0A1D3B',
          50: '#EEF3F8',
          100: '#DCE7F0',
        },
        // Dark navy reserved for the footer — the one section that
        // stays dark against an otherwise white/light-gray site.
        ink: {
          DEFAULT: '#0A1628',
          900: '#0A1628',
          800: '#0F1F35',
        },
        accent: {
          DEFAULT: '#C89B3C',
          light: '#E0C07E',
          // Deeper gold for text/hover states on light backgrounds,
          // where the DEFAULT gold doesn't have enough contrast.
          dark: '#8A6A1E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Layered, soft-edged navy shadow — replaces flat shadow-sm on
        // cards that need more depth without looking harsh.
        soft: '0 2px 8px -2px rgba(15,42,82,0.08), 0 12px 32px -12px rgba(15,42,82,0.14)',
        'soft-lg': '0 4px 16px -4px rgba(15,42,82,0.10), 0 24px 48px -16px rgba(15,42,82,0.18)',
        // Subtle gold-tinted glow for hover/CTA emphasis.
        glow: '0 0 0 1px rgba(200,155,60,0.15), 0 8px 32px -8px rgba(200,155,60,0.25)',
      },
      backgroundImage: {
        'mesh-brand': 'linear-gradient(135deg, #0F2A52 0%, #0A1D3B 100%)',
        'mesh-gold': 'radial-gradient(circle at 30% 20%, rgba(200,155,60,0.16), transparent 60%)',
      },
    },
  },
  plugins: [],
};

export default config;
