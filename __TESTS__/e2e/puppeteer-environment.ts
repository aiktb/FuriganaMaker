import path from "node:path";
import puppeteer from "puppeteer";
import type { Environment } from "vitest";

export default (<Environment>{
  name: "puppeteer",
  transformMode: "ssr",

  async setup(global, options) {
    // Puppeteer only supports chrome, so you can hard-code this path to any chromium output
    const pathToExtension = path.resolve(".output/chrome-mv3");
    const browser = await puppeteer.launch({
      headless: true,
      ...(options ?? {}),
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        ...(options?.args ?? []),
      ],
    });

    const expectedType = pathToExtension.endsWith("-mv3") ? "service_worker" : "background_page";
    const background = await browser.waitForTarget((target) => target.type() === expectedType);

    // Assign any global variables that will be used in the tests
    global.browser = browser;
    global.extensionId = new URL(background.url()).hostname;

    return {
      teardown: () => browser.close(),
    };
  },
});
