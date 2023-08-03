import type { PlasmoCSConfig } from 'plasmo'

import type { KuromojiToken } from '~contents/kanji'

export enum Change {
  Furigana = 'furigana',
  Select = 'select',
  Color = 'color',
  Display = 'display',
  Engine = 'engine',
  Fontsize = 'fontsize'
}

export enum Class {
  Furigana = 'furigana',
  Select = 'furigana-select',
  Color = 'furigana-color',
  Display = 'furigana-display',
  Engine = 'furigana-engine',
  Fontsize = 'furigana-fontsize'
}

export type Furigana = 'hiragana' | 'katakana' | 'romaji'
export type Display = 'on' | 'off'
export type Select = 'on' | 'off'
export type Engine = 'local' | 'network'
export type Color = string
export type Fontsize = number

export type RequestBody = {
  text: string
}

export type ResponseBody = {
  message: KuromojiToken[]
}

export const config: PlasmoCSConfig = {
  matches: ['https://twitter.com/*'],
  all_frames: true
}
