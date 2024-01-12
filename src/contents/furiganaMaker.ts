import type { PlasmoCSConfig } from 'plasmo';
import { toHiragana, toKatakana, toRomaji } from 'wanakana';

import { sendToBackground } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';

import kanjiList from '../../assets/rules/kanji.json';
import { ExtensionStorage, FURIGANA_CLASS, FuriganaType } from './core';
import { toKanjiToken, type KanjiToken, type MojiToken } from './kanjiTokenizer';

export const config: PlasmoCSConfig = {
  matches: ['https://*/*'],
};

/**
 * Append ruby tag to all text nodes of a batch of elements.
 * @remarks
 * The parent element of the text node will be added with the FURIGANA_CLASS.
 * Elements that have already been marked will be skipped.
 * Ruby tag is "\<ruby>original\<rp>(\</rp>\<rt>reading\</rt>\<rp>)\</rp>\</ruby>".
 **/
export async function addFurigana(...elements: Element[]) {
  const japaneseTexts = [...elements.flatMap(collectTexts)];

  const storage = new Storage({ area: 'local' });
  const furiganaType: FuriganaType = await storage.get(ExtensionStorage.FuriganaType);

  for (const text of japaneseTexts) {
    const tokens: KanjiToken[] = await tokenize(text.textContent!);
    // reverse() prevents the range from being invalidated
    for (const token of tokens.reverse()) {
      const ruby = createRuby(token.original, token.reading, furiganaType);
      const range = document.createRange();
      range.setStart(text, token.start);
      range.setEnd(text, token.end);
      range.deleteContents();
      range.insertNode(ruby);
    }
  }
}

const collectTexts = (element: Element): Text[] => {
  element.normalize();
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement! as Element;
    if (parent.tagName !== 'RUBY' && parent.tagName !== 'RT') {
      texts.push(node as Text);
    }
  }
  return texts;
};

const tokenize = async (text: string): Promise<KanjiToken[]> => {
  const response = await sendToBackground<{ text: string }, { message: MojiToken[] }>({
    name: 'getMojiTokens',
    body: { text },
  });
  return toKanjiToken(response.message);
};

const createRuby = (original: string, reading: string, furiganaType: FuriganaType): HTMLElement => {
  const ruby = document.createElement('ruby');
  ruby.classList.add(FURIGANA_CLASS);
  if (isN5Kanji(original, reading)) {
    ruby.classList.add('n5');
  }
  const rightParenthesisRp = document.createElement('rp');
  rightParenthesisRp.textContent = ')';
  const leftParenthesisRp = document.createElement('rp');
  leftParenthesisRp.textContent = '(';
  const originalText = document.createTextNode(original);

  switch (furiganaType) {
    case FuriganaType.Hiragana:
      reading = toHiragana(reading);
      break;
    case FuriganaType.Romaji:
      reading = toRomaji(reading);
      break;
    case FuriganaType.Katakana:
      // token.reading default is katakana
      break;
  }
  const readingTextNode = document.createTextNode(reading);
  const rt = document.createElement('rt');
  rt.appendChild(readingTextNode);
  ruby.appendChild(originalText);
  ruby.appendChild(leftParenthesisRp);
  ruby.appendChild(rt);
  ruby.appendChild(rightParenthesisRp);
  return ruby;
};

// TODO: Performance optimization
const isN5Kanji = (kanji: string, reading: string): boolean => {
  const n5KanjiMap = new Map<string, string[]>(
    kanjiList.map((n5Kanji) => [n5Kanji.kanji, n5Kanji.reading]),
  );
  const isN5Kanji = n5KanjiMap.has(kanji) && n5KanjiMap.get(kanji)!.includes(toKatakana(reading));
  return isN5Kanji;
};
