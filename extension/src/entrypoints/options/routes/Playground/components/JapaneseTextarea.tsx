import { Textarea } from "@headlessui/react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import type { KanjiToken } from "@/core/toKanjiToken";

type JapaneseTextareaProps = {
  value: string;
  onChange: (value: string) => void;
};

export const JapaneseTextarea = ({ value: userInput, onChange }: JapaneseTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleTextareaChange = (e: React.InputEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    onChange(el.value);
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  const MAX_LENGTH = 5000;
  const { i18n } = useTranslation();
  const numberFormatter = new Intl.NumberFormat(i18n.language);
  const { t } = useTranslation();

  return (
    <div
      onClick={() => textareaRef.current?.focus()}
      className="flex w-full flex-col gap-2 rounded-lg border border-gray-200 px-6 py-4 text-slate-950 shadow-xs dark:border-slate-800 dark:text-white"
    >
      <Textarea
        data-testid="playground-japanese-textarea"
        ref={textareaRef}
        className="block min-h-40 w-full flex-1 resize-none border-none bg-transparent p-0 text-xl outline-none ring-0 placeholder:text-2xl"
        maxLength={MAX_LENGTH}
        autoFocus
        value={userInput}
        onInput={handleTextareaChange}
        placeholder={t("placeholderTypeFurigana")}
      />
      <div className="flex items-center justify-end gap-2">
        <div className="text-slate-800 text-xs dark:text-slate-200">{`${numberFormatter.format(userInput.length)} / ${numberFormatter.format(MAX_LENGTH)}`}</div>
        <button
          disabled={userInput.length === 0}
          onClick={() => {
            onChange("");
          }}
          className="flex items-center justify-center rounded-full p-2 transition enabled:cursor-pointer enabled:hover:bg-slate-500/10 disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:dark:bg-white/10"
        >
          <i className="i-tabler-square-rounded-x-filled size-5" />
          <span className="sr-only">{t("tipClearText")}</span>
        </button>
      </div>
    </div>
  );
};

export type FuriganaSegment =
  | {
      type: "text";
      original: string;
      id: string;
    }
  | {
      type: "furigana";
      original: string;
      reading: string;
      id: string;
    };

export const getFuriganaSegments = (tokens: KanjiToken[], text: string) => {
  const result: FuriganaSegment[] = [];

  let lastIndex = 0;
  const getFurigana = (token: KanjiToken) => {
    return {
      type: "furigana",
      original: text.slice(token.start, token.end),
      id: crypto.randomUUID(),
      reading: token.reading,
    } as const;
  };
  for (const token of tokens) {
    if (token.start > lastIndex) {
      result.push({
        type: "text",
        original: text.slice(lastIndex, token.start),
        id: crypto.randomUUID(),
      });
    }
    const furigana = getFurigana(token);
    result.push(furigana);
    lastIndex = token.end;
  }

  if (lastIndex < text.length) {
    result.push({
      type: "text",
      original: text.slice(lastIndex),
      id: crypto.randomUUID(),
    });
  }
  return result;
};
