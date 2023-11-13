import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{vue,html}'],
  theme: {
    fontFamily: {
      sans: ['DM Sans', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    }
  },
  plugins: []
} satisfies Config
