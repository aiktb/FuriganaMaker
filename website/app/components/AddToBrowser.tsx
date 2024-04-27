import { LinksContext } from "@/contexts";
import { Popover, Transition } from "@headlessui/react";
import { Link } from "@remix-run/react";
import { detect } from "detect-browser";
import { Fragment, useRef } from "react";
import { useContext, useEffect, useState } from "react";

export default function AddToBrowser() {
  const links = useContext(LinksContext)!;
  const [browser, setBrowser] = useState({
    name: "Google Chrome",
    link: links.chrome,
    icon: "i-fa6-brands-chrome",
  });
  useEffect(() => {
    switch (detect()?.name) {
      case "edge-chromium":
        setBrowser({
          name: "Microsoft Edge",
          link: links.edge,
          icon: "i-fa6-brands-edge",
        });
        break;
      case "firefox":
        setBrowser({
          name: "Mozilla Firefox",
          link: links.firefox,
          icon: "i-fa6-brands-firefox-browser",
        });
        break;
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
            <span className="text-black size-5 i-mdi-plus" />
          </div>
        </div>
      </Link>
      {browser.name === "Microsoft Edge" && (
        <Popover>
          <>
            <Popover.Button className="z-30 flex items-center absolute top-0 right-0 pr-2 pl-2 py-2 rounded-r-full">
              <div className="size-7 flex items-center">
                <span className="text-black hover:text-sky-400 transition size-5 i-mdi-information-slab-circle-outline" />
              </div>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="text-black text-pretty absolute left-1/2 z-10 mt-7 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                  <h2 className="relative font-bold bg-white px-4 pt-7 pb-4 text-xl">
                    <div className="flex items-center">
                      <div>
                        Recommend Use{" "}
                        <span className="decoration-wavy underline-offset-2 decoration-sky-400 underline">
                          Chrome
                        </span>
                        {" / "}
                        <span className="decoration-wavy underline-offset-2 decoration-sky-400 underline">
                          Firefox
                        </span>
                      </div>
                    </div>
                  </h2>
                  <p className="bg-gray-50 p-4 align-bottom text-slate-700 ">
                    Due to{" "}
                    <Link
                      to="https://github.com/aiktb/FuriganaMaker/issues/21"
                      target="_blank"
                      prefetch="viewport"
                      className="text-black underline underline-offset-2 decoration-sky-400 hover:decoration-2 hover:decoration-sky-500 transition"
                    >
                      known issue
                    </Link>{" "}
                    with Edge Add-ons, we are unable to provide the latest version of Furigana Maker
                    for Edge. If you want to try the latest version in Edge, please consider
                    installing the extension from the{" "}
                    <Link
                      to={links.chrome}
                      target="_blank"
                      prefetch="viewport"
                      className="text-black underline underline-offset-2 decoration-sky-400 hover:decoration-2 hover:decoration-sky-500 transition"
                    >
                      Chrome Web Store
                    </Link>
                    <span className="align-middle text-xl ml-1 i-logos-chrome-web-store" />.
                  </p>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        </Popover>
      )}
    </div>
  );
}
