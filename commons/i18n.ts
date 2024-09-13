import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/assets/_locales/en/translation.json";
import ja from "@/assets/_locales/ja/translation.json";
import ko from "@/assets/_locales/ko/translation.json";
import zh from "@/assets/_locales/zh/translation.json";

import { ExtStorage } from "./constants";
import { getMoreSettings } from "./utils";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
    ja: { translation: ja },
    ko: { translation: ko },
  },
  fallbackLng: "en",
  interpolation: {
    // react already safes from xss
    escapeValue: false,
  },
});

const language = await getMoreSettings(ExtStorage.Language);
if (language) {
  i18n.changeLanguage(language);
}

document.documentElement.lang = i18n.language;
