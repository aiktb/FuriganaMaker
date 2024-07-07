import { Trans } from "react-i18next";

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

  return (
    <footer className="border-gray-200 border-t dark:border-slate-800">
      <div className="mx-auto flex items-center justify-between px-4 lg:px-8 sm:px-6">
        <p className="flex flex-col flex-wrap gap-1.5 py-8 text-left text-sm sm:flex-row">
          <span className="block whitespace-nowrap sm:inline">
            <Trans
              i18nKey="footerCopyright"
              values={{ yearsRange: generateYear() }}
              components={{ author }}
            />
          </span>
          <span className="block sm:inline">
            <Trans i18nKey="footerLicense" components={{ license }} />
          </span>
          <span className="block sm:inline">Build with WXT.</span>
        </p>
      </div>
    </footer>
  );
}
