import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import "@fontsource/lobster/400.css";

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
    edge: "https://microsoftedge.microsoft.com/addons/detail/furigana-maker/kohpoklaaeicnkdapjkmljdachedmbbi",
    github: "https://github.com/aiktb/FuriganaMaker",
  };
  return (
    <html lang="en" className="bg-[hsl(161,_53%,_6%)]">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="aiktb <hey@aiktb.dev>" />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href={favicon} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans text-base min-h-screen flex flex-col text-white">
        <LinksContext.Provider value={links}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LinksContext.Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
