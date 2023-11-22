import type { PlasmoCSConfig } from 'plasmo'
import Browser from 'webextension-polyfill'

export const FURIGANA_CLASS = '--furigana--'

export const config: PlasmoCSConfig = {
  matches: ['https://*/*']
}

export enum ExtensionEvent {
  AddFurigana = 'addFurigana',
  ToggleDisplay = 'toggleDisplay',
  ToggleHoverMode = 'toggleHoverMode',
  SwitchFuriganaType = 'switchFuriganaType',
  SwitchSelectMode = 'switchSelectMode',
  AdjustFontSize = 'adjustFontSize',
  AdjustFontColor = 'adjustFontColor'
}

export enum ExtensionStorage {
  Display = 'display',
  HoverMode = 'hoverMode',
  FuriganaType = 'furiganaType',
  SelectMode = 'selectMode',
  FontSize = 'fontSize',
  FontColor = 'fontColor',
  UserRules = 'userRules'
}

export type StyleEvent =
  | ExtensionEvent.ToggleDisplay
  | ExtensionEvent.ToggleHoverMode
  | ExtensionEvent.SwitchSelectMode
  | ExtensionEvent.AdjustFontSize
  | ExtensionEvent.AdjustFontColor

export enum FuriganaType {
  Hiragana = 'hiragana',
  Katakana = 'katakana',
  Romaji = 'romaji'
}

export enum SelectMode {
  Original = 'original',
  Furigana = 'furigana'
}

export type Config = {
  [key: string]: string | number | boolean
  display: boolean
  hoverMode: boolean
  furiganaType: FuriganaType
  selectMode: SelectMode
  fontSize: number
  fontColor: string
}

export const defaultConfig: Config = {
  display: true,
  hoverMode: false,
  furiganaType: FuriganaType.Hiragana,
  selectMode: SelectMode.Original,
  fontSize: 75, // ${fontsize}% relative to the parent font.
  fontColor: 'currentColor'
}

export type Rule = {
  domain: string // This field is unique.
  selector: string
  active: boolean
}

export type StorageChangeEvent =
  | ExtensionEvent.AdjustFontColor
  | ExtensionEvent.AdjustFontSize
  | ExtensionEvent.SwitchFuriganaType
  | ExtensionEvent.SwitchSelectMode
  | ExtensionEvent.ToggleDisplay
  | ExtensionEvent.ToggleHoverMode

export const toStorageKey = (event: StorageChangeEvent) => {
  switch (event) {
    case ExtensionEvent.AdjustFontColor:
      return ExtensionStorage.FontColor
    case ExtensionEvent.AdjustFontSize:
      return ExtensionStorage.FontSize
    case ExtensionEvent.SwitchFuriganaType:
      return ExtensionStorage.FuriganaType
    case ExtensionEvent.SwitchSelectMode:
      return ExtensionStorage.SelectMode
    case ExtensionEvent.ToggleDisplay:
      return ExtensionStorage.Display
    case ExtensionEvent.ToggleHoverMode:
      return ExtensionStorage.HoverMode
  }
}

export const sendMessage = async (id: number, event: ExtensionEvent) => {
  try {
    await Browser.tabs.sendMessage(id, event)
  } catch (error) {
    if (
      !(error instanceof Error) ||
      error.message !== 'Could not establish connection. Receiving end does not exist.'
    ) {
      throw error
    }
  }
}
