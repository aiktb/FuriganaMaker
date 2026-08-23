import { head, last } from "es-toolkit";
import { isKanji, toKatakana } from "wanakana";

import type { FormattedToken } from "./tokenize";

// It's not just kanji, such as "市ヶ谷" (イチガヤ), "我々" (ワレワレ).
export interface KanjiToken {
  original: string;
  reading: string;
  start: number;
  end: number;
}
/**
 * Extract useful kanji phonetic information from lindera tokens.
 * @example
 * ```
 * Input: tokenize('「我々」と「関ケ原」')
 * Output:
 * [
 *  { original: '我々', reading: 'ワレワレ', start: 1, end: 3 },
 *  { original: '関ケ原', reading: 'セキガハラ', start: 6, end: 9 }
 * ]
 * ```
 */
export const toKanjiToken = (linderaTokens: FormattedToken[], text: string): KanjiToken[] => {
  const toUtf16Index = buildUtf16IndexLookup(text);
  const filteredTokens = linderaTokens
    .filter(isPhonetic)
    .map((token) => toSimplifiedToken(token, toUtf16Index))
    .flatMap(toRubyText);
  return filteredTokens;
};

const isPhonetic = (linderaToken: FormattedToken) => {
  const hasKanji = /\p{sc=Han}/v.test(linderaToken.surface);
  const hasReading = Boolean(linderaToken.reading && linderaToken.reading !== "*");
  return hasReading && hasKanji;
};

interface SimplifiedToken {
  original: string;
  reading: string; // Katakana, as lindera reports it. Converted downstream, not here.
  start: number; // Indexes start from 0
  end: number;
}

const toSimplifiedToken = (
  linderaToken: FormattedToken,
  toUtf16Index: (byteIndex: number) => number,
): SimplifiedToken => {
  return {
    start: toUtf16Index(linderaToken.byteStart),
    end: toUtf16Index(linderaToken.byteEnd),
    original: linderaToken.surface,
    reading: linderaToken.reading,
  };
};

/** UTF-8 byte length of a code point, without allocating a buffer per character. */
const utf8Length = (codePoint: number) => {
  if (codePoint < 0x80) {
    return 1;
  }
  if (codePoint < 0x800) {
    return 2;
  }
  if (codePoint < 0x10000) {
    return 3;
  }
  return 4;
};

/**
 * lindera reports byte offsets, but `Range` addresses a text node by UTF-16 offset.
 * Resolving one offset means walking the text from the start, and every token needs
 * two, so doing it per token is quadratic in the length of the text. Walk the text
 * once up front instead and answer every lookup from the table.
 */
const buildUtf16IndexLookup = (text: string) => {
  const utf16IndexByByte: number[] = [];
  let utf16Index = 0;
  for (const ch of text) {
    // Every byte of a character resolves to the index of the character it belongs to.
    for (let byte = utf8Length(ch.codePointAt(0)!); byte > 0; byte--) {
      utf16IndexByByte.push(utf16Index);
    }
    utf16Index += ch.length; // Note: emoji length is 2 in UTF-16
  }
  // A byte index at or past the end of the text resolves to the end of the text,
  // which is also what lindera reports as the `byteEnd` of a trailing token.
  const endIndex = utf16Index;
  return (byteIndex: number) => utf16IndexByByte[byteIndex] ?? endIndex;
};

const toRubyText = (token: SimplifiedToken): KanjiToken | KanjiToken[] => {
  // The pure Kanji words do not need to be disassembled.
  if (isKanji(token.original)) {
    return {
      original: token.original,
      reading: token.reading,
      start: token.start,
      end: token.end,
    };
  }
  const smashed = smashToken(token);
  return smashed;
};

interface MarkToken {
  original: string;
  start: number;
  end: number;
}

type MarkTokenArray = MarkToken[] & { hybridLength: number };

// Must be a mixture of Kanji and Kana to use this function.
const smashToken = (token: SimplifiedToken): KanjiToken[] => {
  const { original, reading, start } = token;
  // Both \p{sc=Hira} and \p{sc=Kana} don’t contain 'ー々', which is bad.
  const kanaRegex = /(\p{sc=Hira}|\p{sc=Kana}|ー)+/dgv;
  const kanaMatches = [...original.matchAll(kanaRegex)];
  const kanaTokens = kanaMatches.map((match) => {
    const [unknownOriginal] = match;
    const [start, end] = head(match.indices!)!;
    return {
      original: toKatakana(unknownOriginal),
      start,
      end,
    };
  });
  const kanas: MarkTokenArray = Object.assign([], kanaTokens, {
    hybridLength: original.length,
  }) satisfies MarkTokenArray;

  const hybridRegex = buildRegex(kanas);
  // The first matching group is the entire string.
  // All that's needed is the sub-capturing group.
  const hybridMatch = reading.match(hybridRegex)?.slice(1);
  const kanjisRegex = /\p{sc=Han}+/dgv;
  const originalKanjiMatches = Array.from(original.matchAll(kanjisRegex));

  // If the number of matching groups is not equal to the number of Kanji,
  // it means that the phonetic notation does not correspond to the text.
  if (!hybridMatch || hybridMatch.length !== originalKanjiMatches.length) {
    return [token];
  }

  const kanjis = originalKanjiMatches.map((match, index) => {
    const [original] = match;
    const [startOffset, endOffset] = head(match.indices!)!;
    return {
      original,
      start: start + startOffset,
      end: start + endOffset,
      reading: hybridMatch[index]!,
    } satisfies KanjiToken;
  });

  return kanjis;
};

// Cases where phonetic notation does not correspond to text create an invalid regular expression.
const buildRegex = (kanas: MarkTokenArray): RegExp => {
  // Match empty string, actual sub-capturing group is 0.
  if (!kanas.length) {
    return /^$/v;
  }
  // "作り方" => "^(.+)リ(.+)$", "り方" => "^リ(.+)$", "作り" => "^(.+)リ$".
  const firstKana = head(kanas)!;
  const lastKana = last(kanas)!;
  let regexStr = "^";
  const placeholder = "(.+)";
  if (firstKana.start) {
    regexStr += placeholder;
  }
  for (const kana of kanas) {
    regexStr += kana.original;
    if (kana !== lastKana) {
      regexStr += placeholder;
    }
  }
  if (lastKana.end !== kanas.hybridLength) {
    regexStr += placeholder;
  }
  regexStr += "$";
  const regex = new RegExp(regexStr, "v");
  return regex;
};
