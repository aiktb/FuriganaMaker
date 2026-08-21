import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Scoped to `e2e` so that Playwright's default `testMatch` does not also pick up
  // the Vitest unit tests in `__tests__/unit`.
  testDir: "__tests__/e2e",

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,

  workers: 1,

  // Reporter to use
  reporter: [["html", { open: "never" }]],

  use: {
    // Collect trace when retrying the failed test.
    trace: "on-first-retry",
  },

  // Configure projects for major browsers.
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
