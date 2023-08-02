import type { KuromojiToken } from 'kurokanji'
import type { PlasmoCSConfig } from 'plasmo'

export enum Change {
  Furigana = 'furigana',
  Select = 'select',
  Color = 'color',
  Display = 'display',
  Engine = 'engine'
}

export enum Class {
  Furigana = 'furigana',
  Select = 'furigana-select',
  Color = 'furigana-color',
  Display = 'furigana-display',
  Engine = 'furigana-engine'
}

export type Furigana = 'hiragana' | 'katakana' | 'romaji'
export type Display = 'on' | 'off'
export type Select = 'on' | 'off'
export type Engine = 'local' | 'network'
export type Color = string

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
