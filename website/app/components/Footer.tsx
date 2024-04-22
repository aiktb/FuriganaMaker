import { LinksContext } from "@/contexts";
import { Link } from "@remix-run/react";
import { useContext } from "react";

const getCopiedYear = () => {
  const currentYear = new Date().getFullYear();
  return currentYear === 2023 ? "2023" : `2023-${currentYear}`;
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
  return (
    <footer className="bg-[hsl(228,_32%,_16%)] border-t border-stroke border-[hsl(228,_32%,_30%)]">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="flex flex-col items-center sm:flex-row sm:justify-center sm:space-x-12 ">
          {navItems.map((item) => (
            <Link
              target="_blank"
              key={item.text}
              className="text-sm leading-6 text-[#BFBFBF] hover:text-primary"
              to={item.to}
            >
              {item.text}
            </Link>
          ))}
        </nav>
        <div className="mt-10 flex justify-center space-x-10">
          {iconLinkItems.map((item) => (
            <Link
              key={item.icon}
              className="text-[#BFBFBF] hover:text-primary size-6"
              to={item.to}
              target="_blank"
            >
              <span className="sr-only">{item.title}</span>
              <span className={`${item.icon} size-5`} />
            </Link>
          ))}
        </div>
        <div>
          <p className="mt-10 text-pretty text-center text-xs leading-5 text-text/90">
            © {getCopiedYear()} Furigana Maker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
