import type { Page } from "@playwright/test";
import { expect, test } from "../fixtures";

async function mockModel(
  page: Page,
  state = "downloadable",
  output = '[{"surface":"学生","reading":"ガクセイ"}]',
) {
  await page.addInitScript(
    ({ state, output }) => {
      const controls = {
        creates: 0,
        destroyed: 0,
        prompts: 0,
        delay: false,
        finishDownload: () => {
          /* Replaced when the operation starts. */
        },
        finishPrompt: () => {
          /* Replaced when the operation starts. */
        },
        failDownload: () => {
          /* Replaced when the operation starts. */
        },
        progress: (_loaded: number) => {
          /* Replaced when the operation starts. */
        },
      };
      Object.assign(window, { aiTest: controls });
      const session = () => ({
        clone: () => Promise.resolve(session()),
        prompt: () => {
          controls.prompts++;
          if (!controls.delay) {
            return Promise.resolve(output);
          }
          // Deliberately ignore abort to test late-result protection as well.
          return new Promise<string>((resolve) => {
            controls.finishPrompt = () => resolve(output);
          });
        },
        destroy: () => {
          controls.destroyed++;
        },
      });
      Object.defineProperty(window, "LanguageModel", {
        configurable: true,
        value:
          state === "unsupported"
            ? undefined
            : {
                availability: () =>
                  state === "error" ? Promise.reject(new Error("failed")) : Promise.resolve(state),
                create: (options: {
                  monitor: (monitor: {
                    addEventListener: (
                      type: string,
                      fn: (event: { loaded: number }) => void,
                    ) => void;
                  }) => void;
                }) => {
                  controls.creates++;
                  options.monitor({
                    addEventListener: (_type, listener) => {
                      controls.progress = (loaded) => listener({ loaded });
                    },
                  });
                  if (state === "available") {
                    return Promise.resolve(session());
                  }
                  return new Promise((resolve, reject) => {
                    controls.finishDownload = () => {
                      state = "available";
                      resolve(session());
                    };
                    controls.failDownload = () => reject(new Error("download failed"));
                  });
                },
              },
      });
    },
    { state, output },
  );
}

// The mock controls stay in the browser; no production-only testing hooks.
async function control(page: Page, action: "download" | "fail" | "progress" | "delay" | "finish") {
  await page.evaluate((action) => {
    const mock = (
      window as typeof window & {
        aiTest: {
          finishDownload(): void;
          failDownload(): void;
          progress(value: number): void;
          delay: boolean;
          finishPrompt(): void;
        };
      }
    ).aiTest;
    if (action === "download") {
      mock.finishDownload();
    }
    if (action === "fail") {
      mock.failDownload();
    }
    if (action === "progress") {
      mock.progress(0.45);
    }
    if (action === "delay") {
      mock.delay = true;
    }
    if (action === "finish") {
      mock.finishPrompt();
    }
  }, action);
}

for (const state of ["unsupported", "unavailable", "error"]) {
  test(`AI ${state}: dictionary remains usable`, async ({ page, extensionId }) => {
    await mockModel(page, state);
    await page.goto(`chrome-extension://${extensionId}/options.html#/playground`);
    await expect(page.getByTestId("ai-model-status")).toContainText(
      state === "unsupported"
        ? "does not expose"
        : state === "unavailable"
          ? "unavailable"
          : "Could not check",
    );
    await expect(
      page.getByRole("button", { name: "Generate AI furigana", exact: true }),
    ).toBeDisabled();
    await page.getByTestId("playground-japanese-textarea").fill("学生");
    await expect(page.getByTestId("playground-furigana-preview-area").locator("rt")).toHaveText(
      "がくせい",
    );
  });
}

test("explicit download, progress, AI output and lossless result comparison", async ({
  page,
  extensionId,
}) => {
  await mockModel(page);
  await page.goto(`chrome-extension://${extensionId}/options.html#/playground`);
  await expect(page.getByTestId("ai-model-status")).toContainText("Supported.");
  expect(await page.evaluate("window.aiTest.creates")).toBe(0);
  await page.getByRole("button", { name: "Download model and enable" }).click();
  await control(page, "progress");
  await expect(page.getByRole("progressbar")).toHaveAttribute("value", "45");
  await control(page, "download");
  await expect(page.getByTestId("ai-model-status")).toHaveText("Japanese AI model ready.");
  await page.getByTestId("playground-japanese-textarea").fill("学生");
  await page.getByRole("button", { name: "Generate AI furigana", exact: true }).click();
  const preview = page.getByTestId("playground-furigana-preview-area");
  await expect(preview.locator("rt")).toHaveText("がくせい");
  await page.getByRole("radio", { name: "Romaji" }).click();
  await expect(preview.locator("rt")).toHaveText("gakusei");
  await page.getByRole("radio", { name: "ひらがな" }).click();
  await expect(preview.locator("rt")).toHaveText("がくせい");
  await page.getByRole("button", { name: "Dictionary result", exact: true }).click();
  await expect(preview.locator("rt")).toHaveText("がくせい");
  await page.getByRole("button", { name: "AI result", exact: true }).click();
  await expect(preview.locator("rt")).toHaveText("がくせい");
  expect(await page.evaluate("window.aiTest.creates")).toBe(1);
  expect(await page.evaluate("window.aiTest.destroyed")).toBeGreaterThan(0);
});

