import { toKurokanjiToken, type KurokanjiToken } from 'kurokanji'
import type { PlasmoCSConfig } from 'plasmo'
import { toHiragana, toRomaji } from 'wanakana'

import { sendToBackground } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'

import type {
  RequestBody,
  ResponseBody
} from '~background/messages/fetchKuromoji'

export const config: PlasmoCSConfig = {
  matches: ['https://twitter.com/*'],
  all_frames: true
}

const observer = new MutationObserver((records, _observer) => {
  const jaNodes = records
    .flatMap((record) => Array.from(record.addedNodes))
    .filter((node) => node.nodeType === Node.ELEMENT_NODE)
    .flatMap((node) =>
      Array.from((node as Element).querySelectorAll('div[lang="ja"] span'))
    )
    .flatMap(getAllTextNodes)

  addFurigana(jaNodes)
})

observer.observe(document.body, { childList: true, subtree: true })

async function tokenize(text: string): Promise<KurokanjiToken[]> {
  const response = await sendToBackground<RequestBody, ResponseBody>({
    name: 'fetchKuromoji',
    body: {
      text: text
    }
  })
  return toKurokanjiToken(response.message)
}

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
      // This is an asynchronous bug (+ twitter bug), often the same node is executed twice addRubyTagsToNode(),
      // because tokenize is executed asynchronously, it will cause the two calls to get the same KurokanjiToken[],
      // but after one of them is completed, the content of node has been changed, and the return value is invalid.
      if (token.end > node.textContent!.length) {
        break
      }
      // range is [start, end), very good!
      const range = document.createRange()
      range.setStart(node, token.start)
      range.setEnd(node, token.end)
      range.deleteContents()
      range.insertNode(ruby)
    }
  }
}

async function createRuby(
  original: string,
  reading: string
): Promise<HTMLElement> {
  const rubyNode = document.createElement('ruby')
  const originalTextNode = document.createTextNode(original)

  const storage = new Storage()
  const furiganaType = await storage.get('furiganaType')
  let readingText: string
  switch (furiganaType) {
    case 'hiragana':
      readingText = toHiragana(reading)
      break
    case 'romaji':
      readingText = toRomaji(reading)
      break
    case 'katakana':
      // token.reading default is katakana
      readingText = reading
      break
    default:
      throw new Error('Invalid furigana type')
  }
  const readingTextNode = document.createTextNode(readingText)
  const rt = document.createElement('rt')
  rt.appendChild(readingTextNode)
  rubyNode.appendChild(originalTextNode)
  rubyNode.appendChild(rt)
  rubyNode.classList.add('furigana')
  return rubyNode
}
