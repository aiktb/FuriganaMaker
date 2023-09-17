import Browser from 'webextension-polyfill'

import { Storage } from '@plasmohq/storage'

import { defaultConfig, ExtensionEvent } from '~contents/core'

const storage = new Storage({ area: 'local' })

Browser.runtime.onInstalled.addListener(async () => {
  for (const key in defaultConfig) {
    const oldValue = await storage.get(key)
    if (!oldValue) {
      await storage.set(key, defaultConfig[key])
    }
  }
})

// Executing a keyboard shortcut from the commands API enable `activeTab`.
Browser.commands.onCommand.addListener(async (command, tab) => {
  const url = /^https:\/\/.*\/.*$/
  if (command === 'addFurigana' && tab?.url && url.test(tab.url)) {
    await Browser.tabs.sendMessage(tab.id!, ExtensionEvent.Custom)
  }
})

const contextMenuItem: Browser.Menus.CreateCreatePropertiesType = {
  id: 'addFurigana',
  title: 'Add furigana on the page',
  contexts: ['page'],
  documentUrlPatterns: ['https://*/*']
}
Browser.contextMenus.create(contextMenuItem)
Browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == 'addFurigana') {
    Browser.tabs.sendMessage(tab!.id!, ExtensionEvent.Custom)
  }
})
