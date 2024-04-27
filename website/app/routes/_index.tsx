import AddToBrowser from "@/components/AddToBrowser";
import { LinksContext } from "@/contexts";
import { type MetaFunction, json } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { useContext, useEffect } from "react";

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

export default function Index() {
  const links = useContext(LinksContext)!;

  const data = useLoaderData<typeof loader>();

  useEffect(() => {
    const riseObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-rising");
          riseObserver.unobserve(entry.target);
        }
      }
    });
    for (const el of document.querySelectorAll(".animeTop")) {
      riseObserver.observe(el);
    }

    return () => riseObserver.disconnect();
  }, []);

  const backgroundAnimeGroup = [
    "left-[25%] size-[80px]  [animation-delay:0]",
    "left-[10%] size-[20px]  [animation-delay:2s]  [animation-duration:12s]",
    "left-[70%] size-[20px]  [animation-delay:4s]",
    "left-[40%] size-[60px]  [animation-delay:0]   [animation-duration:18s]",
    "left-[65%] size-[20px]  [animation-delay:0]",
    "left-[75%] size-[110px] [animation-delay:3s]",
    "left-[35%] size-[150px] [animation-delay:7s]",
    "left-[50%] size-[25px]  [animation-delay:15s] [animation-duration:45s]",
    "left-[20%] size-[15px]  [animation-delay:2s]  [animation-duration:35s]",
    "left-[85%] size-[150px] [animation-delay:0]   [animation-duration:11s]",
  ];
  return (
    <div className="relative flex flex-col items-center w-full overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {backgroundAnimeGroup.map((className) => (
          <div
            key={className}
            className={`${className} absolute block size-5 bg-white/20 animate-floating -bottom-40`}
          />
        ))}
      </div>
      <section className="container pt-24 lg:pt-36 flex flex-col items-center text-pretty px-10 gap-5 text-center">
        <h1 className="animeTop text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold">
          Add{" "}
          <span>
            <ruby>
              振り仮名<rt>furigana</rt>
            </ruby>
          </span>{" "}
          to Japanese text on any page.
        </h1>
        <p className="animeTop max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
          Simply click on the text and furigana will appear on the text to help you understand the
          pronunciation of kanji, allowing automation!
        </p>
      </section>
      <div className="animeTop relative flex gap-6 items-center flex-col mt-6 sm:flex-row">
        <AddToBrowser />
        <Link
          to={links.github}
          target="_blank"
          className="select-none font-bold rounded-xl px-4 py-2 border-primary border-solid border-2 transition duration-300 hover:shadow-[hsla(161,55%,66%,.5)_0_0_15px_0,hsla(161,55%,49%,.5)_0_0_30px_0]"
        >
          View on GitHub
        </Link>
      </div>
      <section className="text-xl container text-pretty py-8 md:py-12 lg:py-24 mx-auto flex-col gap-5 justify-center flex items-center max-w-[800px]">
        <h2 className="animeTop font-bold text-3xl md:text-4xl xl:text-5xl text-center text-white mx-auto">
          Proudly Open Source
        </h2>
        <p className="animeTop max-w-[85%] leading-normal sm:text-lg sm:leading-7 text-center">
          Like this extension? Furigana Maker is an open source software under the MIT license,
          please consider giving it a Star to motivate me to implement new features and fix bugs for
          it! Any good idea and PR are welcome. Thank you. ❤️
        </p>
        <a
          target="_blank"
          rel="noreferrer"
          className="animeTop select-none group flex"
          href={links.github}
        >
          <div className="flex h-10 w-10 items-center justify-center space-x-2 rounded-md border-2 bg-muted border-primary transition duration-300 group-hover:shadow-[hsla(161,55%,66%,.5)_0_0_15px_0,hsla(161,55%,49%,.5)_0_0_30px_0]">
            <span className="i-mdi-github text-2xl" />
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 border-y-8 border-l-0 border-r-8 border-solid border-y-transparent border-primary" />
            <div className="flex font-display h-10 items-center gap-2 rounded-md border-2 px-4 font-medium border-primary transition duration-300 group-hover:shadow-[hsla(161,55%,66%,.5)_0_0_15px_0,hsla(161,55%,49%,.5)_0_0_30px_0]">
              <span>{data}</span> Stars on GitHub
            </div>
          </div>
        </a>
      </section>
    </div>
  );
}
