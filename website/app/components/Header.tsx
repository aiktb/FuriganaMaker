import { LinksContext } from "@/contexts";
import { Link, useLocation } from "@remix-run/react";
import { useContext, useEffect, useState } from "react";

const toTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export default function Header() {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

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

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight;
      setIsAtBottom(isAtBottom);
      setIsAtTop(window.scrollY === 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="transition duration-300 w-full">
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <nav
          className={`flex sm:gap-x-2 lg:gap-x-8 gap-2 backdrop-blur-3xl rounded-full p-2.5 transition ease-in-out ${
            isAtTop ? "" : "backdrop-brightness-75"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.text}
              className={`block px-3.5 sm:px-6 py-1 sm:py-1.5 font-medium rounded-full hover:bg-white/10 text-gray-300 hover:text-gray-100 transition ease-in-out ${
                isActive(item.to) ? "bg-white/10" : ""
              }`}
              to={item.to}
            >
              {item.text}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container mx-auto px-8 pt-8 z-50">
        <div className="lg:flex items-center justify-end hidden h-9">
          <Link className="i-mdi-github size-8" to={links.github} target="_blank" />
        </div>
      </div>
      <button
        className={`fixed bottom-6 right-6 transition-all duration-500 bg-primary size-10 rounded-full ${
          isAtBottom ? "" : "opacity-0 pointer-events-none"
        }`}
        onClick={toTop}
      >
        <span className="sr-only">Back to top</span>
        <span className="i-mdi-chevron-up size-10" />
      </button>
    </header>
  );
}
