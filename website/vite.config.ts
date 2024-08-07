import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from "@remix-run/dev";
import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind, autoprefixer],
    },
  },
  plugins: [remixCloudflareDevProxy(), remix(), tsconfigPaths()],
});
