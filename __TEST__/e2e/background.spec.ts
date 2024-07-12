import {} from "@/commons/constants";

import { describe, expect, test } from "./fixtures";

describe("Extension background script", () => {
  test.beforeEach(async ({ page, extensionId }) => {
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
  });

  test("When the installation is complete, open the official website", async ({
    context,
    page,
  }) => {
    await page.waitForTimeout(500);
    const pages = context.pages();
    const pageURLs = pages.map((page) => page.url());
    expect(pageURLs).toContain("https://furiganamaker.app/welcome");
  });

  // test("Setting default extension storage", async ({ page }) => {
  //   const defaultConfig = {
  //     [ExtStorage.AutoMode]: true,
  //     [ExtStorage.KanjiFilter]: false,
  //     [ExtStorage.DisplayMode]: DisplayMode.Always,
  //     [ExtStorage.FuriganaType]: FuriganaType.Hiragana,
  //     [ExtStorage.SelectMode]: SelectMode.Original,
  //     [ExtStorage.FontSize]: 75, // ${fontsize}% relative to the parent font.
  //     [ExtStorage.FontColor]: "currentColor",
  //     // [ExtStorage.SelectorRules]: defaultSelectorRules,
  //   };

  //   for (const key of Object.keys(defaultConfig)) {
  //     const storage = await page.evaluate(`chrome.storage.local.get("${key}")`);
  //     expect(storage[key]).toBe(defaultConfig[key]);
  //   }
  // });
});
