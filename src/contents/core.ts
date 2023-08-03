import { toHiragana, toRomaji } from 'wanakana'

import { sendToBackground } from '@plasmohq/messaging'
import { Storage } from '@plasmohq/storage'

import type { KurokanjiToken, KuromojiToken } from '~contents/kanji'
import { toKurokanjiToken } from '~contents/kanji'

export enum Change {
  Furigana = 'furigana',
  Select = 'select',
  Color = 'color',
  Display = 'display',
  Fontsize = 'fontsize',
  Engine = 'engine'
}

export enum Class {
  Furigana = 'furigana',
  Select = 'furigana-select',
  Color = 'furigana-color',
  Display = 'furigana-display',
  Fontsize = 'furigana-fontsize',
  Engine = 'furigana-engine'
}
export type Default = {
  furigana: Furigana
  color: Color
  select: Select
  display: Display
  fontsize: Fontsize
  engine: Engine
}

export const defaultValue: Default = {
  furigana: 'hiragana',
  color: 'currentColor',
  select: 'original',
  display: 'on',
  fontsize: 75,
  engine: 'local'
}

export type Furigana = 'hiragana' | 'katakana' | 'romaji'
export type Display = 'on' | 'off'
export type Select = 'original' | 'furigana' | 'all'
export type Engine = 'local' | 'network'
export type Color = string
export type Fontsize = number

export const getAllTextNodes = (node: Node): Node[] => {
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
export const addFurigana = async (nodes: Node[]) => {
  nodes = [...new Set<Node>(nodes)]
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

export const tokenize = async (text: string): Promise<KurokanjiToken[]> => {
  const response = await sendToBackground<
    { text: string },
    { message: KuromojiToken[] }
  >({ name: 'fetchKuromoji', body: { text } })
  return toKurokanjiToken(response.message)
}

export const createRuby = async (
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

export const customAddFurigana = async (selector: string) => {
  const nodes = Array.from(document.querySelectorAll(selector)).flatMap(
    (element) => {
      element.classList.add(Class.Furigana)
      return getAllTextNodes(element)
    }
  )
  addFurigana(nodes)
}
