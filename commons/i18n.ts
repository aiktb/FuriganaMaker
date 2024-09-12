import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/assets/_locales/en/options.json";
import ja from "@/assets/_locales/ja/options.json";
import ko from "@/assets/_locales/ko/options.json";
import zh_CN from "@/assets/_locales/zh_CN/options.json";
import zh_TW from "@/assets/_locales/zh_TW/options.json";

import { ExtStorage } from "./constants";
import { getMoreSettings } from "./utils";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    "zh-CN": { translation: zh_CN },
    "zh-TW": { translation: zh_TW },
    ja: { translation: ja },
    ko: { translation: ko },
  },
  fallbackLng: "en",
  interpolation: {
    // react already safes from xss
    escapeValue: false,
  },
  supportedLngs: ["en", "zh-CN", "zh-TW", "ja", "ko"],
});

const language = await getMoreSettings(ExtStorage.Language);
if (language) {
  i18n.changeLanguage(language);
}
