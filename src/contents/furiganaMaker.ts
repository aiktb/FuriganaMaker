import { toHiragana, toRomaji } from 'wanakana'

import { sendToBackground } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'

import { CustomEvent, FURIGANA_CLASS_NAME, FuriganaType } from '~contents/core'
import {
  KurokanjiToken,
  KuromojiToken,
  toKurokanjiToken
} from '~contents/kanjiTokenizer'

/**
 * Append ruby tag to all text nodes of a batch of elements.
 * @remarks
 * The parent element of the text node will be added with the FURIGANA_CLASS_NAME class.
 * Elements that have already been marked will be skipped.
 * Ruby tag is "\<ruby>original\<rp>(\</rp>\<rt>reading\</rt>\<rp>)\</rp>\</ruby>".
 **/
export const addFurigana = async (elements: Element[]) => {
  const japaneseTexts = elements.flatMap(collectTexts)
  for (const text of japaneseTexts) {
    const tokens: KurokanjiToken[] = await tokenize(text.textContent!)
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
  if (element.parentElement?.classList.contains(FURIGANA_CLASS_NAME)) {
    return []
  }
  element.normalize()
  const texts: Text[] = []
  const isText = element.nodeType === Node.TEXT_NODE
  const isEmpty = !!element.textContent?.trim().length
  if (isText && isEmpty) {
    element.parentElement!.classList.add(FURIGANA_CLASS_NAME)
    texts.push(element as Node as Text)
  } else {
    const elements = Array.from(
      element.childNodes as NodeListOf<Element>
    ).flatMap(collectTexts)
    texts.push(...elements)
  }
  return texts
}

const tokenize = async (text: string): Promise<KurokanjiToken[]> => {
  const response = await sendToBackground<
    { text: string },
    { message: KuromojiToken[] }
  >({ name: 'fetchKuromoji', body: { text } })
  return toKurokanjiToken(response.message)
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
  const furiganaType: FuriganaType = await storage.get(CustomEvent.FuriganaType)
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
  ruby.appendChild(originalText)
  ruby.appendChild(leftParenthesisRp)
  ruby.appendChild(rt)
  ruby.appendChild(rightParenthesisRp)
  return ruby
}
