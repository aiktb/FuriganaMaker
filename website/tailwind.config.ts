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
      japanese: ["'M Plus Rounded 1C'", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      keyframes: {
        rising: {
          from: { transform: "translateY(-20px)", opacity: "0" },
          to: { transform: "translateY(0%)", opacity: "1" },
        },
        float: {
          from: {
            transform: "translateY(0px) rotate(0deg)",
            opacity: "1",
            borderRadius: "5%",
          },
          to: {
            transform: "translateY(-3500px) rotate(720deg)",
            opacity: "0.2",
            borderRadius: "50%",
          },
        },
        firework: {
          "0%": { transform: "translate(-50%, 60vh)", width: "0.5vmin", opacity: "1" },
          "50%": { width: "0.5vmin", opacity: "1" },
          "100%": { width: "45vmin", opacity: "0" },
        },
      },
      animation: {
        rising: "rising 2s ease",
        floating: "float 25s linear infinite",
        firework: "firework 2s infinite",
      },
    },
  },
} satisfies Config;
