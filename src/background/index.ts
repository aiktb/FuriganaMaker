import { Storage } from '@plasmohq/storage'

import { defaultConfig, Event } from '~util/core'

const storage = new Storage()
chrome.runtime.onInstalled.addListener(async () => {
  for (const key in defaultConfig) {
    const oldValue = await storage.get(key)
    if (!oldValue) {
      await storage.set(key, defaultConfig[key])
    }
  }
})

chrome.commands.onCommand.addListener(async (command) => {
  let event: Event
  switch (command) {
    case 'addFurigana':
      event = Event.Custom
      break
    case 'switchDisplay':
      event = Event.Display
      const oldValue = await storage.get(Event.Display)
      await storage.set(Event.Display, !oldValue)
      break
    default:
      throw new Error('Unknown command')
  }
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true
  })
  for (const tab of tabs) {
    await chrome.tabs.sendMessage(tab.id!, event)
  }
})

const contextMenuItem: chrome.contextMenus.CreateProperties = {
  id: 'addFurigana',
  title: 'Add furigana on the page',
  contexts: ['page'],
  documentUrlPatterns: ['https://*/*', 'http://*/*']
}
chrome.contextMenus.create(contextMenuItem)
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == 'addFurigana') {
    chrome.tabs.sendMessage(tab!.id!, Event.Custom)
  }
})
