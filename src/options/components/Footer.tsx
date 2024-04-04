import { Icon } from "@iconify/react";

const generateYear = () => {
  const year = new Date().getFullYear();
  return year === 2023 ? year : `2023-${year}`;
};

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto flex max-w-3xl items-center justify-between border-t border-gray-200 px-4 dark:border-slate-800 sm:px-6 lg:max-w-7xl lg:px-8">
        <p className="py-8 text-center text-sm sm:text-left">
          <span className="block whitespace-nowrap sm:inline">
            Copyright &copy; {generateYear()}
            <a
              className="text-sky-500 transition hover:text-sky-700"
              href="https://github.com/aiktb"
              target="_blank"
              rel="noreferrer noopener"
            >
              {" aiktb"}
            </a>
            {". "}
          </span>
          <span className="block sm:inline">
            Released under the
            <a
              className="text-sky-500 transition hover:text-sky-700"
              href="https://github.com/aiktb/FuriganaMaker/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer noopener"
            >
              {" MIT "}
            </a>
            license.
          </span>
        </p>
        <a
          className="transition hover:text-black dark:hover:text-white"
          href="https://github.com/aiktb/FuriganaMaker"
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="sr-only">GitHub repository</span>
          <Icon className="size-6" icon="mdi:github" />
        </a>
      </div>
    </footer>
  );
}
