import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{vue,html}'],
  theme: {
    fontFamily: {
      sans: ['DM Sans', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    },
    extend: {
      colors: {
        azure: {
          '50': '#edfaff',
          '100': '#d6f2ff',
          '200': '#b5eaff',
          '300': '#83deff',
          '400': '#48caff',
          '500': '#1eabff',
          '600': '#068dff',
          '700': '#0079ff',
          '800': '#085cc5',
          '900': '#0d509b',
          '950': '#0e315d'
        }
      }
    }
  },
  plugins: []
} satisfies Config
