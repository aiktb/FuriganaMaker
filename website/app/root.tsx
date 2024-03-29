import type { LinksFunction } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';

import Header from './components/Header';
import tailwindcss from './style.css?url';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: tailwindcss }];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <meta name="author" content="aiktb <hey@aiktb.dev>" />
        <meta name="theme-color" content="rgb(2, 136, 209)" />
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
      <body className="font-sans text-base text-zinc-100">
        <Header />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
