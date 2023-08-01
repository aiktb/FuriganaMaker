import { Storage } from '@plasmohq/storage'

const storage = new Storage()
chrome.runtime.onInstalled.addListener(async () => {
  // katakana/hiragana/romaji
  await storage.set('furiganaType', 'katakana')
  await storage.set('furiganaColor', 'currentColor')
  // furigana/original/all
  await storage.set('furiganaSelect', 'furigana')
  // on/off
  await storage.set('furiganaDisplay', 'on')
})

chrome.storage.onChanged.addListener
