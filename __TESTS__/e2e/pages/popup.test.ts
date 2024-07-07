import { test } from "vitest";
test("open popup page", async () => {
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await page.waitForSelector("#app");
});
