import type { PlasmoCSConfig } from 'plasmo'

import { addFurigana } from '~contents/core'

export const config: PlasmoCSConfig = {
  matches: ['https://twitter.com/*'],
  all_frames: true
}

const jaTweet = 'div[lang="ja"] span'
const observer = new MutationObserver((records, _observer) => {
  const jaElements = records
    .flatMap((record) => Array.from(record.addedNodes))
    .filter((node) => node.nodeType === Node.ELEMENT_NODE)
    .flatMap((node) => Array.from((node as Element).querySelectorAll(jaTweet)))

  addFurigana(jaElements)
})

observer.observe(document.body, { childList: true, subtree: true })
