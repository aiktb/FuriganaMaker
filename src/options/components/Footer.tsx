import { Trans, useTranslation } from "react-i18next";

const generateYear = () => {
  const year = new Date().getFullYear();
  return year === 2023 ? year : `2023-${year}`;
};

export default function Footer() {
  const author = (
    <a
      className="text-sky-500 transition hover:text-sky-700"
      href="https://github.com/aiktb"
      target="_blank"
      rel="noreferrer noopener"
    >
      {" aiktb"}
    </a>
  );
  const license = (
    <a
      className="text-sky-500 transition hover:text-sky-700"
      href="https://github.com/aiktb/FuriganaMaker/blob/main/LICENSE"
      target="_blank"
      rel="noreferrer noopener"
    >
      {" MIT "}
    </a>
  );

  const { t } = useTranslation("options");

  return (
    <footer>
      <div className="mx-auto flex max-w-3xl items-center justify-between border-t border-gray-200 px-4 dark:border-slate-800 sm:px-6 lg:max-w-7xl lg:px-8">
        <p className="flex py-8 text-sm text-left flex-col sm:flex-row flex-wrap gap-1.5">
          <span className="block whitespace-nowrap sm:inline">
            <Trans
              i18nKey="footerCopyright"
              ns="options"
              values={{ yearsRange: generateYear() }}
              components={{ author }}
            />
          </span>
          <span className="block sm:inline">
            <Trans i18nKey="footerLicense" ns="options" components={{ license }} />
          </span>
        </p>
        <a
          className="transition hover:text-black dark:hover:text-white"
          href="https://github.com/aiktb/FuriganaMaker"
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="sr-only">{t("srGithub")}</span>
          <i className="size-6 i-fa6-brands-github" />
        </a>
      </div>
    </footer>
  );
}
