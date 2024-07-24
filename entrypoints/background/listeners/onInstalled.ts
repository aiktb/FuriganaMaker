import { ExtEvent } from "@/commons/constants";

export const registerOnInstalled = () => {
  chrome.runtime.onInstalled.addListener((details) => {
    switch (details.reason) {
      case chrome.runtime.OnInstalledReason.INSTALL: {
        // Setting the contextMenu must not be outside of `runtime.onInstalled`,
        // otherwise it will report an error for creating the contextMenu multiple times.
        const contextMenuItem: chrome.contextMenus.CreateProperties = {
          id: ExtEvent.AddFurigana,
          title: chrome.i18n.getMessage("shortcutAddFurigana"),
          contexts: ["page"],
          documentUrlPatterns: ["https://*/*"],
        };
        chrome.contextMenus.create(contextMenuItem);
        chrome.tabs.create({ url: "https://furiganamaker.app/welcome" });
        break;
      }
      case chrome.runtime.OnInstalledReason.UPDATE: {
        chrome.tabs.create({ url: chrome.runtime.getURL("options.html#/changelog") });
        break;
      }
    }
  });
};
