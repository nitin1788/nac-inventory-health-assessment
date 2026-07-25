import type { Config } from 'tailwindcss';

/**
 * Tailwind theme is intentionally minimal in Milestone 3 — brand
 * colors/typography/spacing scale will be extended once NAC's brand
 * assets are provided (see PRD Section 30, Question 4) and the
 * landing page is designed in a later milestone.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1E3A5F', // placeholder navy — professional/corporate, replace with NAC brand color
          light: '#3B5A80',
          dark: '#0F2340',
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
