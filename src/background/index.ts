import { Storage } from '@plasmohq/storage'

import { defaultConfig } from '~util/core'

const storage = new Storage()
chrome.runtime.onInstalled.addListener(async () => {
  for (const key in defaultConfig) {
    const oldValue = await storage.get(key)
    if (!oldValue) {
      await storage.set(key, defaultConfig[key])
    }
  }
})
