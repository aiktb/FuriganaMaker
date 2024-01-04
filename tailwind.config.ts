import headlessui from '@headlessui/tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{tsx,html}'],
  darkMode: 'class',
  plugins: [typography, forms, headlessui({ prefix: 'ui' }).handler],
  theme: {
    fontFamily: {
      sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
      mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
    },
    extend: {
      colors: {
        primary: '#0079ff',
      },
    },
  },
} satisfies Config;
