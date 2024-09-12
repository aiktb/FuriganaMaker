import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

const supportedLngs = ["en", "zh-CN", "zh-TW", "ja", "ko"];

interface LanguageSwitcherProps {
  language: string;
  onChange: (language: string) => void;
}

export default function LanguageSwitcher({ language, onChange }: LanguageSwitcherProps) {
  const displayNameIntl = new Intl.DisplayNames(language, { type: "language" });

  return (
    <Listbox value={language} onChange={onChange}>
      <ListboxButton className="relative block min-w-40 h-12 rounded-lg text-nowrap bg-black/5 dark:bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 dark:text-white text-slate-900 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 dark:data-[focus]:outline-white/25 data-[focus]:outline-black/25">
        {displayNameIntl.of(language)}
        <i className="i-tabler-chevron-down group pointer-events-none size-4 absolute right-2.5 top-4 fill-white/60" />
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        transition
        className="w-[var(--button-width)] rounded-xl border dark:border-white/5 dark:bg-white/5 border-black/5 bg-black/5 p-1 [--anchor-gap:4px] focus:outline-none transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
      >
        {supportedLngs.map((language) => (
          <ListboxOption
            key={language}
            value={language}
            className="group flex items-center gap-2 rounded-lg py-1.5 px-1 select-none dark:data-[focus]:bg-white/10 data-[focus]:bg-black/10 cursor-pointer"
          >
            <i className="i-tabler-check invisible size-4 text-sky-400 group-data-[selected]:visible" />
            <div className="text-sm/6 dark:text-white text-slate-900 overflow-ellipsis overflow-hidden text-nowrap">
              {displayNameIntl.of(language)}
            </div>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}
