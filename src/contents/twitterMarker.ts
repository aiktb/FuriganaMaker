import type { PlasmoCSConfig } from 'plasmo'

import { addFurigana } from '~contents/furiganaMaker'

export const config: PlasmoCSConfig = {
  matches: ['https://twitter.com/*']
}

const japaneseTweet = 'div[lang="ja"] span'
const observer = new MutationObserver((records) => {
  const japaneseElements = records
    .flatMap((record) => Array.from(record.addedNodes))
    .filter((node) => node.nodeType === Node.ELEMENT_NODE)
    .flatMap((node) =>
      Array.from((node as Element).querySelectorAll(japaneseTweet))
    )

  addFurigana(japaneseElements)
})

observer.observe(document.body, { childList: true, subtree: true })
