import type { PlasmoCSConfig } from 'plasmo'
import { toHiragana, toRomaji } from 'wanakana'

import { sendToBackground } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'

import { ExtensionStorage, FURIGANA_CLASS, FuriganaType } from './core'
import { KanjiToken, MojiToken, toKanjiToken } from './kanjiTokenizer'

export const config: PlasmoCSConfig = {
  matches: ['https://*/*']
}

/**
 * Append ruby tag to all text nodes of a batch of elements.
 * @remarks
 * The parent element of the text node will be added with the FURIGANA_CLASS.
 * Elements that have already been marked will be skipped.
 * Ruby tag is "\<ruby>original\<rp>(\</rp>\<rt>reading\</rt>\<rp>)\</rp>\</ruby>".
 **/
export function addFurigana(elements: Element): Promise<void>
export function addFurigana(elements: Element[]): Promise<void>
export async function addFurigana(elements: Element | Element[]) {
  const japaneseTexts: Text[] = []
  if (Array.isArray(elements)) {
    japaneseTexts.push(...elements.flatMap(collectTexts))
  } else {
    japaneseTexts.push(...collectTexts(elements))
  }

  const storage = new Storage({ area: 'local' })
  const furiganaType: FuriganaType = await storage.get(
    ExtensionStorage.FuriganaType
  )

  for (const text of japaneseTexts) {
    const tokens: KanjiToken[] = await tokenize(text.textContent!)
    // reverse() prevents the range from being invalidated
    for (const token of tokens.reverse()) {
      const ruby = createRuby(token.original, token.reading, furiganaType)
      const range = document.createRange()
      range.setStart(text, token.start)
      range.setEnd(text, token.end)
      range.deleteContents()
      range.insertNode(ruby)
    }
  }
}

const collectTexts = (element: Element): Text[] => {
  element.normalize()
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  const texts: Text[] = []
  while (walker.nextNode()) {
    const node = walker.currentNode
    const parent = node.parentElement! as Element
    if (parent.tagName !== 'RUBY' && parent.tagName !== 'RT') {
      texts.push(node as Text)
    }
  }
  return texts
}

const tokenize = async (text: string): Promise<KanjiToken[]> => {
  const response = await sendToBackground<
    { text: string },
    { message: MojiToken[] }
  >({ name: 'getMojiTokens', body: { text } })
  return toKanjiToken(response.message)
}

const createRuby = (
  original: string,
  reading: string,
  furiganaType: FuriganaType
): HTMLElement => {
  const ruby = document.createElement('ruby')
  ruby.classList.add(FURIGANA_CLASS)
  const rightParenthesisRp = document.createElement('rp')
  rightParenthesisRp.textContent = ')'
  const leftParenthesisRp = document.createElement('rp')
  leftParenthesisRp.textContent = '('
  const originalText = document.createTextNode(original)

  switch (furiganaType) {
    case FuriganaType.Hiragana:
      reading = toHiragana(reading)
      break
    case FuriganaType.Romaji:
      reading = toRomaji(reading)
      break
    case FuriganaType.Katakana:
      // token.reading default is katakana
      break
  }
  const readingTextNode = document.createTextNode(reading)
  const rt = document.createElement('rt')
  rt.appendChild(readingTextNode)
  ruby.appendChild(originalText)
  ruby.appendChild(leftParenthesisRp)
  ruby.appendChild(rt)
  ruby.appendChild(rightParenthesisRp)
  return ruby
}
