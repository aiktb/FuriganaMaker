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

Browser.commands.onCommand.addListener(async (command) => {
  let event: ExtensionEvent
  switch (command) {
    case 'addFurigana':
      event = ExtensionEvent.Custom
      break
    case 'switchDisplay':
      event = ExtensionEvent.Display
      const oldValue = await storage.get(ExtensionEvent.Display)
      await storage.set(ExtensionEvent.Display, !oldValue)
      break
    default:
      throw new Error('Unknown command')
  }
  const tabs = await Browser.tabs.query({
    active: true,
    currentWindow: true
  })
  for (const tab of tabs) {
    await Browser.tabs.sendMessage(tab.id!, event)
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
