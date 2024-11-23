import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import { defineConfig } from "vite";

import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
  plugins: [cloudflareDevProxy(), reactRouter()],
});
