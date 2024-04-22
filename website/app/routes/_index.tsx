import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { detect } from "detect-browser";
import { useContext, useEffect, useState } from "react";
import { LinksContext } from "../contexts";
export const meta: MetaFunction = () => {
  return [
    {
      title: "Furigana Maker - Add furigana to Japanese text on any page",
    },
    {
      name: "description",
      content:
        "A browser extension that adds furigana to Japanese text on any page, for learning kanji pronunciation.",
    },
  ];
};

export default function Index() {
  const links = useContext(LinksContext)!;
  const [browser, setBrowser] = useState({
    name: "Google Chrome",
    link: links.chrome,
    icon: "i-fa6-brands-chrome",
  });
  const [star, setStar] = useState(0);
  useEffect(() => {
    switch (detect()?.name) {
      case "edge":
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

  interface Repo {
    stargazers_count: number;
  }

  useEffect(() => {
    fetch("https://api.github.com/repos/aiktb/FuriganaMaker")
      .then((response) => response.json())
      .then((data) => setStar((data as Repo).stargazers_count));
  });
  return (
    <div className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-36 mt-16 flex flex-col items-center w-full">
      <section className="container flex max-w-[75rem] flex-col items-center text-pretty px-10 gap-5 text-center">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold">
          Add furigana to Japanese text on any page.
        </h1>
        <p className="max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
          Simply click on the text and furigana will appear on the text to help you understand the
          pronunciation of kanji, allowing automation!
        </p>
      </section>
      <div className="relative flex gap-3 items-center flex-col sm:flex-row">
        <div className="inline-flex relative items-center justify-center font-bold gap-2 bg-white text-black rounded-full px-4 py-2">
          <Link
            to={browser.link}
            prefetch="viewport"
            className="flex items-center justify-center gap-2"
          >
            <span className={`${browser.icon}`} />
            Add to {browser.name}
            <div className="size-7 ml-2" />
            <div className="flex items-center absolute top-0 right-0 pr-2 pl-2 py-2 rounded-r-full bg-gray-100">
              <div className="size-7 flex items-center">
                <span className="size-5 i-mdi-plus" />
              </div>
            </div>
          </Link>
        </div>
        <Link
          to={links.github}
          target="_blank"
          className="font-bold rounded-xl px-4 py-2 border-primary border-solid border-2"
        >
          View on GitHub
        </Link>
      </div>
      <section className="text-xl container text-pretty py-8 md:py-12 lg:py-24 mx-auto flex-col gap-5 justify-center flex items-center max-w-[800px]">
        <h2 className="font-bold text-3xl md:text-4xl xl:text-5xl text-center text-white mx-auto">
          Proudly Open Source
        </h2>
        <p className="max-w-[85%] leading-normal sm:text-lg sm:leading-7 text-center">
          Like this extension? Furigana Maker is an open source software under the MIT license,
          please consider giving it a Star to motivate me to implement new features and fix bugs for
          it! Any good idea and PR are welcome. Thank you. ❤️
        </p>
        <a
          target="_blank"
          rel="noreferrer"
          className="flex"
          href="https://github.com/psycho-baller/sniptube"
        >
          <div className="flex h-10 w-10 items-center justify-center space-x-2 rounded-md border-2 bg-muted border-primary">
            <span className="i-mdi-github text-2xl" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 border-y-8 border-l-0 border-r-8 border-solid border-y-transparent border-primary" />
            <div className="flex font-display h-10 items-center gap-2 rounded-md border-2 px-4 font-medium border-primary">
              {star} Stars on GitHub
            </div>
          </div>
        </a>
      </section>
    </div>
  );
}
