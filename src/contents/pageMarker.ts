import type { PlasmoCSConfig } from 'plasmo'

import { sendToBackground } from '@plasmohq/messaging'

import { Selector } from './core'
import { addFurigana } from './furiganaMaker'

export const config: PlasmoCSConfig = {
  matches: ['https://*/*']
}

const mark = async () => {
  const response = await sendToBackground<
    { domain: string },
    { selector: Selector }
  >({ name: 'getSelector', body: { domain: location.hostname } })
  const plainSelector = response.selector.plain
  const observerSelector = response.selector.observer

  if (plainSelector) {
    const elements = Array.from(document.querySelectorAll(plainSelector))
    addFurigana(elements)
  }

  if (observerSelector) {
    const observer = new MutationObserver((records) => {
      const japaneseElements = records
        .flatMap((record) => Array.from(record.addedNodes))
        .filter((node) => node.nodeType === Node.ELEMENT_NODE)
        .flatMap((node) =>
          Array.from((node as Element).querySelectorAll(observerSelector))
        )

      addFurigana(japaneseElements)
    })

    observer.observe(document.body, { childList: true, subtree: true })
  }
}

// The content script generated by plasmo is a nested IIFE, and Top-level await cannot be used.
mark()
