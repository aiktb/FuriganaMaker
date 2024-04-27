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
    iconsPlugin({ collections: getIconCollections(["logos", "fa6-brands", "mdi"]) }).handler,
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
      keyframes: {
        rising: {
          from: { transform: "translateY(-20px)", opacity: "0" },
          to: { transform: "translateY(0%)", opacity: "1" },
        },
        float: {
          from: {
            transform: "translateY(0px) rotate(0deg)",
            opacity: "1",
            borderRadius: "0",
          },
          to: {
            transform: "translateY(-1000px) rotate(720deg)",
            opacity: "0",
            borderRadius: "50%",
          },
        },
      },
      animation: {
        rising: "rising 2s ease",
        floating: "float 25s linear infinite",
      },
    },
  },
} satisfies Config;
