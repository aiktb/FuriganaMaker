import type { LinksFunction } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import favicon from "./assets/favicon.ico";
import tailwindcss from "./assets/style.css?url";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { LinksContext } from "./contexts";
export const links: LinksFunction = () => [{ rel: "stylesheet", href: tailwindcss }];

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
        {/* Lobster + DM Sans + JetBrains Mono from Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Lobster&display=swap"
          rel="stylesheet"
        />
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
