import { describe, expect, test } from "vitest";

describe("Open extension popup page", () => {
  test("Every time you open it, there will be a fallback due to the storage reading.", async () => {
    const page = await browser.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    // <Logo /> is fallback, promise is not resolved
    await page.waitForSelector("#root > svg");
    // promise is resolved
    await page.waitForSelector("menu");
  });
  test("When the installation is complete, open the official website", async () => {
    const pageURLs = (await browser.pages()).map((page) => page.url());
    expect(pageURLs).toContain("https://furiganamaker.app/welcome");
  });
});
