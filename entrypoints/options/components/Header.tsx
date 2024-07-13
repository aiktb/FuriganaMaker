import { useTranslation } from "react-i18next";
import ThemeSwitch from "./ThemeSwitch";

interface HeaderProps {
  icon: string;
  title: string;
}
export default function Header({ icon, title }: HeaderProps) {
  const { t } = useTranslation();
  return (
    <header className="sticky z-10 top-0 border-gray-200 border-b dark:border-slate-800">
      <div className="px-4 lg:px-8 sm:px-6">
        <div className="flex items-center justify-between py-5 backdrop-blur backdrop-filter">
          <div className="flex items-center text-base">
            <i className={`mr-3 size-6 text-sky-500 ${icon}`} />
            <span className="font-bold text-black dark:text-white">{title}</span>
          </div>
          <div className="flex gap-x-3">
            <ThemeSwitch />
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
