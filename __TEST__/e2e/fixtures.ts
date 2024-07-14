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
        "--headless=new",
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let background: { url(): string };
    background = context.serviceWorkers().at(0)!;
    if (!background) {
      background = await context.waitForEvent("serviceworker");
    }

    const extensionId = background.url().split("/")[2];
    await use(extensionId!);
  },
  page: async ({ page }, use) => {
    const logs: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        logs.push(`[${msg.type()}] ${msg.text()}`);
      }
    });
    page.on("pageerror", (error) => {
      logs.push(`[${error.name}] ${error.message}`);
    });
    await use(page);
    expect(logs).toStrictEqual([]);
  },
});
export const { expect, describe } = test;
