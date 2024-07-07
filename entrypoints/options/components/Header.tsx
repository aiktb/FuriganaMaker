import { useState } from "react";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  icon: string;
  title: string;
}
export default function Header({ icon, title }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(localStorage.theme ?? "system");
  const toggleTheme = () => {
    // if (document.documentElement.classList.contains("dark")) {
    //   document.documentElement.classList.remove("dark");
    //   localStorage.theme = "light";
    //   setTheme("light");
    // } else {
    //   document.documentElement.classList.add("dark");
    //   localStorage.theme = "dark";
    //   setTheme("dark");
    // }
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "system");
      setTheme("system");
    } else if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  const { t } = useTranslation();
  return (
    <header className="sticky top-0 border-gray-200 border-b dark:border-slate-800">
      <div className="px-4 lg:px-8 sm:px-6">
        <div className="flex items-center justify-between py-5 backdrop-blur backdrop-filter">
          <div className="flex items-center text-base">
            <i className={`mr-3 size-6 text-sky-500 ${icon}`} />
            <span className="font-bold text-black dark:text-white">{title}</span>
          </div>
          <div className="flex gap-x-3">
            <button
              onClick={toggleTheme}
              className="flex justify-center items-center rounded-md size-9 hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-white text-black"
            >
              <span className="sr-only">{t("srToggleTheme")}</span>
              {theme === "light" && <i className="size-5 i-tabler-sun-filled" />}
              {theme === "dark" && <i className="size-5 i-tabler-moon-filled" />}
              {theme === "system" && <i className="size-5 i-tabler-device-laptop" />}
            </button>
            <a
              className="dark:hover:text-white flex justify-center items-center rounded-md size-9 hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-white text-black"
              href="https://github.com/aiktb/FuriganaMaker"
            >
              <span className="sr-only">{t("srGithub")}</span>
              <i className="i-fa6-brands-github size-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
