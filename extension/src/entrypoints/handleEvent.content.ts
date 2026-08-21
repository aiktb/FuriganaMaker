import { match } from "ts-pattern";
import { toHiragana, toKatakana, toRomaji } from "wanakana";

import {
  DisplayMode,
  ExtStorage,
  FURIGANA_CLASS,
  FuriganaType,
  type GeneralSettings,
  type MoreSettings,
  SelectMode,
} from "@/constants";
import { Selector } from "@/dom/selectElement";
import { onMessage } from "@/message";
import { generalSettings, moreSettings } from "@/storage/settings";

const watchedGeneralStorageKeys = [
  ExtStorage.DisplayMode,
  ExtStorage.SelectMode,
  ExtStorage.FontSize,
  ExtStorage.FontColor,
  ExtStorage.KanjiFilter,
] as const;
const watchedMoreStorageKeys = [ExtStorage.ColoringKanji] as const;

type WatchedGeneralStorageKey = (typeof watchedGeneralStorageKeys)[number];
type WatchedMoreStorageKey = (typeof watchedMoreStorageKeys)[number];
type StyleSettings = Pick<GeneralSettings, WatchedGeneralStorageKey> &
  Pick<MoreSettings, WatchedMoreStorageKey>;

const styleElementId = `${FURIGANA_CLASS}styles`;

export default defineContentScript({
  matches: ["*://*/*"],
  runAt: "document_start",

  async main() {
    // styleHandler uses storage and is called immediately,
    // so it needs to be initialized immediately.
    const [generalStorage, moreStorage] = await Promise.all([
      generalSettings.getValue(),
      moreSettings.getValue(),
    ]);
    styleHandler(toStyleSettings(generalStorage, moreStorage));

    generalSettings.watch(async (newSettings, oldSettings) => {
      if (hasChanged(watchedGeneralStorageKeys, newSettings, oldSettings)) {
        styleHandler(toStyleSettings(newSettings, await moreSettings.getValue()));
      }
      if (newSettings[ExtStorage.FuriganaType] !== oldSettings[ExtStorage.FuriganaType]) {
        switchFuriganaHandler(newSettings[ExtStorage.FuriganaType]);
      }
    });
    moreSettings.watch(async (newSettings, oldSettings) => {
      if (hasChanged(watchedMoreStorageKeys, newSettings, oldSettings)) {
        styleHandler(toStyleSettings(await generalSettings.getValue(), newSettings));
      }
    });

    onMessage("canAddFurigana", () => {
      return true;
    });
    onMessage("addFurigana", () => {
      addFuriganaHandler();
    });
  },
});

function toStyleSettings(general: GeneralSettings, more: MoreSettings): StyleSettings {
  return {
    ...toGeneralStyleSettings(general),
    ...toMoreStyleSettings(more),
  };
}

function toGeneralStyleSettings(settings: GeneralSettings) {
  return {
    [ExtStorage.DisplayMode]: settings[ExtStorage.DisplayMode],
    [ExtStorage.SelectMode]: settings[ExtStorage.SelectMode],
    [ExtStorage.FontSize]: settings[ExtStorage.FontSize],
    [ExtStorage.FontColor]: settings[ExtStorage.FontColor],
    [ExtStorage.KanjiFilter]: settings[ExtStorage.KanjiFilter],
  } satisfies Pick<StyleSettings, WatchedGeneralStorageKey>;
}

function toMoreStyleSettings(settings: MoreSettings) {
  return {
    [ExtStorage.ColoringKanji]: settings[ExtStorage.ColoringKanji],
  } satisfies Pick<StyleSettings, WatchedMoreStorageKey>;
}

function hasChanged<T extends Record<K, unknown>, K extends keyof T>(
  keys: readonly K[],
  newSettings: T,
  oldSettings: T,
) {
  return keys.some((key) => newSettings[key] !== oldSettings[key]);
}

function styleHandler(settings: StyleSettings) {
  const css = buildStyleCss(settings);

  const oldStyle = document.getElementById(styleElementId);
  if (oldStyle) {
    oldStyle.textContent = css;
  } else {
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("id", styleElementId);
    style.textContent = css;
    // This content script runs at `document_start`, where the parser has produced the
    // document element but not necessarily `<head>`. Reaching it usually still works
    // because the storage read above yields first, but that is a race, and losing it
    // would throw and take the whole content script down. A `<style>` applies wherever
    // it sits in the document, so the document element is a safe anchor.
    (document.head ?? document.documentElement).appendChild(style);
  }
}

function buildStyleCss(settings: StyleSettings) {
  const rubySelector = `ruby.${FURIGANA_CLASS}`;
  const rtSelector = `${rubySelector} > rt`;
  const rtHoverSelector = `${rubySelector}:hover > rt`;
  const rpSelector = `${rubySelector} > rp`;
  const filteredRtSelector = `${rubySelector}.isFiltered > rt`;

  const displayModeCss = match(settings[ExtStorage.DisplayMode])
    .with(
      DisplayMode.Never,
      () => `
          ${rtSelector} {
            display: none;
          }`,
    )
    .with(
      DisplayMode.Hover,
      () => `
          ${rtSelector} {
            opacity: 0;
          }

          ${rtHoverSelector} {
            opacity: 1;
          }`,
    )
    .with(
      DisplayMode.HoverNoGap,
      () => `
          ${rtSelector} {
            display: none;
          }

          ${rtHoverSelector} {
            display: revert;
          }`,
    )
    .with(
      DisplayMode.HoverMask,
      () => `
          ${rtSelector} {
            background-color: currentColor;
            border-radius: 0.25em;
          }

          ${rtHoverSelector} {
            background-color: transparent;
            transition: background-color 0.15s ease-in-out;
          }`,
    )
    .with(DisplayMode.Always, () => "")
    .exhaustive();
  const selectModeCss = `
        ${rtSelector} {
          user-select: ${settings[ExtStorage.SelectMode] === SelectMode.Original ? "none" : "text"};
        }

        ${rpSelector} {
          display: ${settings[ExtStorage.SelectMode] === SelectMode.Parentheses ? "block" : "none"};
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }`;
  const fontSizeCss = `
        ${rtSelector} {
          font-size: ${settings[ExtStorage.FontSize]}%;
        }`;
  const fontColorCss = `
        ${settings[ExtStorage.ColoringKanji] ? rubySelector : rtSelector} {
          color: ${settings[ExtStorage.FontColor]};
        }`;
  const kanjiFilterCss = settings[ExtStorage.KanjiFilter]
    ? `
          ${filteredRtSelector} {
            display: none;
          }`
    : "";

  return [displayModeCss, selectModeCss, fontSizeCss, fontColorCss, kanjiFilterCss].join("\n");
}

function switchFuriganaHandler(value: FuriganaType) {
  const rtSelector = `ruby.${FURIGANA_CLASS} > rt`;
  const nodes = document.querySelectorAll(rtSelector);
  const transformer = match(value)
    .with(FuriganaType.Hiragana, () => toHiragana)
    .with(FuriganaType.Katakana, () => toKatakana)
    .with(FuriganaType.Romaji, () => toRomaji)
    .exhaustive();
  for (const node of nodes) {
    node.textContent = transformer(node.textContent!);
  }
}

function addFuriganaHandler() {
  // `Selector` owns its own listeners, including the Escape key that closes it,
  // so calling this repeatedly cannot accumulate listeners.
  Selector.create().open();
}
