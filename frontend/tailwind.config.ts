import type { Config } from 'tailwindcss';

/**
 * Tailwind theme — premium healthcare + consulting design system.
 *
 * Three brand colors carry specific meaning sitewide (do not mix their
 * roles):
 *   - `brand` (navy)  — headings, navigation, primary buttons, trust
 *                        sections, footer, major CTA surfaces.
 *   - `accent` (green) — growth/healthcare/positive indicators, the
 *                        WhatsApp CTA, and the Inventory & Operations
 *                        vertical's identity color.
 *   - `sky` (blue)     — the Digital Marketing & Growth vertical's
 *                        identity color only; not used as a general
 *                        accent elsewhere.
 *
 * The default Tailwind `slate` scale is overridden below (not replaced
 * with new token names) so every existing `text-slate-600` /
 * `border-slate-200` usage across the app automatically inherits the
 * new premium navy-gray palette from one place, per this file's
 * existing "swap values in one place" convention.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#071B49', // primary navy
          light: '#0B2A63', // secondary navy
          dark: '#050F2E', // deepest navy — footer/hover surfaces
          50: '#EEF2F8',
          100: '#DCE5EE',
        },
        // Dark navy reserved for the footer — the one section that
        // stays dark against an otherwise white/light-gray site.
        ink: {
          DEFAULT: '#0A1628',
          900: '#071B49',
          800: '#0B2A63',
        },
        // Healthcare green — growth, positive indicators, WhatsApp CTA,
        // and the Inventory & Operations vertical's identity color.
        accent: {
          DEFAULT: '#238636',
          light: '#EAF7EE',
          dark: '#1B6B2A',
        },
        // Accent blue — the Digital Marketing & Growth vertical's
        // identity color only.
        sky: {
          DEFAULT: '#2563B9',
          light: '#EAF1FC',
          dark: '#1D4F94',
        },
        surface: '#F7FAFC',
        // Default Tailwind slate scale, nudged toward the spec's cool
        // navy-gray text/border palette (#10233F main text, #53657D
        // secondary text, #DCE5EE borders slot in at 900/600/200,
        // the shades already used throughout the app).
        slate: {
          50: '#F7FAFC',
          100: '#EEF2F7',
          200: '#DCE5EE',
          300: '#C3D0DE',
          400: '#8CA0B8',
          500: '#6B7F99',
          600: '#53657D',
          700: '#3A4A61',
          800: '#22314A',
          900: '#10233F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Subtle, layered navy shadow — never heavy per design spec.
        soft: '0 1px 2px -1px rgba(7,27,73,0.06), 0 4px 12px -4px rgba(7,27,73,0.08)',
        'soft-lg': '0 2px 8px -2px rgba(7,27,73,0.08), 0 16px 32px -12px rgba(7,27,73,0.12)',
        // Subtle green-tinted glow for hover/CTA emphasis.
        glow: '0 0 0 1px rgba(35,134,54,0.15), 0 8px 24px -8px rgba(35,134,54,0.25)',
      },
      backgroundImage: {
        'mesh-brand': 'linear-gradient(135deg, #071B49 0%, #050F2E 100%)',
        'mesh-accent': 'radial-gradient(circle at 30% 20%, rgba(35,134,54,0.14), transparent 60%)',
      },
    },
  },
  plugins: [],
};

export default config;
