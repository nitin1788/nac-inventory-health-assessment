import type { Config } from 'tailwindcss';

/**
 * Tailwind theme. Brand palette is a placeholder navy/gold pairing
 * (professional/corporate) until NAC's official brand assets are
 * provided (see PRD Section 30, Question 4) — swap the `brand`,
 * `ink`, and `accent` scales in one place when that happens.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1E3A5F',
          light: '#3B5A80',
          dark: '#0F2340',
          50: '#EEF3F8',
          100: '#DCE7F0',
        },
        ink: {
          DEFAULT: '#0A1628',
          900: '#0A1628',
          800: '#0F1F35',
        },
        accent: {
          DEFAULT: '#C89B4C',
          light: '#E0C07E',
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
