import { CONTEXT_MENU_ID } from "./onCtxMenuClick";

export const registerOnInstalled = () => {
  browser.runtime.onInstalled.addListener((details) => {
    // If the context menu is not re-registered upon update, the menu may become missing or out of date.
    // Remove the contextMenu before creating it to avoid creating multiple contextMenus.
    browser.contextMenus.removeAll();
    const contextMenuItem = {
      id: CONTEXT_MENU_ID,
      title: browser.i18n.getMessage("shortcutAddFurigana"),
      contexts: ["page"],
      documentUrlPatterns: ["http://*/*", "https://*/*"],
    } satisfies Browser.contextMenus.CreateProperties;
    browser.contextMenus.create(contextMenuItem);

    if (details.reason === browser.runtime.OnInstalledReason.INSTALL) {
      browser.tabs.create({ url: "https://furiganamaker.app/welcome" });
    }
  });
};
