import { useTranslation } from "react-i18next";

const getThemeDetail = () => {
  if (localStorage.theme) {
    return {
      color: localStorage.theme as "light" | "dark",
      isSystem: false,
    };
  }

  const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
  return {
    color: userMedia.matches ? "dark" : "light",
    isSystem: true,
  };
};

export default function ThemeSwitch() {
  const [theme, setTheme] = useState(getThemeDetail);
  const toggleTheme = () => {
    if (theme.color === "light") {
      localStorage.theme = "dark";
      document.documentElement.classList.add("dark");
      setTheme({ color: "dark", isSystem: false });
    } else {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
      setTheme({ color: "light", isSystem: false });
    }
  };
  const { t } = useTranslation();
  return (
    <button
      onClick={toggleTheme}
      className="flex size-9 items-center justify-center rounded-md text-black hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800"
    >
      <span className="sr-only">{t("srToggleTheme")}</span>
      <i
        className={`size-5 ${theme.color === "light" ? "i-tabler-sun-filled" : "i-tabler-moon-filled"}${theme.isSystem ? "" : "text-sky-500"}`}
      />
    </button>
  );
}