test("download failure can be retried", async ({ page, extensionId }) => {
  await mockModel(page, "downloading");
  await page.goto(`chrome-extension://${extensionId}/options.html#/playground`);
  await page.getByRole("button", { name: "View download progress" }).click();
  await control(page, "fail");
  await expect(page.getByRole("alert")).toContainText("Model setup failed");
  await page.getByRole("button", { name: "View download progress" }).click();
  await control(page, "download");
  await expect(page.getByTestId("ai-model-status")).toHaveText("Japanese AI model ready.");
});

test("invalid AI output never replaces the dictionary", async ({ page, extensionId }) => {
  await mockModel(page, "available", '[{"surface":"学校","reading":"ガッコウ"}]');
  await page.goto(`chrome-extension://${extensionId}/options.html#/playground`);
  await page.getByTestId("playground-japanese-textarea").fill("学生");
  await page.getByRole("button", { name: "Generate AI furigana", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("changed the original text");
  await expect(page.getByTestId("playground-furigana-preview-area").locator("ruby")).toHaveCount(0);
  await page.getByRole("button", { name: "Dictionary result", exact: true }).click();
  await expect(page.getByTestId("playground-furigana-preview-area").locator("rt")).toHaveText(
    "がくせい",
  );
});

for (const action of ["edit", "stop", "navigate"] as const) {
  test(`${action} cancels inference and ignores late results`, async ({ page, extensionId }) => {
    await mockModel(page, "available");
    await page.goto(`chrome-extension://${extensionId}/options.html#/playground`);
    await control(page, "delay");
    await page.getByTestId("playground-japanese-textarea").fill("学生");
    await page.getByRole("button", { name: "Generate AI furigana", exact: true }).click();
    await expect.poll(() => page.evaluate("window.aiTest.prompts")).toBe(1);
    if (action === "edit") {
      await page.getByTestId("playground-japanese-textarea").fill("学校");
    } else if (action === "stop") {
      await page.getByRole("button", { name: "Stop waiting / generating" }).click();
    } else {
      await page.getByRole("link", { name: "Settings", exact: true }).click();
    }
    await control(page, "finish");
    await expect.poll(() => page.evaluate("window.aiTest.destroyed")).toBeGreaterThan(1);
    if (action !== "navigate") {
      await expect(
        page.getByTestId("playground-furigana-preview-area").locator("ruby"),
      ).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: "Generate AI furigana", exact: true }),
      ).toBeEnabled();
    }
  });
}

test("AI word tokens annotate only kanji through the existing splitter", async ({
  page,
  extensionId,
}) => {
  const tokens = [
    { surface: "😊", reading: "*" },
    { surface: "お守り", reading: "オマモリ" },
    { surface: "の", reading: "ノ" },
    { surface: "作り方", reading: "ツクリカタ" },
    { surface: "です", reading: "デス" },
    { surface: "。", reading: "*" },
    { surface: "10", reading: "ジュッ" },
    { surface: "頭身", reading: "トウシン" },
    { surface: "テスト", reading: "テスト" },
  ];
  await mockModel(page, "available", JSON.stringify(tokens));
  await page.goto(`chrome-extension://${extensionId}/options.html#/playground`);
  const original = tokens.map((token) => token.surface).join("");
  await page.getByTestId("playground-japanese-textarea").fill(original);
  await page.getByRole("button", { name: "Generate AI furigana", exact: true }).click();
  const preview = page.getByTestId("playground-furigana-preview-area");
  await expect(preview.locator("rt")).toHaveText(["まも", "つく", "かた", "とうしん"]);
  expect(
    await preview
      .locator("ruby")
      .evaluateAll((elements) => elements.map((el) => el.firstChild?.textContent)),
  ).toEqual(["守", "作", "方", "頭身"]);
  expect(
    await preview.evaluate((el) => {
      const copy = el.cloneNode(true) as HTMLElement;
      for (const rt of copy.querySelectorAll("rt")) {
        rt.remove();
      }
      return copy.textContent;
    }),
  ).toBe(original);
});
