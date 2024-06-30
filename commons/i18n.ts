import i18n from "i18next";
import type { Resource } from "i18next";
import { initReactI18next } from "react-i18next";

type I18NArea = "contents" | "background" | "popup" | "options";

export const initI18n = async (i18nArea: I18NArea) => {
  let resources: Resource;

  switch (i18nArea) {
    case "contents":
      resources = {
        en: { translation: await import("@/assets/_locales/en/popup.json") },
        "zh-CN": { translation: await import("@/assets/_locales/zh_CN/popup.json") },
        "zh-TW": { translation: await import("@/assets/_locales/zh_TW/popup.json") },
        ja: { translation: await import("@/assets/_locales/ja/popup.json") },
        ko: { translation: await import("@/assets/_locales/ko/popup.json") },
      };
      break;
    case "background":
      resources = {
        en: { translation: await import("@/assets/_locales/en/background.json") },
        "zh-CN": { translation: await import("@/assets/_locales/zh_CN/background.json") },
        "zh-TW": { translation: await import("@/assets/_locales/zh_TW/background.json") },
        ja: { translation: await import("@/assets/_locales/ja/background.json") },
        ko: { translation: await import("@/assets/_locales/ko/background.json") },
      };
      break;
    case "popup":
      resources = {
        en: { translation: await import("@/assets/_locales/en/popup.json") },
        "zh-CN": { translation: await import("@/assets/_locales/zh_CN/popup.json") },
        "zh-TW": { translation: await import("@/assets/_locales/zh_TW/popup.json") },
        ja: { translation: await import("@/assets/_locales/ja/popup.json") },
        ko: { translation: await import("@/assets/_locales/ko/popup.json") },
      };
      break;
    case "options":
      resources = {
        en: { translation: await import("@/assets/_locales/en/options.json") },
        "zh-CN": { translation: await import("@/assets/_locales/zh_CN/options.json") },
        "zh-TW": { translation: await import("@/assets/_locales/zh_TW/options.json") },
        ja: { translation: await import("@/assets/_locales/ja/options.json") },
        ko: { translation: await import("@/assets/_locales/ko/options.json") },
      };
      break;
  }

  i18n.use(initReactI18next).init({
    resources,
    lng: browser.i18n.getUILanguage(),
    fallbackLng: "en",
    interpolation: {
      // react already safes from xss
      escapeValue: ["options", "popup"].includes(i18nArea),
    },
  });

  return i18n;
};
