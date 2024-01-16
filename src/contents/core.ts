import type { PlasmoCSConfig } from 'plasmo';
import Browser from 'webextension-polyfill';

export const FURIGANA_CLASS = '--furigana--';

export const config: PlasmoCSConfig = {
  matches: ['https://*/*'],
};

export enum ExtensionEvent {
  AddFurigana = 'addFurigana',
  ToggleDisplay = 'toggleDisplay',
  ToggleHoverMode = 'toggleHoverMode',
  SwitchFuriganaType = 'switchFuriganaType',
  SwitchSelectMode = 'switchSelectMode',
  AdjustFontSize = 'adjustFontSize',
  AdjustFontColor = 'adjustFontColor',
  ToggleKanjiFilter = 'toggleN5Filter',
}

export enum ExtensionStorage {
  Display = 'display',
  HoverMode = 'hoverMode',
  FuriganaType = 'furiganaType',
  SelectMode = 'selectMode',
  FontSize = 'fontSize',
  FontColor = 'fontColor',
  N5Filter = 'n5Filter',
  UserRules = 'userRules',
}

export type StyleEvent =
  | ExtensionEvent.ToggleDisplay
  | ExtensionEvent.ToggleHoverMode
  | ExtensionEvent.SwitchSelectMode
  | ExtensionEvent.AdjustFontSize
  | ExtensionEvent.AdjustFontColor
  | ExtensionEvent.ToggleKanjiFilter;

export enum FuriganaType {
  Hiragana = 'hiragana',
  Katakana = 'katakana',
  Romaji = 'romaji',
}

export enum SelectMode {
  Original = 'original',
  Default = 'default',
  /* Since Firefox and Chromium have different rendering strategies for ruby tags,
   this mode cannot be implemented in Firefox using only CSS,
   so this mode is limited to Chrome/Edge. */
  Parentheses = 'parentheses',
}

export interface Config {
  [key: string]: string | number | boolean;
  display: boolean;
  hoverMode: boolean;
  furiganaType: FuriganaType;
  selectMode: SelectMode;
  fontSize: number;
  fontColor: string;
  n5Filter: boolean;
}

export const defaultConfig: Config = {
  display: true,
  hoverMode: false,
  furiganaType: FuriganaType.Hiragana,
  selectMode: SelectMode.Original,
  fontSize: 75, // ${fontsize}% relative to the parent font.
  fontColor: 'currentColor',
  n5Filter: false,
};

export interface Rule {
  domain: string; // This field is unique.
  selector: string;
  active: boolean;
}

export type StorageChangeEvent =
  | ExtensionEvent.AdjustFontColor
  | ExtensionEvent.AdjustFontSize
  | ExtensionEvent.SwitchFuriganaType
  | ExtensionEvent.SwitchSelectMode
  | ExtensionEvent.ToggleDisplay
  | ExtensionEvent.ToggleHoverMode
  | ExtensionEvent.ToggleKanjiFilter;

export const toStorageKey = (event: StorageChangeEvent) => {
  switch (event) {
    case ExtensionEvent.AdjustFontColor:
      return ExtensionStorage.FontColor;
    case ExtensionEvent.AdjustFontSize:
      return ExtensionStorage.FontSize;
    case ExtensionEvent.SwitchFuriganaType:
      return ExtensionStorage.FuriganaType;
    case ExtensionEvent.SwitchSelectMode:
      return ExtensionStorage.SelectMode;
    case ExtensionEvent.ToggleDisplay:
      return ExtensionStorage.Display;
    case ExtensionEvent.ToggleHoverMode:
      return ExtensionStorage.HoverMode;
    case ExtensionEvent.ToggleKanjiFilter:
      return ExtensionStorage.N5Filter;
  }
};

export const sendMessage = async (id: number, event: ExtensionEvent) => {
  try {
    await Browser.tabs.sendMessage(id, event);
  } catch (error) {
    if (
      !(error instanceof Error) ||
      error.message !== 'Could not establish connection. Receiving end does not exist.'
    ) {
      throw error;
    }
  }
};
