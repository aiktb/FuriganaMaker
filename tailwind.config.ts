import { dynamicIconsPlugin, iconsPlugin } from "@egoist/tailwindcss-icons";
import headlessui from "@headlessui/tailwindcss";
import forms from "@tailwindcss/forms";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";
export default {
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "selector",
  plugins: [
    forms,
    headlessui({ prefix: "ui" }).handler,
    iconsPlugin().handler,
    dynamicIconsPlugin().handler,
    plugin(({ addBase }) => {
      addBase({
        ":focus-visible": {
          borderRadius: "0.25rem",
        },
      });
      addBase({
        "@font-face": {
          fontDisplay: "swap",
          fontFamily: "DM Sans",
          fontStyle: "normal",
          fontWeight: "normal",
          src: "url('./fonts/dm-sans-regular.woff2') format('woff2')",
        },
      });
      addBase({
        "@font-face": {
          fontDisplay: "swap",
          fontFamily: "DM Sans",
          fontStyle: "normal",
          fontWeight: "bold",
          src: "url('./fonts/dm-sans-bold.woff2') format('woff2')",
        },
      });
      addBase({
        "@font-face": {
          fontDisplay: "swap",
          fontFamily: "JetBrains Mono",
          fontStyle: "normal",
          fontWeight: "normal",
          src: "url('./fonts/jetbrains-mono-regular.woff2') format('woff2')",
        },
      });
      addBase({
        "@font-face": {
          fontDisplay: "swap",
          fontFamily: "JetBrains Mono",
          fontStyle: "normal",
          fontWeight: "bold",
          src: "url('./fonts/jetbrains-mono-bold.woff2') format('woff2')",
        },
      });
    }),
  ],
  theme: {
    fontFamily: {
      sans: ["DM Sans", ...defaultTheme.fontFamily.sans],
      mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
    },
    extend: {
      colors: {
        primary: "#0079ff",
      },
    },
  },
} satisfies Config;
