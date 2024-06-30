import type { CSSProperties } from "react";
import { sendMessage } from "webext-bridge/content-script";

import { addFurigana } from "@/commons/addFurigana";
import { ExtEvent, ExtStorage } from "@/commons/constants";

import { initI18n } from "@/commons/i18n";

export default defineContentScript({
  matches: ["https://*/*"],
  runAt: "document_idle",

  async main() {
    const autoModeIsEnabled = await storage.getItem(`local:${ExtStorage.AutoMode}`);
    if (!autoModeIsEnabled) {
      /**
       * If the user does not enable the extension, the extension will not attempt to add furigana to the page.
       * The page must be refreshed after switching the extension to the enabled state.
       */
      return;
    }

    const { selector } = await sendMessage(
      "getSelector",
      { domain: location.hostname },
      "background",
    );

    if (!selector) {
      return;
    }

    // Add an active flag (little green dot) to the image.
    browser.runtime.sendMessage(ExtEvent.MarkActiveTab);

    // Reflow on a huge page causes severe page freezes and even the browser becomes unresponsive. (issue#16)
    const encoder = new TextEncoder();
    const utf8Bytes = encoder.encode(document.documentElement.outerHTML);
    const htmlSize = utf8Bytes.length / 1024; // KB
    if (htmlSize > 500) {
      const warningAttrs: CSSProperties = {
        position: "fixed",
        display: "flex",
        gap: "10px",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        fontWeight: "bold",
        color: "rgb(154,52,18)",
        backgroundColor: "rgb(255, 247, 237)",
        padding: "15px",
        borderRadius: "10px",
        border: "2px solid rgb(255, 237, 213)",
      };

      const warning = document.createElement("div");
      Object.assign(warning.style, warningAttrs);
      const icon = document.createElement("div");
      icon.textContent = "⚠";
      const text = document.createElement("span");

      const { t } = await initI18n("background");
      text.textContent = t("warning", {
        htmlSize: htmlSize.toFixed(2),
      });
      warning.appendChild(icon);
      warning.appendChild(text);
      document.body.appendChild(warning);
      setTimeout(() => {
        if (warning.matches(":hover")) {
          warning.addEventListener("mouseleave", () => {
            warning.remove();
          });
        } else {
          warning.remove();
        }
      }, 3000);
      return;
    }

    // Observer will not observe the element that is loaded for the first time on the page,
    // so it needs to execute `addFurigana` once immediately.
    const elements = Array.from(document.querySelectorAll(selector));
    addFurigana(...elements);

    const observer = new MutationObserver((records) => {
      const japaneseElements = records
        .flatMap((record) => Array.from(record.addedNodes))
        .filter((node) => node.nodeType === Node.ELEMENT_NODE)
        .flatMap((node) => Array.from((node as Element).querySelectorAll(selector)));

      addFurigana(...japaneseElements);
    });

    observer.observe(document.body, { childList: true, subtree: true });
  },
});
