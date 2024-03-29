import headlessui from '@headlessui/tailwindcss';
import forms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./app/**/*.tsx'],
  darkMode: 'class',
  plugins: [forms, headlessui({ prefix: 'ui' }).handler],
  theme: {
    fontFamily: {
      display: ['Lobster', ...defaultTheme.fontFamily.sans],
      sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
      mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
    },
  },
} satisfies Config;
