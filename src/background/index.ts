import { Storage } from '@plasmohq/storage'

import type { Color, Display, Engine, Furigana, Select } from '~contents/core'

import { Change } from '../contents/core'

const storage = new Storage()
chrome.runtime.onInstalled.addListener(async () => {
  await storage.set(Change.Furigana, 'hiragana' as Furigana)
  await storage.set(Change.Color, 'currentColor' as Color)
  await storage.set(Change.Select, 'off' as Select)
  await storage.set(Change.Display, 'on' as Display)
  await storage.set(Change.Engine, 'local' as Engine)
})
