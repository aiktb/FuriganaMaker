import { ExtEvent } from "@/commons/constants";

export const registerOnInstalled = () => {
  browser.runtime.onInstalled.addListener((details) => {
    switch (details.reason) {
      case chrome.runtime.OnInstalledReason.INSTALL: {
        // Setting the contextMenu must not be outside of `runtime.onInstalled`,
        // otherwise it will report an error for creating the contextMenu multiple times.
        const contextMenuItem: chrome.contextMenus.CreateProperties = {
          id: ExtEvent.AddFurigana,
          title: browser.i18n.getMessage("shortcutAddFurigana"),
          contexts: ["page"],
          documentUrlPatterns: ["https://*/*"],
        };
        browser.contextMenus.create(contextMenuItem);
        browser.tabs.create({ url: "https://furiganamaker.app/welcome" });
        break;
      }
      case chrome.runtime.OnInstalledReason.UPDATE: {
        // V1.2.3 -> major.minor.patch
        // Only open the Changelog page to prompt the user when a new feature is available.
        const [majorPrevVersion, minorPrevVersion] = details.previousVersion!.split(".");
        const [majorCurrVersion, minorCurrVersion] = browser.runtime
          .getManifest()
          .version.split(".");

        if (majorPrevVersion !== majorCurrVersion || minorPrevVersion !== minorCurrVersion) {
          browser.tabs.create({ url: browser.runtime.getURL("/options.html#/changelog") });
        }
        break;
      }
    }
  });
};
