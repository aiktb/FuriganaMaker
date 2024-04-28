import "@fontsource/m-plus-rounded-1c/400.css";
import "@fontsource/m-plus-rounded-1c/700.css";
import type { MetaFunction } from "@remix-run/cloudflare";

import { LinksContext } from "@/contexts";
import { Fireworks, type FireworksHandlers } from "@fireworks-js/react";
import { Link } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { useContext } from "react";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Welcome to Furigana Maker",
    },
  ];
};
export default function Welcome() {
  const links = useContext(LinksContext)!;
  const ref = useRef<FireworksHandlers>(null);

  useEffect(() => {
    ref.current?.start();
    setTimeout(() => {
      ref.current?.waitStop();
    }, 30 * 1000);

    const riseObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-rising");
          riseObserver.unobserve(entry.target);
        }
      }
    });
    for (const el of document.querySelectorAll(".animeRising")) {
      riseObserver.observe(el);
    }
    return () => ref.current?.stop() && riseObserver.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen py-8 pt-24 mt-5 lg:mt-16 lg:pt-36 flex flex-col items-center text-pretty px-10 gap-5 text-center">
      <Fireworks
        ref={ref}
        options={{ opacity: 0.5 }}
        className="fixed top-0 left-0 w-full h-full -z-10"
      />
      <section className="container flex flex-col items-center text-pretty sm:px-10 gap-5 text-center">
        <h1 className="animeRising text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold">
          Welcome to Furigana Maker!🎉
        </h1>
        <p className="animeRising max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
          You have successfully installed the extension, now you can start to add furigana to Kanji,
          please open the Popup page of the extension and click on the{" "}
          <span className="text-sky-400">"Add furigana"</span> button and select the Japanese text
          below and watch the change.
        </p>
      </section>
      <section className="py-20">
        <div className="uppercase font-bold inline-block rounded-full py-1.5 px-4 mb-4 border border-slate-700 bg-slate-800">
          Example
        </div>
        <h2 className="animeRising font-japanese font-bold text-xl sm:text-2xl mb-2">
          銀河鉄道の夜 - <span>宮沢賢治</span>
        </h2>
        <p className="indent-10 animeRising font-japanese max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
          ああそのときでした。見えない天の川のずうっと川下に青や橙やもうあらゆる光でちりばめられた十字架がまるで一本の木という風に川の中から立ってかがやきその上には青じろい雲がまるい環になって後光のようにかかっているのでした。汽車の中がまるでざわざわしました。みんなあの北の十字のときのようにまっすぐに立ってお祈りをはじめました。あっちにもこっちにも子供が瓜に飛びついたときのようなよろこびの声や何とも云いようない深いつつましいためいきの音ばかりきこえました。そしてだんだん十字架は窓の正面になりあの苹果の肉のような青じろい環の雲もゆるやかにゆるやかに繞っているのが見えました。
        </p>
      </section>
      <section className="pb-20">
        <div className="uppercase font-bold inline-block rounded-full py-1.5 px-4 mb-4 border border-slate-700 bg-slate-800">
          Tips
        </div>
        <ol className="list-decimal marker:text-sky-400 text-400 list-inside">
          <li className="animeRising sm:text-xl mt-6">
            You can set shortcuts for browser extension to access specific features.
          </li>
          <li className="animeRising sm:text-xl mt-6">
            You can Pin the extension on the browser bar for faster access to Popup page.
          </li>
          <li className="animeRising sm:text-xl mt-6">
            You can see the preset rules and edit them on the Options page.
          </li>
        </ol>
      </section>
      <Link
        to={links.github}
        target="_blank"
        className="gap-2 mb-12 lg:mb-15 xl:mb-20 flex hover:-translate-y-2 items-center select-none font-bold rounded-xl px-4 py-2 border-sky-400 border-solid border-2 transition duration-300 hover:shadow-[hsla(201,80%,66%,.5)_0_0_15px_0,hsla(161,55%,49%,.5)_0_0_30px_0] bg-slate-900"
      >
        <span className="size-5 i-mdi-github" />
        View on GitHub
        <span className="i-mdi-arrow-top-right" />
      </Link>
    </div>
  );
}
