import { ExtStorage, type MoreSettings } from "@/commons/constants";
import { moreSettings, setMoreSettings } from "@/commons/utils";

import { Suspense, use } from "react";
import { useTranslation } from "react-i18next";

import { Transition } from "@headlessui/react";

import LanguageSwitcher from "../components/LanguageSwitcher";
import Page from "../components/Page";

export default function Settings() {
  const { t } = useTranslation();

  return (
    <Page title={t("navSettings")} icon="i-tabler-settings">
      <Suspense>
        <Transition
          as="div"
          appear
          show={true}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <MoreSettingsMenu settingsPromise={moreSettings.getValue()} />
        </Transition>
      </Suspense>
    </Page>
  );
}

function MoreSettingsMenu({ settingsPromise }: { settingsPromise: Promise<MoreSettings> }) {
  const [settings, setSettings] = useState(use(settingsPromise));
  const { i18n } = useTranslation();

  function handleLanguageChange(language: string) {
    setSettings({ ...settings, [ExtStorage.Language]: language });
    setMoreSettings(ExtStorage.Language, language);
    i18n.changeLanguage(language);
  }
  return (
    <menu className="xl:mx-20">
      <li className="flex gap-4 items-center text-pretty">
        <div>
          <div className="text-slate-800 dark:text-slate-200 text-lg font-bold">
            Interface language
          </div>
          <div>
            This setting only affects the display language of Popup and Options pages. The rest of
            the text will only take effect after changing the browser language.
          </div>
        </div>
        <LanguageSwitcher
          language={settings[ExtStorage.Language] ?? i18n.language}
          onChange={handleLanguageChange}
        />
      </li>
    </menu>
  );
}
