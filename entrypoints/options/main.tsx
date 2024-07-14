import "@/assets/style.css";

import en from "@/assets/_locales/en/options.json";
import ja from "@/assets/_locales/ja/options.json";
import ko from "@/assets/_locales/ko/options.json";
import zh_CN from "@/assets/_locales/zh_CN/options.json";
import zh_TW from "@/assets/_locales/zh_TW/options.json";

import i18n from "i18next";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initReactI18next } from "react-i18next";
import { RouterProvider, createHashRouter } from "react-router-dom";

import ErrorPage from "./components/ErrorPage";
import Root from "./root";
import Changelog from "./routes/Changelog";
import RuleEditor from "./routes/RuleEditor";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    "zh-CN": { translation: zh_CN },
    "zh-TW": { translation: zh_TW },
    ja: { translation: ja },
    ko: { translation: ko },
  },
  lng: chrome.i18n.getUILanguage(),
  fallbackLng: "en",
  interpolation: {
    // react already safes from xss
    escapeValue: false,
  },
});

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <RuleEditor /> },
      { path: "/changelog", element: <Changelog /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
