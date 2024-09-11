import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../components/LanguageSwitcher";
import Page from "../components/Page";

export default function Settings() {
  const { t } = useTranslation();

  return (
    <Page title={t("navSettings")} icon="i-tabler-settings">
      <menu>
        <li className="flex gap-4 items-center text-pretty">
          <div className="">
            <div className="text-slate-800 dark:text-slate-200 text-lg font-bold">
              Interface language
            </div>
            <div>此设置只影响Popup和Options页面的显示语言，其余文案只在更改浏览器语言后生效</div>
          </div>
          <LanguageSwitcher />
        </li>
      </menu>
    </Page>
  );
}
