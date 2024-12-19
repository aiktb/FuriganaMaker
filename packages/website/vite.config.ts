import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";

import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import { defineConfig } from "vite";

import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
  plugins: [cloudflareDevProxy(), reactRouter()],
  css: {
    postcss: {
      plugins: [tailwind, autoprefixer],
    },
  },
});
