import AddToBrowser from "@/components/AddToBrowser";
import Features from "@/components/Features";
import { LinksContext } from "@/contexts";
import { type MetaFunction, json } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { useContext } from "react";

interface Repo {
  stargazers_count: number;
}
export const loader = async () => {
  let data = 0;
  try {
    const res = await fetch("https://api.github.com/repos/aiktb/FuriganaMaker", {
      headers: {
        // Necessary for GitHub API
        // The absence of this header in Cloudflare Pages will result in an HTTP 403
        "User-Agent": "FuriganaMaker",
      },
    });
    data = ((await res.json()) as Repo).stargazers_count;
  } catch (e) {
    console.error(e);
  }
  const AN_HOUR = 60 * 60;
  return json(data, {
    headers: { "Cache-Control": `public, max-age=${AN_HOUR}` },
  });
};
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
import { useRising } from "@/useRising";
export default function Index() {
  const links = useContext(LinksContext)!;

  const data = useLoaderData<typeof loader>();
  const YOUTUBE_VIDEO_ID = "_j954tDLXjw";

  useRising();
  return (
    <div className="relative flex flex-col items-center w-full min-h-screen">
      <section className="container pt-24 mt-5 lg:mt-16 lg:pt-36 flex flex-col items-center text-pretty px-10 gap-5 text-center">
        <h1 className="animeRising text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold">
          Add{" "}
          <span>
            <ruby>
              振り仮名<rt>furigana</rt>
            </ruby>
          </span>{" "}
          to Japanese text on any page.
        </h1>
        <p className="animeRising max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
          Simply click on the text and furigana will appear on the text to help you understand the
          pronunciation of kanji, allowing automation!
        </p>
      </section>
      <div className="animeRising relative flex gap-6 items-center flex-col mt-6 sm:flex-row">
        <AddToBrowser />
        <Link
          to={links.github}
          target="_blank"
          className="select-none font-bold rounded-xl px-4 py-2 border-sky-400 border-solid border-2 transition duration-300 hover:shadow-[hsla(201,80%,66%,.5)_0_0_15px_0,hsla(161,55%,49%,.5)_0_0_30px_0] bg-slate-900"
        >
          View on GitHub
        </Link>
      </div>
      <Features />
      <div className="flex flex-col items-center w-full px-4">
        <div
          id="demo"
          className="uppercase font-bold inline-block rounded-full py-1.5 px-4 mb-4 border border-slate-700 bg-slate-800"
        >
          Demo
        </div>
        <h2 className="animeRising font-bold text-3xl md:text-4xl xl:text-5xl text-center text-white mx-auto">
          Operation Guide
        </h2>
        <iframe
          className="w-[90%] lg:w-[65rem] aspect-video rounded-md mt-12 lg:mt-15 xl:mt-20"
          src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
          allowFullScreen
          title="Furigana Maker Demo"
        />
      </div>
      <section className="container text-pretty py-8 my-12 lg:my-15 xl:my-20 mx-auto flex-col gap-5 justify-center flex items-center max-w-[50rem]">
        <div className="uppercase font-bold inline-block rounded-full py-1.5 px-4 mb-4 border border-slate-700 bg-slate-800">
          Open Source
        </div>
        <h2 className="animeRising font-bold text-3xl md:text-4xl xl:text-5xl text-center text-white mx-auto">
          Proudly Open Source
        </h2>
        <p className="animeRising max-w-[85%] leading-normal sm:text-lg sm:leading-7 text-center">
          This extension has benefited from the support of many open source software and developers,
          with special thanks to{" "}
          <Link
            to="https://github.com/mirigana/mirigana"
            target="_blank"
            className="underline-offset-2 decoration-sky-400 hover:decoration-2 hover:text-sky-400/90 transition underline"
          >
            Mirigana
          </Link>{" "}
          (inspiration),{" "}
          <Link
            to="https://github.com/atilika/kuromoji"
            target="_blank"
            className="underline-offset-2 decoration-sky-400 hover:decoration-2 hover:text-sky-400/90 transition underline"
          >
            Kuromoji
          </Link>{" "}
          (core feature), and{" "}
          <Link
            to="https://github.com/PlasmoHQ/plasmo"
            target="_blank"
            className="underline-offset-2 decoration-sky-400 hover:decoration-2 hover:text-sky-400/90 transition underline"
          >
            Plasmo
          </Link>{" "}
          (build tools), without these great open source software, the development of this extension
          would not have been possible!
        </p>
        <p className="animeRising max-w-[85%] leading-normal sm:text-lg sm:leading-7 text-center">
          Like this extension? Furigana Maker is an open source software under the MIT license,
          please consider giving it a Star to motivate me to implement new features and fix bugs for
          it! Any good idea and PR are welcome. Thank you. ❤️
        </p>
        <a
          target="_blank"
          rel="noreferrer"
          className="animeRising select-none group flex"
          href={links.github}
        >
          <div className="group flex size-10 items-center justify-center space-x-2 rounded-md border-2 bg-muted border-sky-400 transition duration-300 group-hover:shadow-[hsla(201,80%,66%,.5)_0_0_15px_0,hsla(161,55%,49%,.5)_0_0_30px_0] bg-slate-900">
            <span className="i-mdi-github text-2xl" />
          </div>
          <div className="flex items-center">
            <div className="size-4 border-y-8 border-l-0 border-r-8 border-solid border-y-transparent border-sky-400" />
            <div className="flex font-display h-10 items-center gap-2 rounded-md border-2 px-4 font-medium border-sky-400 transition duration-300 group-hover:shadow-[hsla(201,80%,66%,.5)_0_0_15px_0,hsla(161,55%,49%,.5)_0_0_30px_0] bg-slate-900">
              <span>{data}</span> Stars on GitHub ⭐
            </div>
          </div>
        </a>
      </section>
    </div>
  );
}
