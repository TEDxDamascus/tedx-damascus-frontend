import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tedx-red': '#E21E2C',
        'tedx-black': '#000001',
        'tedx-gray': '#D7D7D7',
        'tedx-light': '#FBFBFB',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        arabic: ['var(--font-cairo)', 'sans-serif'],
        alamani: ['Almarai', 'sans-serif'],
        helvetica: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};

export default config;
