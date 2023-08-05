import { Storage } from '@plasmohq/storage'

import { defaultConfig, type Config } from '~contents/core'

const storage = new Storage()
chrome.runtime.onInstalled.addListener(async () => {
  for (const key in defaultConfig) {
    await storage.set(key, defaultConfig[key as keyof Config])
  }
})
