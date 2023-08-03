import { Storage } from '@plasmohq/storage'

// prettier-ignore
import type { Color, Display, Engine, Fontsize, Furigana, Select } from '~contents/core';

export type Default = {
  furigana: Furigana
  color: Color
  select: Select
  display: Display
  fontsize: Fontsize
  engine: Engine
}

export const defaultValue: Default = {
  furigana: 'hiragana',
  color: 'currentColor',
  select: 'original',
  display: 'on',
  fontsize: 75,
  engine: 'local'
}
const storage = new Storage()
chrome.runtime.onInstalled.addListener(async () => {
  for (const key in defaultValue) {
    await storage.set(key, defaultValue[key as keyof Default])
  }
})
