export const FURIGANA_CLASS = '--furigana--'

export enum CustomEvent {
  Custom = 'custom',
  Display = 'display',
  Hover = 'hover',
  Furigana = 'furigana',
  Select = 'select',
  Fontsize = 'fontsize',
  Color = 'color'
}

export type StyleEvent =
  | CustomEvent.Display
  | CustomEvent.Hover
  | CustomEvent.Select
  | CustomEvent.Fontsize
  | CustomEvent.Color

export type ChangeEvent = StyleEvent | CustomEvent.Furigana

export type Config = {
  [key: string]: string | number | boolean
  display: boolean
  hover: boolean
  furigana: 'hiragana' | 'katakana' | 'romaji'
  select: 'original' | 'furigana' | 'all'
  fontsize: number
  color: string
}

export const defaultConfig: Config = {
  display: true,
  hover: false,
  furigana: 'hiragana',
  select: 'original',
  fontsize: 75, // ${fontsize}% relative to the parent font.
  color: 'currentColor'
}
