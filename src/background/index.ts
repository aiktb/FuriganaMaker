import { Storage } from '@plasmohq/storage'

import { defaultConfig } from '~util/core'

const storage = new Storage()
chrome.runtime.onInstalled.addListener(async () => {
  for (const key in defaultConfig) {
    await storage.set(key, defaultConfig[key])
  }
})
