// tailwind.config.js
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      display: ['responsive', 'group-hover', 'focus-within', 'hover', 'focus'],
    },
  },
  plugins: [],
};

export default config;
