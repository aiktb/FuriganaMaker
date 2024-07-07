import Logo from "@/assets/icons/Logo.svg?react";

import { useTranslation } from "react-i18next";
import { Link, type LinkProps, NavLink } from "react-router-dom";

type CustomLink = LinkProps & { label: string; icon: string };

export default function Sidebar() {
  const { t } = useTranslation();

  const navItems: CustomLink[] = [
    { to: "/", target: "_self", label: t("navSettings"), icon: "i-tabler-settings" },
    { to: "/rules", target: "_self", label: t("navEditRules"), icon: "i-tabler-list-details" },
    { to: "/changelog", target: "_self", label: t("navChangelog"), icon: "i-tabler-history" },
    {
      to: browser.runtime.getURL("/popup.html"),
      target: "_blank",
      label: "Popup",
      icon: "i-tabler-puzzle",
    },
    {
      to: "https://github.com/aiktb/FuriganaMaker",
      target: "_blank",
      label: "GitHub",
      icon: "i-tabler-brand-github",
    },
    {
      to: "https://furiganamaker.app",
      target: "_blank",
      label: t("navOfficialSite"),
      icon: "i-tabler-world",
    },
  ];

  return (
    <nav className="fixed top-0 z-10 flex min-h-screen w-72 flex-col gap-6 border-gray-200 border-r border-solid bg-white px-6 py-5 font-semibold text-base dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        <Logo className="size-8" />
        <div className="flex items-center justify-center gap-2 px-1.5 text-black dark:text-white">
          <span className="font-bold text-lg">{browser.runtime.getManifest().name}</span>
          <span className="font-normal text-slate-700 text-sm dark:text-slate-200">{`v${browser.runtime.getManifest().version}`}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex flex-col gap-7">
          <div className="-mx-2 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                to={item.to}
                key={item.label}
                target={item.target}
                className={({ isActive }) =>
                  `flex w-64 items-center justify-between rounded-md p-2 hover:bg-slate-100 dark:hover:bg-gray-800 dark:hover:text-white hover:text-black ${isActive ? "dark:bg-gray-800 bg-slate-100 dark:text-white text-black" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-4">
                      <i
                        className={`${item.icon} size-6 text-gray-400 ${isActive ? "text-sky-500" : ""}`}
                      />
                      {item.label}
                    </div>
                    {item.target === "_blank" && (
                      <i className="i-tabler-external-link dark:text-gray-300 text-slate-800" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
          <div>
            <div>Your tips</div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="flex size-6 items-center justify-center rounded-lg border-2 border-slate-300 dark:border-slate-700 border-solid dark:bg-gray-800">
                  <i className="i-tabler-command size-4 text-gray-400" />
                </div>
                Manage shortcuts
              </div>
              <i className="-rotate-45 i-tabler-arrow-back size-4 dark:text-gray-300 text-slate-800" />
            </div>
            {import.meta.env.FIREFOX ? (
              <Link
                className="mt-2 text-sm"
                to="https://support.mozilla.org/en-US/kb/manage-extension-shortcuts-firefox"
                target="_blank"
              >
                Firefox Support
              </Link>
            ) : (
              <p className="mt-2 select-all text-sm">chrome://extensions/shortcuts</p>
            )}
          </div>
        </div>
        <Link
          to="https://buymeacoffee.com/aiktb"
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 border-solid bg-slate-50 p-2 text-zinc-800 dark:border-neutral-700 dark:hover:border-neutral-600 dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-100 dark:text-slate-300"
        >
          <i className="i-tabler-heart size-6 text-pink-500" />
          Sponsor developer
        </Link>
      </div>
    </nav>
  );
}
