import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toKatakana, toRomaji } from "wanakana";
import type { FuriganaType } from "@/constants";
import { sendMessage } from "@/message";
import { AiModelPanel } from "./components/AiModelPanel";
import { FuriganaTypeRadioGroup } from "./components/FuriganaTypeRadioGroup";
import {
  type FuriganaSegment,
  getFuriganaSegments,
  JapaneseTextarea,
} from "./components/JapaneseTextarea";
import { TextWithFurigana } from "./components/TextWithFurigana";
import { useAiFurigana } from "./useAiFurigana";

export const Playground = () => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [dictionary, setDictionary] = useState<{
    text: string;
    segments: FuriganaSegment[];
  } | null>(null);
  const [dictionaryError, setDictionaryError] = useState(false);
  const [source, setSource] = useState<"dictionary" | "ai">("dictionary");
  const [furiganaType, setFuriganaType] = useState<FuriganaType>("hiragana");
  const ai = useAiFurigana();

  useEffect(() => {
    let cancelled = false;
    setDictionaryError(false);
    if (!text) {
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const { tokens } = await sendMessage("getKanjiMarks", {
          texts: [text],
          furiganaType: "hiragana",
        });
        if (!cancelled) {
          setDictionary({ text, segments: getFuriganaSegments(tokens[0] ?? [], text) });
        }
      } catch {
        if (!cancelled) {
          setDictionaryError(true);
        }
      }
    }, 100);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text]);

  // Keep canonical hiragana so switching Romaji -> Hiragana is lossless.
  const canonical =
    source === "ai" ? ai.result : dictionary?.text === text ? dictionary.segments : null;
  const segments = (canonical ?? []).map((segment) => {
    if (segment.type === "text" || furiganaType === "hiragana") {
      return segment;
    }
    return {
      ...segment,
      reading:
        furiganaType === "katakana" ? toKatakana(segment.reading) : toRomaji(segment.reading),
    };
  });

  return (
    <div className="w-full">
      <AiModelPanel
        ai={ai}
        hasText={text.trim().length > 0}
        onGenerate={() => {
          setSource("ai");
          ai.run(text);
        }}
      />
      <FuriganaTypeRadioGroup selected={furiganaType} onChange={setFuriganaType} />
      <div className="mt-3 grid w-full gap-2.5 text-xl md:grid-cols-2">
        <JapaneseTextarea
          value={text}
          onChange={(value) => {
            ai.reset();
            setText(value);
          }}
        />
        <div className="flex min-w-0 flex-col gap-2">
          <fieldset aria-label={t("aiCompare")} className="flex gap-2">
            {(["dictionary", "ai"] as const).map((value) => (
              <button
                key={value}
                aria-pressed={source === value}
                onClick={() => setSource(value)}
                className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-sm aria-pressed:bg-slate-200 dark:border-slate-600 dark:aria-pressed:bg-slate-700"
              >
                {t(value === "dictionary" ? "aiDictionaryResult" : "aiModelResult")}
              </button>
            ))}
          </fieldset>
          {source === "dictionary" && dictionaryError ? (
            <p role="alert" className="text-sm">
              {t("aiDictionaryError")}
            </p>
          ) : null}
          <TextWithFurigana
            furiganaSegments={segments}
            emptyMessage={source === "ai" ? t("aiEmptyResult") : undefined}
          />
        </div>
      </div>
    </div>
  );
};
