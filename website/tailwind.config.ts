import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'scroll-dot': {
          '0%, 100%': { transform: 'translateY(0px)', opacity: '1' },
          '50%':       { transform: 'translateY(7px)', opacity: '0.4' },
        },
        'scroll-wheel': {
          '0%':   { transform: 'translateY(0px)', opacity: '1' },
          '60%':  { transform: 'translateY(7px)', opacity: '0' },
          '61%':  { transform: 'translateY(0px)', opacity: '0' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
      },
      animation: {
        'spin-slow':    'spin-slow 20s linear infinite',
        'scroll-dot':   'scroll-dot 1.8s ease-in-out infinite',
        'scroll-wheel': 'scroll-wheel 1.8s ease-in-out infinite',
      },
      colors: {
        'page-bg': 'var(--page-bg)', // #101010
        'card-bg': '#1A1A1A',

        'tedx-red':   '#E21E2C',
        'tedx-black': '#000001',
        'tedx-gray':  '#D7D7D7',
        primary: {
          DEFAULT: '#eb0028',
          dark:    '#930015',
          light:   '#ffb3ae',
          lighter: '#ffdad7',
          'on-dark': '#68000c',
        },
        secondary: {
          DEFAULT: '#ffffff',
          100:     '#e2e2e2',
          200:     '#c6c6c7',
          300:     '#454747',
        },
        tertiary: {
          DEFAULT: '#1b1b1b',
          dark:    '#131313',
          mid:     '#353535',
          light:   '#767575',
        },
        neutral: {
          DEFAULT: '#000000',
          100:     '#0e0e0e',
          200:     '#131313',
          300:     '#2a2a2a',
        },
        surface: '#1b1b1b',
        border:  '#2a2a2a',
      },
      fontFamily: {
        sans:           ['var(--font-inter)'],
        arabic:         ['var(--font-cairo)',   'sans-serif'],
        alamani:        ['var(--font-almarai)', 'sans-serif'],
        helvetica:      ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'arial-rounded': ['"Arial Rounded MT Bold"', 'Arial', 'sans-serif'],
        manrope:        ['var(--font-manrope)', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};

export default config;
