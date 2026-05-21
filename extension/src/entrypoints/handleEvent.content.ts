import { match } from "ts-pattern";
import { toHiragana, toKatakana, toRomaji } from "wanakana";

import {
  DisplayMode,
  ExtEvent,
  ExtStorage,
  FURIGANA_CLASS,
  FuriganaType,
  type GeneralSettings,
  type MoreSettings,
  SelectMode,
} from "@/commons/constants";
import { Selector } from "@/commons/selectElement";
import { generalSettings, moreSettings } from "@/commons/utils";

const watchedGeneralStorageKeys = [
  ExtStorage.DisplayMode,
  ExtStorage.SelectMode,
  ExtStorage.FontSize,
  ExtStorage.FontColor,
  ExtStorage.KanjiFilter,
] as const;
const watchedMoreStorageKeys = [ExtStorage.ColoringKanji] as const;
const watchedStyleStorageKeys = [...watchedGeneralStorageKeys, ...watchedMoreStorageKeys] as const;

type WatchedGeneralStorageKey = (typeof watchedGeneralStorageKeys)[number];
type WatchedMoreStorageKey = (typeof watchedMoreStorageKeys)[number];
type WatchedStyleStorageKey = (typeof watchedStyleStorageKeys)[number];
type StyleSettingEntry =
  | {
      [K in WatchedGeneralStorageKey]: {
        type: K;
        value: GeneralSettings[K];
      };
    }[WatchedGeneralStorageKey]
  | {
      [K in WatchedMoreStorageKey]: {
        type: K;
        value: MoreSettings[K];
      };
    }[WatchedMoreStorageKey];

const styleElementId = `${FURIGANA_CLASS}styles`;
const styleEntriesByType = new Map<WatchedStyleStorageKey, StyleSettingEntry>();

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
    styleHandler([
      ...toGeneralStyleSettingEntries(generalStorage),
      ...toMoreStyleSettingEntries(moreStorage),
    ]);

    generalSettings.watch((newSettings, oldSettings) => {
      const changedStyleEntries = toChangedGeneralStyleSettingEntries(newSettings, oldSettings);
      if (changedStyleEntries.length > 0) {
        styleHandler(changedStyleEntries);
      }
      if (newSettings[ExtStorage.FuriganaType] !== oldSettings[ExtStorage.FuriganaType]) {
        switchFuriganaHandler(newSettings[ExtStorage.FuriganaType]);
      }
    });
    moreSettings.watch((newSettings, oldSettings) => {
      const changedStyleEntries = toChangedMoreStyleSettingEntries(newSettings, oldSettings);
      if (changedStyleEntries.length > 0) {
        styleHandler(changedStyleEntries);
      }
    });

    browser.runtime.onMessage.addListener((event: ExtEvent) => {
      if (event === ExtEvent.AddFurigana) {
        addFuriganaHandler();
      }
    });
  },
});

function toGeneralStyleSettingEntries(settings: GeneralSettings) {
  return watchedGeneralStorageKeys.map((type) => ({
    type,
    value: settings[type],
  })) as StyleSettingEntry[];
}

function toMoreStyleSettingEntries(settings: MoreSettings) {
  return watchedMoreStorageKeys.map((type) => ({
    type,
    value: settings[type],
  })) as StyleSettingEntry[];
}

function toChangedGeneralStyleSettingEntries(
  newSettings: GeneralSettings,
  oldSettings: GeneralSettings,
) {
  return watchedGeneralStorageKeys
    .filter((key) => newSettings[key] !== oldSettings[key])
    .map((type) => ({
      type,
      value: newSettings[type],
    })) as StyleSettingEntry[];
}

function toChangedMoreStyleSettingEntries(newSettings: MoreSettings, oldSettings: MoreSettings) {
  return watchedMoreStorageKeys
    .filter((key) => newSettings[key] !== oldSettings[key])
    .map((type) => ({
      type,
      value: newSettings[type],
    })) as StyleSettingEntry[];
}

function styleHandler(entries: StyleSettingEntry[]) {
  for (const entry of entries) {
    styleEntriesByType.set(entry.type, entry);
  }
  const orderedEntries = watchedStyleStorageKeys
    .map((type) => styleEntriesByType.get(type))
    .filter((entry) => entry !== undefined);
  const css = orderedEntries.map(buildStyleCss).join("\n");

  const oldStyle = document.getElementById(styleElementId);
  if (oldStyle) {
    oldStyle.textContent = css;
  } else {
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("id", styleElementId);
    style.textContent = css;
    document.head.appendChild(style);
  }
}

function buildStyleCss(entry: StyleSettingEntry) {
  const rubySelector = `ruby.${FURIGANA_CLASS}`;
  const rtSelector = `${rubySelector} > rt`;
  const rtHoverSelector = `${rubySelector}:hover > rt`;
  const rpSelector = `${rubySelector} > rp`;
  const filteredRtSelector = `${rubySelector}.isFiltered > rt`;

  const css = match(entry)
    .with({ type: ExtStorage.DisplayMode }, ({ value }) =>
      match(value)
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
        .exhaustive(),
    )
    .with(
      { type: ExtStorage.SelectMode },
      ({ value }) => `
        ${rtSelector} {
          user-select: ${value === SelectMode.Original ? "none" : "text"};
        }

        ${rpSelector} {
          display: ${value === SelectMode.Parentheses ? "block" : "none"};
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }`,
    )
    .with(
      { type: ExtStorage.FontSize },
      ({ value }) => `
        ${rtSelector} {
          font-size: ${value}%;
        }`,
    )
    .with({ type: ExtStorage.FontColor }, ({ value }) => {
      const coloringKanji = styleEntriesByType.get(ExtStorage.ColoringKanji)?.value ?? false;
      return `
        ${coloringKanji ? rubySelector : rtSelector} {
          color: ${value};
        }`;
    })
    .with({ type: ExtStorage.ColoringKanji }, () => "")
    .with({ type: ExtStorage.KanjiFilter }, ({ value }) =>
      value
        ? `
          ${filteredRtSelector} {
            display: none;
          }`
        : "",
    )
    .exhaustive();
  return css;
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
  const selector = Selector.create();
  const selectHandler = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      selector.close();
      document.removeEventListener("keydown", selectHandler);
    }
  };
  selector.open();
  document.addEventListener("keydown", selectHandler);
}
