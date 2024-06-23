export default function Features() {
  const features: FeatureItemProps[] = [
    {
      title: "Select Kanji Text",
      description:
        'Furigana Maker allows you to add furigana to any Japanese Kanji of your choice on the page by pressing the "Add furigana" button in the browser context menu or Popup, which also supports customized shortcuts for browser extension, so start enjoying now!',
      icon: "i-mdi-furigana-horizontal",
    },
    {
      title: "Customize Furigana",
      description:
        "For the existing furigana, you can adjust their forms in any way you want, such as switching between Romoji/Hiragana/Katakana, modifying the font size and color, including them in brackets and adding them to the clipboard, and filtering N5 & N4 level Kanji so they don't appear too often!",
      icon: "i-mdi-circle-edit-outline",
    },
    {
      title: "Automatic Addition",
      description:
        "This extension has built-in support for some common Japanese websites, such as Twitter, Asahi, etc. On these websites furigana will be displayed by default without any action on your part, and can be customized using the CSS Selector on the options page of the extension(Advanced).",
      icon: "i-mdi-auto-mode",
    },
  ];

  return (
    <div className="flex flex-col items-center py-20 lg:py-25 xl:py-30">
      <div
        id="features"
        className="uppercase font-bold inline-block rounded-full py-1.5 px-4 mb-4 border border-slate-700 bg-slate-800"
      >
        Features
      </div>
      <h2 className="animeRising font-bold text-3xl md:text-4xl xl:text-5xl text-center text-white mx-auto">
        Core Features of Furigana Maker
      </h2>
      {/* grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  */}
      <div className="flex flex-wrap justify-center gap-7 xl:gap-12 mt-12 lg:mt-15 xl:mt-20 mx-auto max-w-[80rem] px-4 md:px-8 xl:px-0">
        {features.map((feature) => (
          <FeatureItem key={feature.title} {...feature} />
        ))}
      </div>
    </div>
  );
}

interface FeatureItemProps {
  title: string;
  description: string;
  icon: string;
}

function FeatureItem({ title, description, icon }: FeatureItemProps) {
  return (
    <div className="animeRising hover:-translate-y-2 hover:bg-slate-700 duration-300 transition flex flex-col w-full md:w-96 gap-4 border border-slate-700 bg-slate-800 animeRising rounded-lg p-7 xl:p-12">
      <div className="flex justify-between items-center">
        <div className="bg-sky-400 size-10 flex justify-center items-center rounded">
          <div className={`${icon} size-7`} />
        </div>
        <i className="text-green-400 size-6 i-mdi-checkbox-marked-circle-outline" />
      </div>
      <h3 className="font-bold text-xl text-white">{title}</h3>
      <p className="text-white">{description}</p>
    </div>
  );
}
