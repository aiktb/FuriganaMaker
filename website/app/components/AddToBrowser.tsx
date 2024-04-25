import { LinksContext } from "@/contexts";
import { Popover, Transition } from "@headlessui/react";
import { Link } from "@remix-run/react";
import { detect } from "detect-browser";
import { Fragment } from "react";
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

  return (
    <div className="relative">
      <Link
        to={browser.link}
        prefetch="viewport"
        className="inline-flex items-center justify-center font-bold gap-2 bg-white text-black rounded-full px-4 py-2 w-[17.5rem]"
      >
        <div className="flex items-center justify-center gap-2">
          <span className={`${browser.icon}`} />
          Add to {browser.name}
          <div className="size-7 ml-2" />
        </div>
        <div className="flex items-center absolute top-0 right-0 pr-2 pl-2 py-2 rounded-r-full bg-gray-100">
          <div className="size-7 flex items-center">
            <span className="text-black size-5 i-mdi-plus" />
          </div>
        </div>
      </Link>
      {browser.name === "Microsoft Edge" && (
        <Popover>
          <>
            <Popover.Button className="flex items-center absolute top-0 right-0 pr-2 pl-2 py-2 rounded-r-full bg-gray-100">
              <div className="size-7 flex items-center">
                <span className="text-black hover:text-primary transition size-5 i-mdi-information-slab-circle-outline" />
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
