import { sendMessage } from "@/commons/message";
import type { CSSProperties } from "react";

import { addFurigana } from "@/commons/addFurigana";
import { ExtEvent, ExtStorage } from "@/commons/constants";
import { getGeneralSettings, getMoreSettings } from "@/commons/utils";

export default defineContentScript({
  matches: ["https://*/*"],
  runAt: "document_idle",

  async main() {
    const autoModeIsEnabled = await getGeneralSettings(ExtStorage.AutoMode);
    if (!autoModeIsEnabled) {
      /**
       * If the user does not enable the extension, the extension will not attempt to add furigana to the page.
       * The page must be refreshed after switching the extension to the enabled state.
       */
      return;
    }

    const customRule = await sendMessage("getSelector", { domain: location.hostname });
    const selector = customRule.selector || "[lang='ja'], [lang='ja-JP']";
    const elements = Array.from(document.querySelectorAll(selector));
    // Reflow on a huge page causes severe page freezes and even the browser becomes unresponsive. (issue#16)
    const htmlSize = getHtmlSize();
    const warningDisabled = await getMoreSettings(ExtStorage.DisableWarning);
    if (!warningDisabled && htmlSize > 500 && elements.length > 0) {
      showWarning(htmlSize);
      return;
    }

    // Observer will not observe the element that is loaded for the first time on the page,
    // so it needs to execute `addFurigana` once immediately.
    if (elements.length) {
      browser.runtime.sendMessage(ExtEvent.MarkActiveTab);
      addFurigana(...elements);
    }

    const observer = new MutationObserver((records) => {
      const japaneseElements = records
        .flatMap((record) => Array.from(record.addedNodes))
        .filter((node) => node.nodeType === Node.ELEMENT_NODE)
        .flatMap((node) => Array.from((node as Element).querySelectorAll(selector)));

      if (japaneseElements.length) {
        browser.runtime.sendMessage(ExtEvent.MarkActiveTab);
        addFurigana(...japaneseElements);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  },
});

function getHtmlSize() {
  const encoder = new TextEncoder();
  const utf8Bytes = encoder.encode(document.documentElement.outerHTML);
  const htmlSize = utf8Bytes.length / 1024; // KB
  return htmlSize;
}

function showWarning(htmlSize: number) {
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

  text.textContent = browser.i18n.getMessage("contentScriptWarning", htmlSize.toFixed(2));
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
}
