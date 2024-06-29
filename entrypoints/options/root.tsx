import "@/assets/style.css";
import "@/commons/i18n";

import { Suspense } from "react";

import { ExtStorage, type SelectorRule } from "@/commons/constants";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Main from "./components/Main";

export default function Options() {
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  async function initializeRules() {
    const rules = (await storage.getItem(`local:${ExtStorage.SelectorRules}`)) as SelectorRule[];
    return rules;
  }
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Suspense fallback={<div className="min-h-screen" />}>
        <Main rulesPromise={initializeRules()} />
      </Suspense>
      <Footer />
    </div>
  );
}
