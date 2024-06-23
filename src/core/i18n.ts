import en from "assets/locales/en/translations.json";
import ja from "assets/locales/ja/translations.json";
import ko from "assets/locales/ko/translations.json";
import zhCN from "assets/locales/zh_CN/translations.json";
import zhTW from "assets/locales/zh_TW/translations.json";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Browser from "webextension-polyfill";

i18n.use(initReactI18next).init({
  resources: {
    en,
    "zh-CN": zhCN,
    "zh-TW": zhTW,
    ja,
    ko,
  },
  lng: Browser.i18n.getUILanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
