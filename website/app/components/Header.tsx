import { Link, useLocation } from "@remix-run/react";
import { useContext } from "react";
import Logo from "../assets/Logo.svg";
import { LinksContext } from "../contexts";

export default function Header() {
  const links = useContext(LinksContext)!;
  const navItems = [
    { text: "Home", to: { pathname: "/" } },
    { text: "Features", to: { pathname: "/", hash: "#features" } },
    { text: "Demo", to: { pathname: "/", hash: "#demo" } },
    { text: "Welcome", to: { pathname: "/welcome" } },
  ];
  const location = useLocation();
  const isActive = (to: { pathname: string; hash?: string }) => {
    const pathnameMatched = to.pathname === location.pathname;
    return pathnameMatched && !to.hash;
  };

  return (
    <header className="transition duration-300 w-full select-none">
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <nav className="flex sm:gap-x-2 lg:gap-x-8 gap-2 backdrop-blur-3xl rounded-full p-2.5 transition ease-in-out backdrop-brightness-75">
          {navItems.map((item) => (
            <Link
              key={item.text}
              className={`block px-3.5 sm:px-6 py-1 sm:py-1.5 font-medium rounded-full hover:bg-white/10 text-gray-300 hover:text-gray-100 transition ease-in-out ${
                isActive(item.to) ? "bg-white/10" : ""
              }`}
              prefetch="render"
              to={item.to}
            >
              {item.text}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container fixed mx-auto px-8 pt-8 z-40 -translate-x-1/2 left-1/2">
        <div className="lg:flex items-center justify-between hidden h-9">
          <Link to="/">
            <img src={Logo} alt="Furigana Maker" className="size-8" />
          </Link>
          <Link className="i-mdi-github size-8" to={links.github} target="_blank" />
        </div>
      </div>
    </header>
  );
}
