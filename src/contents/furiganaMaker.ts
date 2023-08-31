import { toHiragana, toRomaji } from 'wanakana'

import { sendToBackground } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'

import { CustomEvent, FURIGANA_CLASS } from '~contents/core'
import { KanjiToken, MojiToken, toKanjiToken } from '~contents/kanjiTokenizer'

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

  for (const text of japaneseTexts) {
    const tokens: KanjiToken[] = await tokenize(text.textContent!)
    // reverse() prevents the range from being invalidated
    for (const token of tokens.reverse()) {
      const ruby = await createRuby(token.original, token.reading)
      const range = document.createRange()
      range.setStart(text, token.start)
      range.setEnd(text, token.end)
      range.deleteContents()
      range.insertNode(ruby)
    }
  }
}

const collectTexts = (element: Element): Text[] => {
  if (element.parentElement?.classList.contains(FURIGANA_CLASS)) {
    return []
  }
  element.normalize()
  const texts: Text[] = []
  const isText = element.nodeType === Node.TEXT_NODE
  const isEmpty = !!element.textContent?.trim().length
  if (isText && isEmpty) {
    element.parentElement!.classList.add(FURIGANA_CLASS)
    texts.push(element as Node as Text)
  } else {
    const elements = Array.from(
      element.childNodes as NodeListOf<Element>
    ).flatMap(collectTexts)
    texts.push(...elements)
  }
  return texts
}

const tokenize = async (text: string): Promise<KanjiToken[]> => {
  const response = await sendToBackground<
    { text: string },
    { message: MojiToken[] }
  >({ name: 'fetchKuromoji', body: { text } })
  return toKanjiToken(response.message)
}

const createRuby = async (
  original: string,
  reading: string
): Promise<HTMLElement> => {
  const ruby = document.createElement('ruby')
  const rightParenthesisRp = document.createElement('rp')
  rightParenthesisRp.textContent = ')'
  const leftParenthesisRp = document.createElement('rp')
  leftParenthesisRp.textContent = '('
  const originalText = document.createTextNode(original)

  const storage = new Storage({ area: 'local' })
  const furiganaType = await storage.get(CustomEvent.Furigana)
  switch (furiganaType) {
    case 'hiragana':
      reading = toHiragana(reading)
      break
    case 'romaji':
      reading = toRomaji(reading)
      break
    default:
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
