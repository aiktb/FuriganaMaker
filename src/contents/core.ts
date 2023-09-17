import type { PlasmoCSConfig } from 'plasmo'

export const FURIGANA_CLASS = '--furigana--'

export const config: PlasmoCSConfig = {
  matches: ['https://*/*']
}

export enum ExtensionEvent {
  // The user starts selecting elements on the page that need to be marked.
  // This event does not require Storage.
  Custom = 'custom',
  // To switch the furigana display of the page, use the display property of CSS.
  Display = 'display',
  // Show furigana when pointer hovers over Japanese Kanji.
  Hover = 'hover',
  // Switches the display type of furigana.
  Furigana = 'furigana',
  // Select the type of text that can be copied.
  // This event does not require Storage.
  Select = 'select',
  // Change the font size of furigana.
  Fontsize = 'fontsize',
  // Change the font color of furigana.
  Color = 'color'
}

export type StyleEvent =
  | ExtensionEvent.Display
  | ExtensionEvent.Hover
  | ExtensionEvent.Select
  | ExtensionEvent.Fontsize
  | ExtensionEvent.Color

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
