import { describe, test } from "./fixtures";

describe("Extension popup page", () => {
  test("Every time you open it, there will be a fallback due to the storage reading.", async ({
    page,
    extensionId,
  }) => {
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    // <Logo /> is fallback, promise is not resolved
    await page.waitForSelector("#root > svg");
    // promise is resolved
    await page.waitForSelector("menu");
  });
  //   test("When the installation is complete, open the official website", async () => {
  //     const pageURLs = (await browser.pages()).map((page) => page.url());
  //     expect(pageURLs).toContain("https://furiganamaker.app/welcome");
  //   });
});
