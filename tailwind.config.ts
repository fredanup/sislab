import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'custom-blue': '0 4px 6px -1px rgba(14, 165, 233, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
