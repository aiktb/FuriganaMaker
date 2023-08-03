import type { PlasmoCSConfig } from 'plasmo'
import { toHiragana, toRomaji } from 'wanakana'

import { sendToBackground } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'

import { Change, Class, type Furigana } from '~contents/core'
import type { KurokanjiToken, KuromojiToken } from '~contents/kanji'
import { toKurokanjiToken } from '~contents/kanji'

export const config: PlasmoCSConfig = {
  matches: ['https://twitter.com/*'],
  all_frames: true
}

const jaTweet = 'div[lang="ja"] span'
const observer = new MutationObserver((records, _observer) => {
  const jaNodes = records
    .flatMap((record) => Array.from(record.addedNodes))
    .filter((node) => node.nodeType === Node.ELEMENT_NODE)
    .flatMap((node) => Array.from((node as Element).querySelectorAll(jaTweet)))
    .flatMap((node) => {
      ;(node as Element).classList.add(Class.Furigana)
      return getAllTextNodes(node)
    })

  const uniqueJaNodes = [...new Set(jaNodes)]
  addFurigana(uniqueJaNodes)
})

observer.observe(document.body, { childList: true, subtree: true })

const getAllTextNodes = (node: Node): Node[] => {
  const textNodes: Node[] = []
  if (node.nodeType === Node.TEXT_NODE) {
    const textContent = node.textContent?.trim()
    if (textContent && textContent.length) {
      textNodes.push(node)
    }
  } else {
    const nodes = Array.from(node.childNodes).flatMap(getAllTextNodes)
    textNodes.push(...nodes)
  }
  return textNodes
}

// node must have only one text child node
// <ruby>${token.original}<rt>${token.reading}</rt></ruby>
const addFurigana = async (nodes: Node[]) => {
  for (const node of nodes) {
    const tokens: KurokanjiToken[] = await tokenize(node.textContent!)
    // reverse() prevents the range from being invalidated
    for (const token of tokens.reverse()) {
      const ruby = await createRuby(token.original, token.reading)
      const range = document.createRange()
      range.setStart(node, token.start)
      range.setEnd(node, token.end)
      range.deleteContents()
      range.insertNode(ruby)
    }
  }
}

const tokenize = async (text: string): Promise<KurokanjiToken[]> => {
  const response = await sendToBackground<
    { text: string },
    { message: KuromojiToken[] }
  >({
    name: 'fetchKuromoji',
    body: { text }
  })
  return toKurokanjiToken(response.message)
}

const createRuby = async (
  original: string,
  reading: string
): Promise<HTMLElement> => {
  const rubyNode = document.createElement('ruby')
  const originalTextNode = document.createTextNode(original)

  const storage = new Storage()
  const furiganaType: Furigana = await storage.get(Change.Furigana)
  switch (furiganaType) {
    case 'hiragana':
      reading = toHiragana(reading)
      break
    case 'romaji':
      reading = toRomaji(reading)
      break
    case 'katakana':
      // token.reading default is katakana
      break
  }
  const readingTextNode = document.createTextNode(reading)
  const rt = document.createElement('rt')
  rt.appendChild(readingTextNode)
  rubyNode.appendChild(originalTextNode)
  rubyNode.appendChild(rt)
  return rubyNode
}
