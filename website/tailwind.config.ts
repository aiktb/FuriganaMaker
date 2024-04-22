import { getIconCollections, iconsPlugin } from "@egoist/tailwindcss-icons";
import headlessui from "@headlessui/tailwindcss";
import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
export default {
  content: ["./app/**/*.tsx"],
  plugins: [
    forms,
    headlessui({ prefix: "ui" }).handler,
    iconsPlugin({ collections: getIconCollections(["fa6-brands", "mdi"]) }).handler,
  ],
  theme: {
    fontFamily: {
      display: ["Lobster", ...defaultTheme.fontFamily.sans],
      sans: ["DM Sans", ...defaultTheme.fontFamily.sans],
      mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
    },
    extend: {
      colors: {
        primary: "hsl(161, 55%, 66%)",
      },
    },
  },
} satisfies Config;
