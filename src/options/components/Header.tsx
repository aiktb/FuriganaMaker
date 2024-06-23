import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">(localStorage.theme ?? "light");

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setTheme("dark");
    }
  };

  const { t } = useTranslation("options");

  return (
    <header className="sticky top-0 z-10 h-[72px]">
      <div className="max-w-8xl mx-auto xl:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between border-b border-gray-200 px-4 py-5 backdrop-blur backdrop-filter dark:border-slate-800 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="flex items-center text-base">
            <i className="mr-1 size-6 text-sky-500 i-tabler-list-details" />
            <span className="font-bold text-black dark:text-white">{t("titleEditor")}</span>
          </div>
          <div className="flex gap-x-6">
            <button onClick={toggleTheme}>
              <span className="sr-only">{t("srToggleTheme")}</span>
              {theme === "light" ? (
                <i className="size-6 text-sky-500 i-tabler-sun" />
              ) : (
                <i className="size-6 text-sky-500 i-tabler-moon-stars" />
              )}
            </button>
            <a
              className="transition hover:text-black dark:hover:text-white"
              href="https://github.com/aiktb/FuriganaMaker"
            >
              <span className="sr-only">{t("srGithub")}</span>
              <i className="size-6 i-fa6-brands-github" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
