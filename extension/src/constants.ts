export const FURIGANA_CLASS = "--furigana--";

/**
 * Number of text characters above which a page counts as large enough that annotating
 * it automatically is a bad default: the reflow it causes freezes the page and can make
 * the whole browser unresponsive (issue#16). Such a page asks the user first, unless
 * they have opted the site into always running.
 */
export const LARGE_PAGE_TEXT_LENGTH = 30_000;

export const ExtStorage = {
  AutoMode: "autoMode",
  KanjiFilter: "kanjiFilter",
  DisplayMode: "displayMode",
  FuriganaType: "furiganaType",
  SelectMode: "selectMode",
  FontSize: "fontSize",
  FontColor: "fontColor",
  Language: "language",
  DisableWarning: "disableWarning",
  ColoringKanji: "coloringKanji",
  IncludeSites: "includeSites",
  ExcludeSites: "excludeSites",
  SelectorRules: "selectorRules",
  FilterRules: "filterRules",
  AlwaysRunSites: "alwaysRunSites",
} as const;
export type ExtStorage = (typeof ExtStorage)[keyof typeof ExtStorage];

export const DisplayMode = {
  Always: "always show",
  Never: "never show",
  Hover: "hover gap",
  HoverNoGap: "hover no-gap",
  HoverMask: "hover mask",
} as const;
export type DisplayMode = (typeof DisplayMode)[keyof typeof DisplayMode];

export const FuriganaType = {
  Hiragana: "hiragana",
  Katakana: "katakana",
  Romaji: "romaji",
} as const;
export type FuriganaType = (typeof FuriganaType)[keyof typeof FuriganaType];

export const SelectMode = {
  Default: "default",
  Original: "original",
  Parentheses: "parentheses",
} as const;
export type SelectMode = (typeof SelectMode)[keyof typeof SelectMode];

/**
 * Can only be modified on the Popup page.
 */
export interface GeneralSettings {
  [ExtStorage.AutoMode]: boolean;
  [ExtStorage.KanjiFilter]: boolean;
  [ExtStorage.DisplayMode]: DisplayMode;
  [ExtStorage.FuriganaType]: FuriganaType;
  [ExtStorage.SelectMode]: SelectMode;
  [ExtStorage.FontSize]: number;
  [ExtStorage.FontColor]: string;
}

/**
 * Can only be modified on the Options page and Content Scripts.
 */
export interface MoreSettings {
  /**
   * If null, the detected system language is used.
   */
  [ExtStorage.Language]: string | null;
  [ExtStorage.DisableWarning]: boolean;
  [ExtStorage.ColoringKanji]: boolean;
  /**
   * Glob is supported.
   * Default is ["*"] which matches all sites.
   */
  [ExtStorage.IncludeSites]: string[];
  /**
   * Glob is supported.
   */
  [ExtStorage.ExcludeSites]: string[];
  /**
   * Glob is supported.
   * Content Scripts also modify this field.
   */
  [ExtStorage.AlwaysRunSites]: string[];
}

export interface SelectorRule {
  domain: string; // This field is unique. Glob is supported.
  selector: string;
  active: boolean;
}

export type FilterRule = {
  kanji: string;
  yomikatas?: string[] | undefined; // If undefined, it matches all yomikatas.
};
