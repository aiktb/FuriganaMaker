import Browser from 'webextension-polyfill'

import { Storage } from '@plasmohq/storage'

import { defaultConfig, ExtensionEvent, Rule } from '~contents/core'

// Plasmo `dev` mode will force the Service Worker to be `active`, it will never become `inactive`.

const storage = new Storage({ area: 'local' })

Browser.runtime.onInstalled.addListener(async () => {
  for (const key in defaultConfig) {
    const oldConfig = await storage.get(key)
    if (!oldConfig) {
      await storage.set(key, defaultConfig[key])
    }
  }

  const oldRules: any[] = await storage.get('rules')
  if (!oldRules) {
    await storage.set('rules', rules)
  }
})

// Executing a keyboard shortcut from the commands API enable `activeTab`.
Browser.commands.onCommand.addListener(async (command, tab) => {
  // The root path of the website returned by tab.url contains '/' at the end. e.g. https://example.com/
  const https = /^https:\/\/.*\/.*$/
  if (!tab?.url || !https.test(tab.url)) {
    return
  }

  let event: ExtensionEvent | undefined
  switch (command) {
    case 'addFurigana':
      await Browser.tabs.sendMessage(tab.id!, ExtensionEvent.Custom)
      break
    case 'switchDisplay':
      event = ExtensionEvent.Display
      break
    case 'openHoverMode':
      event = ExtensionEvent.Hover
      break
    default:
      throw new Error('Unknown command')
  }
  if (event) {
    const oldValue: boolean = await storage.get(event)
    await storage.set(event, !oldValue)
    const tabs = await Browser.tabs.query({ url: 'https://*/*' })
    for (const tab of tabs) {
      await Browser.tabs.sendMessage(tab.id!, event)
    }
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

const rules: Rule[] = [
  {
    domain: 'twitter.com',
    selector: [
      {
        name: "div[lang='ja'] span",
        valid: true,
        observer: true
      }
    ]
  },
  {
    domain: 'www.asahi.com',
    selector: [
      {
        name: '.nfyQp h1, .nfyQp h2, .nfyQp h3, .nfyQp h4, .nfyQp h5, .nfyQp h6, .nfyQp p',
        valid: true,
        observer: false
      }
    ]
  }
]
