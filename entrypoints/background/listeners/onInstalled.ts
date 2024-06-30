import type { Menus } from "wxt/browser";

import {
  type Config,
  DisplayMode,
  ExtEvent,
  ExtStorage,
  FuriganaType,
  SelectMode,
} from "@/commons/constants";
import { initI18n } from "@/commons/i18n";

import defaultSelectorRules from "@/assets/rules/selector.json";

export const registerOnInstalled = () => {
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
      browser.tabs.create({ url: "https://furiganamaker.app/welcome" });

      const { t } = await initI18n("background");
      // Setting the contextMenu must not be outside of `runtime.onInstalled`,
      // otherwise it will report an error for creating the contextMenu multiple times.
      const contextMenuItem: Menus.CreateCreatePropertiesType = {
        id: ExtEvent.AddFurigana,
        title: t("ctxMenuTitle"),
        contexts: ["page"],
        documentUrlPatterns: ["https://*/*"],
      };
      browser.contextMenus.create(contextMenuItem);
    }

    // Initialize default extension settings and custom rules.
    const defaultConfig: Config = {
      [ExtStorage.AutoMode]: true,
      [ExtStorage.KanjiFilter]: false,
      [ExtStorage.DisplayMode]: DisplayMode.Always,
      [ExtStorage.FuriganaType]: FuriganaType.Hiragana,
      [ExtStorage.SelectMode]: SelectMode.Original,
      [ExtStorage.FontSize]: 75, // ${fontsize}% relative to the parent font.
      [ExtStorage.FontColor]: "currentColor",
    };

    for (const key of Object.keys(defaultConfig)) {
      const oldConfig = await storage.getItem(`local:${key}`);
      if (!oldConfig) {
        await storage.setItem(`local:${key}`, defaultConfig[key]);
      }
    }
    const key = `local:${ExtStorage.SelectorRules}`;
    const oldSelectorRules = await storage.getItem(key);
    if (!oldSelectorRules) {
      await storage.setItem(key, defaultSelectorRules);
    }
  });
};
