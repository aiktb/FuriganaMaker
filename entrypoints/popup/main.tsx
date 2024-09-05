import "@/assets/style.css";

import en from "@/assets/_locales/en/popup.json";
import ja from "@/assets/_locales/ja/popup.json";
import ko from "@/assets/_locales/ko/popup.json";
import zh_CN from "@/assets/_locales/zh_CN/popup.json";
import zh_TW from "@/assets/_locales/zh_TW/popup.json";

import i18n from "i18next";
import React from "react";
import ReactDOM from "react-dom/client";
import { initReactI18next } from "react-i18next";

import Root from "./root";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    "zh-CN": { translation: zh_CN },
    "zh-TW": { translation: zh_TW },
    ja: { translation: ja },
    ko: { translation: ko },
  },
  lng: browser.i18n.getUILanguage(),
  fallbackLng: "en",
  interpolation: {
    // react already safes from xss
    escapeValue: false,
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
