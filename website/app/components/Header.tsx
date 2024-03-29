import { Icon } from '@iconify/react';

export default function Header() {
  const navLinks = [
    {
      title: 'Chrome',
      url: 'https://chromewebstore.google.com/detail/furigana-maker/heodojceeinbkfjfilnfminlkgbacpfp',
    },
    { title: 'Firefox', url: 'https://addons.mozilla.org/en-US/firefox/addon/furigana-maker/' },
    {
      title: 'Edge',
      url: 'https://microsoftedge.microsoft.com/addons/detail/furigana-maker/kohpoklaaeicnkdapjkmljdachedmbbi',
    },
    { title: 'Changelog', url: 'https://github.com/aiktb/FuriganaMaker/blob/main/CHANGELOG.md' },
  ];
  return (
    <header className="sticky m-auto flex h-16 justify-center border-b border-zinc-700">
      <div className="flex w-full max-w-screen-2xl items-center justify-between rounded-lg px-4 py-2 pl-6 pr-1 sm:px-6 lg:px-8 xl:max-w-[90rem]">
        <div className="font-display flex items-center justify-center text-xl">
          <Icon
            className="size-8"
            aria-hidden="true"
            icon="material-symbols:language-japanese-kana"
          />
          <svg className="size-8 stroke-zinc-700" role="separator" viewBox="0 0 32 32">
            <path d="M22 5L9 28" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="select-none" aria-hidden="true">
            Furigana Maker
          </span>
        </div>
        <div className="hidden items-center justify-center gap-4 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center"
            >
              {link.title}
              <Icon
                className="size-2.5 -translate-y-1 translate-x-1"
                icon="material-symbols-light:arrow-outward"
              />
            </a>
          ))}
          <svg className="size-6 stroke-zinc-700" role="separator" viewBox="0 0 32 32">
            <path d="M22 5L9 28" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <a href="https://github.com/aiktb/FuriganaMaker" rel="noreferrer">
            <span className="sr-only">GitHub</span>
            <Icon className="size-6" icon="mdi:github" />
          </a>
        </div>
      </div>
    </header>
  );
}
