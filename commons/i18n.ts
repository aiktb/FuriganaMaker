import en from "@/assets/_locales/en/translations.json";
import ja from "@/assets/_locales/ja/translations.json";
import ko from "@/assets/_locales/ko/translations.json";
import zhCN from "@/assets/_locales/zh_CN/translations.json";
import zhTW from "@/assets/_locales/zh_TW/translations.json";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en,
    "zh-CN": zhCN,
    "zh-TW": zhTW,
    ja,
    ko,
  },
  lng: browser.i18n.getUILanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
