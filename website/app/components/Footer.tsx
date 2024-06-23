import cloudflare from "@/assets/cloudflare.svg";
import { LinksContext } from "@/contexts";
import { Link } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";

const getCopiedYear = () => {
  const currentYear = new Date().getFullYear();
  return currentYear === 2023 ? "2023" : `2023-${currentYear}`;
};

const toTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export default function Footer() {
  const navItems = [
    { text: "About the author", to: "https://aiktb.dev" },
    { text: "Contact us", to: "mailto:hey@aiktb.dev" },
    { text: "Support us", to: "https://buymeacoffee.com/aiktb" },
  ];

  const links = useContext(LinksContext)!;
  const iconLinkItems = [
    { title: "chrome web store", to: links.chrome, icon: "i-fa6-brands-chrome" },
    { title: "firefox add-ons", to: links.firefox, icon: "i-fa6-brands-firefox-browser" },
    { title: "microsoft edge addons", to: links.edge, icon: "i-fa6-brands-edge" },
    { title: "github", to: links.github, icon: "i-fa6-brands-github" },
  ];

  const [isAtBottom, setIsAtBottom] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const TOLERANCE = 100;
      const result =
        window.innerHeight + Math.round(window.scrollY) >= document.body.offsetHeight - TOLERANCE;
      setIsAtBottom(result);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer className="bg-slate-800 border-t border-stroke border-slate-600 w-full">
      <button
        className={`fixed bottom-6 right-6 transition-all duration-500 bg-sky-400 size-10 rounded-full ${
          isAtBottom ? "" : "opacity-0 pointer-events-none"
        }`}
        onClick={toTop}
      >
        <span className="sr-only">Back to top</span>
        <i className="i-mdi-chevron-up size-10" />
      </button>
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="flex items-center justify-center space-x-4 sm:space-x-12 ">
          {navItems.map((item) => (
            <Link
              target="_blank"
              key={item.text}
              className="text-sm leading-6 text-[#BFBFBF] hover:text-sky-400"
              to={item.to}
            >
              {item.text}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex justify-center space-x-10">
          {iconLinkItems.map((item) => (
            <Link
              key={item.icon}
              className="text-[#BFBFBF] hover:text-sky-400 size-6"
              to={item.to}
              target="_blank"
            >
              <span className="sr-only">{item.title}</span>
              <span className={`${item.icon} size-5`} />
            </Link>
          ))}
        </div>
        <div className="mt-8 text-xs flex items-center justify-center">
          Proudly hosted with <span className="sr-only">Cloudflare Pages.</span>
          <Link to="https://pages.cloudflare.com/" target="_blank">
            <img src={cloudflare} alt="Cloudflare Logo" className="h-8 w-auto inline-block" />
          </Link>
        </div>
        <div>
          <p className="mt-8 text-pretty text-center text-xs leading-5 text-text/90">
            © {getCopiedYear()} Furigana Maker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
