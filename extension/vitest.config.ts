import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests cover the pure logic under `src/commons` only. Anything that touches the
// DOM or the extension APIs is covered by the Playwright suite in `__TEST__/e2e`.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["__TEST__/unit/**/*.test.ts"],
  },
});
