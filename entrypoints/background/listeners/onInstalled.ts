import { ExtEvent } from "@/commons/constants";

export const registerOnInstalled = () => {
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
      chrome.tabs.create({ url: "https://furiganamaker.app/welcome" });

      // Setting the contextMenu must not be outside of `runtime.onInstalled`,
      // otherwise it will report an error for creating the contextMenu multiple times.
      const contextMenuItem: chrome.contextMenus.CreateProperties = {
        id: ExtEvent.AddFurigana,
        title: chrome.i18n.getMessage("shortcutAddFurigana"),
        contexts: ["page"],
        documentUrlPatterns: ["https://*/*"],
      };
      chrome.contextMenus.create(contextMenuItem);
    }
  });
};
