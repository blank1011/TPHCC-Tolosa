import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1B2E6B',
        red: '#C0392B',
        gold: '#D4A017',
        'light-gray': '#F4F6F9',
        'mid-gray': '#6B7280'
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        accent: ['Montserrat', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
