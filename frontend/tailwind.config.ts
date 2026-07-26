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
    },
  },
  plugins: [],
};

export default config;
