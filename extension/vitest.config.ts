import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests cover `src/core`, the layer that depends on nothing but npm packages.
// Anything touching the DOM, storage or the extension APIs is covered by the
// Playwright suite in `__tests__/e2e`.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["__tests__/unit/**/*.test.ts"],
  },
});
