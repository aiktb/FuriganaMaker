import { Trans, useTranslation } from "react-i18next";

const generateYear = () => {
  const year = new Date().getFullYear();
  return year === 2023 ? year : `2023-${year}`;
};

interface FooterLinkProps {
  href: string;
  content: string;
}

function FooterLink({ href, content }: FooterLinkProps) {
  return (
    <a
      className="text-black font-semibold dark:text-white underline decoration-solid transition hover:text-sky-500"
      href={href}
      target="_blank"
      rel="noreferrer noopener"
    >
      {content}
    </a>
  );
}

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-gray-200 border-t dark:border-slate-800">
      <div className="mx-auto flex items-center justify-between px-4 lg:px-8 sm:px-6">
        <p className="flex flex-col flex-wrap gap-1.5 text-center py-8 text-sm sm:flex-row">
          <span className="block whitespace-nowrap sm:inline">
            <Trans
              i18nKey="footerCopyright"
              values={{ yearsRange: generateYear() }}
              components={{
                author: <FooterLink content="aiktb" href="https://github.com/aiktb" />,
              }}
            />
          </span>
          <span className="block sm:inline">
            <Trans
              i18nKey="footerLicense"
              components={{
                license: (
                  <FooterLink
                    content="MIT"
                    href="https://github.com/aiktb/FuriganaMaker/blob/main/LICENSE"
                  />
                ),
              }}
            />
          </span>
          <span className="block sm:inline">
            <Trans
              i18nKey="footerBuiltWith"
              components={{
                tool: <FooterLink content="WXT" href="https://wxt.dev" />,
              }}
            />
          </span>
        </p>
        <a
          className="dark:hover:text-white flex justify-center items-center rounded-md size-9 hover:bg-gray-100 dark:hover:bg-slate-800 dark:text-white text-black"
          href="https://github.com/aiktb/FuriganaMaker"
        >
          <span className="sr-only">{t("srGithub")}</span>
          <i className="i-fa6-brands-github size-5" />
        </a>
      </div>
    </footer>
  );
}
