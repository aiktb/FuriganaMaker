import { Storage } from '@plasmohq/storage'

// prettier-ignore
import { defaultValue, type Default } from '~contents/core';

const storage = new Storage()
chrome.runtime.onInstalled.addListener(async () => {
  for (const key in defaultValue) {
    await storage.set(key, defaultValue[key as keyof Default])
  }
})
