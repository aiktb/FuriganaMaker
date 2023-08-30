export const FURIGANA_CLASS_NAME = '--furigana--'

export enum CustomEvent {
  FuriganaType = 'FuriganaType',
  SelectMode = 'SelectMode',
  FuriganaColor = 'FuriganaColor',
  Display = 'Display',
  Fontsize = 'Fontsize',
  Custom = 'Custom'
}

export type StyleEvent =
  | CustomEvent.SelectMode
  | CustomEvent.FuriganaColor
  | CustomEvent.Display
  | CustomEvent.Fontsize

export type ChangeEvent =
  | CustomEvent.FuriganaType
  | CustomEvent.FuriganaColor
  | CustomEvent.SelectMode
  | CustomEvent.Display
  | CustomEvent.Fontsize

export type Config = {
  [key: string]: string | number | boolean
  FuriganaType: FuriganaType
  FuriganaColor: FuriganaColor
  SelectMode: SelectMode
  Display: Display
  Fontsize: Fontsize
}

export const defaultConfig: Config = {
  FuriganaType: 'hiragana',
  FuriganaColor: 'currentColor',
  SelectMode: 'original',
  Display: true,
  Fontsize: 75 // ${fontsize}% relative to the parent font.
}

export type FuriganaType = 'hiragana' | 'katakana' | 'romaji'
export type Display = boolean
export type SelectMode = 'original' | 'furigana' | 'all'
export type FuriganaColor = string
export type Fontsize = number
