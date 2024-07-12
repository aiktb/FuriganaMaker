import path from "node:path";
import { type BrowserContext, test as base, chromium } from "@playwright/test";

const pathToExtension = path.resolve(".output/chrome-mv3");

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  // biome-ignore lint/correctness/noEmptyPattern: playwright analyzes dependencies using deconstruction
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let background: { url(): string };
    if (pathToExtension.endsWith("-mv3")) {
      background = context.serviceWorkers().at(0)!;
      if (!background) {
        background = await context.waitForEvent("serviceworker");
      }
    } else {
      background = context.backgroundPages().at(0)!;
      if (!background) {
        background = await context.waitForEvent("backgroundpage");
      }
    }

    const extensionId = background.url().split("/")[2];
    await use(extensionId!);
  },
});
export const { expect, describe } = test;