import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/lobster/400.css";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/700.css";

import type { LinksFunction } from "@remix-run/cloudflare";
import { cssBundleHref } from "@remix-run/css-bundle";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import favicon from "./assets/favicon.ico";
import tailwindcss from "./assets/style.css?url";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { LinksContext } from "./contexts";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindcss },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export function Layout({ children }: { children: React.ReactNode }) {
  const links = {
    chrome:
      "https://chromewebstore.google.com/detail/furigana-maker/heodojceeinbkfjfilnfminlkgbacpfp",
    firefox: "https://addons.mozilla.org/en-US/firefox/addon/furigana-maker/",
    github: "https://github.com/aiktb/FuriganaMaker",
  };

  const backgroundAnimeGroup = [
    "left-[25%] size-[80px]  [animation-delay:0]",
    "left-[10%] size-[20px]  [animation-delay:2s]  [animation-duration:12s]",
    "left-[70%] size-[20px]  [animation-delay:4s]",
    "left-[40%] size-[60px]  [animation-delay:0]   [animation-duration:18s]",
    "left-[65%] size-[20px]  [animation-delay:0]",
    "left-[75%] size-[110px] [animation-delay:3s]",
    "left-[35%] size-[150px] [animation-delay:7s]",
    "left-[50%] size-[25px]  [animation-delay:15s] [animation-duration:45s]",
    "left-[20%] size-[15px]  [animation-delay:2s]  [animation-duration:35s]",
    "left-[85%] size-[150px] [animation-delay:0]   [animation-duration:11s]",
    "left-[90%] size-[50px]  [animation-delay:0]  [animation-duration:20s]",
    "left-[15%] size-[30px]  [animation-delay:0] [animation-duration:50s]",
  ];

  return (
    <html lang="en" className="bg-slate-900">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="aiktb <hey@aiktb.dev>" />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href={favicon} />
        <Meta />
        <Links />
      </head>
      <body className="font-sans text-base min-h-screen text-white flex flex-col">
        <div className="flex flex-col justify-between">
          <LinksContext.Provider value={links}>
            <Header />
            <main className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 -z-10" aria-hidden="true">
                {backgroundAnimeGroup.map((className) => (
                  <div
                    key={className}
                    className={`${className} absolute block size-5 bg-white/20 animate-floating -bottom-40`}
                  />
                ))}
              </div>
              {children}
            </main>
            <Footer />
          </LinksContext.Provider>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
