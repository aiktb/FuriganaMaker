import { Link } from "@remix-run/react";
import { detect } from "detect-browser";
import { useRef } from "react";
import { useContext, useEffect, useState } from "react";
import { LinksContext } from "../contexts";

export default function AddToBrowser() {
  const links = useContext(LinksContext)!;
  const [browser, setBrowser] = useState({
    name: "Google Chrome",
    link: links.chrome,
    icon: "i-fa6-brands-chrome",
  });
  useEffect(() => {
    if (detect()?.name === "firefox") {
      setBrowser({
        name: "Mozilla Firefox",
        link: links.firefox,
        icon: "i-fa6-brands-firefox-browser",
      });
    }
  }, [links]);

  const dynamicHoverRef = useRef<HTMLDivElement>(null);
  const onPointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    dynamicHoverRef.current?.style.setProperty("--pointer-x", `${x}px`);
    dynamicHoverRef.current?.style.setProperty("--pointer-y", `${y}px`);
  };

  return (
    <div className="relative select-none">
      <Link
        to={browser.link}
        prefetch="viewport"
        className="group overflow-hidden inline-flex relative items-center justify-center font-bold gap-2 bg-white text-black rounded-full px-4 py-2 w-[17.5rem] hover:bg-[#cbcace]"
        onPointerMove={onPointerMove}
      >
        <div
          ref={dynamicHoverRef}
          className="absolute inset-0 z-0 opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 rounded-full"
          style={{
            top: -100,
            left: -100,
            width: 200,
            height: 200,
            backgroundImage: "radial-gradient(100px, rgb(247, 247, 248), rgba(247, 247, 248, 0))",
            transform: "translateX(var(--pointer-x)) translateY(var(--pointer-y))",
          }}
        />
        <div className="flex items-center justify-center gap-2 z-10">
          <span className={`${browser.icon}`} />
          Add to {browser.name}
          <div className="size-7 ml-2" />
        </div>
        <div className="flex items-center absolute top-0 right-0 pr-2 pl-2 py-2 rounded-r-full bg-gray-200/50 hover:bg-gray-300 transition">
          <div className="size-7 flex items-center">
            <i className="text-black size-5 i-mdi-plus" />
          </div>
        </div>
      </Link>
    </div>
  );
}
