export const FURIGANA_CLASS = "--furigana--";

export enum ExtensionEvent {
  AddFurigana = "addFurigana",
  ToggleAutoMode = "toggleAutoMode",
  ToggleKanjiFilter = "toggleKanjiFilter",
  SwitchDisplayMode = "switchDisplayMode",
  SwitchFuriganaType = "switchFuriganaType",
  SwitchSelectMode = "switchSelectMode",
  AdjustFontSize = "adjustFontSize",
  AdjustFontColor = "adjustFontColor",
  MarkActiveTab = "markActiveTab",
}

// Please see `background/index.ts` for the default value.
export enum ExtensionStorage {
  AutoMode = "autoMode",
  KanjiFilter = "kanjiFilter",
  DisplayMode = "displayMode",
  FuriganaType = "furiganaType",
  SelectMode = "selectMode",
  FontSize = "fontSize",
  FontColor = "fontColor",
  // The following two items exceed the `chrome.stage.sync` quota,
  // so this extension doesn't consider synchronizing user settings.
  SelectorRules = "selectorRules",
  FilterRules = "filterRules",
}

export type StyleEvent =
  | ExtensionEvent.ToggleAutoMode
  | ExtensionEvent.SwitchDisplayMode
  | ExtensionEvent.SwitchSelectMode
  | ExtensionEvent.AdjustFontSize
  | ExtensionEvent.AdjustFontColor
  | ExtensionEvent.ToggleKanjiFilter;

export enum DisplayMode {
  Always = "always show",
  Never = "never show",
  Hover = "hover gap",
  // "Hover No-gap" mode will cause the page layout to shift frequently, but it is more beautiful.
  HoverNoGap = "hover no-gap",
}

export enum FuriganaType {
  Hiragana = "hiragana",
  Katakana = "katakana",
  Romaji = "romaji",
}

export enum SelectMode {
  Default = "default",
  Original = "original",
  /* Since Firefox and Chromium have different rendering strategies for ruby tags,
   this mode cannot be implemented in Firefox using only CSS,
   so this mode is limited to Chrome/Edge. */
  Parentheses = "parentheses",
}

export interface Config {
  [key: string]: string | number | boolean;
  [ExtensionStorage.AutoMode]: boolean;
  [ExtensionStorage.KanjiFilter]: boolean;
  [ExtensionStorage.DisplayMode]: DisplayMode;
  [ExtensionStorage.FuriganaType]: FuriganaType;
  [ExtensionStorage.SelectMode]: SelectMode;
  [ExtensionStorage.FontSize]: number;
  [ExtensionStorage.FontColor]: string;
}

export interface SelectorRule {
  domain: string; // This field is unique.
  selector: string;
  active: boolean;
}

export interface FilterRule {
  kanji: string;
  reading: string[];
}

export type StorageChangeEvent =
  | ExtensionEvent.ToggleKanjiFilter
  | ExtensionEvent.SwitchDisplayMode
  | ExtensionEvent.AdjustFontColor
  | ExtensionEvent.AdjustFontSize
  | ExtensionEvent.SwitchFuriganaType
  | ExtensionEvent.SwitchSelectMode
  | ExtensionEvent.ToggleAutoMode;
