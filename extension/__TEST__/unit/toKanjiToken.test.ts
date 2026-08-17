import { describe, expect, test } from "vitest";
import { type KanjiToken, toKanjiToken } from "@/commons/toKanjiToken";
import type { FormattedToken } from "@/commons/tokenize";

const encoder = new TextEncoder();

/**
 * Build the `FormattedToken[]` that lindera would produce for a sentence, plus the
 * sentence itself. Byte offsets are derived from the surfaces so that the fixtures
 * stay readable and cannot drift out of sync with the text.
 */
const linderaOutput = (...pairs: [surface: string, reading: string][]) => {
  let byteStart = 0;
  const tokens = pairs.map<FormattedToken>(([surface, reading]) => {
    const byteEnd = byteStart + encoder.encode(surface).length;
    const token = { surface, reading, byteStart, byteEnd };
    byteStart = byteEnd;
    return token;
  });
  const text = pairs.map(([surface]) => surface).join("");
  return { tokens, text };
};

const run = (...pairs: [surface: string, reading: string][]): KanjiToken[] => {
  const { tokens, text } = linderaOutput(...pairs);
  return toKanjiToken(tokens, text);
};

/** Assert the slice the token points at really is the text it claims to annotate. */
const expectOffsetsToMatchOriginal = (
  results: KanjiToken[],
  ...pairs: [surface: string, reading: string][]
) => {
  const text = pairs.map(([surface]) => surface).join("");
  for (const result of results) {
    expect(text.slice(result.start, result.end)).toBe(result.original);
  }
};

describe("toKanjiToken", () => {
  describe("filtering", () => {
    test("drops tokens without a reading", () => {
      expect(run(["漢字", "*"])).toEqual([]);
    });

    test("drops tokens with an empty reading", () => {
      expect(run(["漢字", ""])).toEqual([]);
    });

    test("drops tokens that contain no kanji", () => {
      expect(run(["テスト", "テスト"], ["ひらがな", "ヒラガナ"])).toEqual([]);
    });

    test("keeps latin text out of the result", () => {
      expect(run(["This is English.", "*"])).toEqual([]);
    });
  });

  describe("tokens that are annotated as a whole", () => {
    test("a pure kanji word is not disassembled", () => {
      expect(run(["漢字", "カンジ"])).toEqual([
        { original: "漢字", reading: "カンジ", start: 0, end: 2 },
      ]);
    });

    test("an iteration mark keeps the word intact", () => {
      // 々 is neither kanji nor kana, so no kana anchor can be found and the word
      // has to stay in one piece.
      expect(run(["我々", "ワレワレ"])).toEqual([
        { original: "我々", reading: "ワレワレ", start: 0, end: 2 },
      ]);
    });

    test("a kana infix absent from the reading keeps the word intact", () => {
      // 関ケ原 reads セキガハラ: the ケ is silent, so it cannot anchor a split.
      expect(run(["関ケ原", "セキガハラ"])).toEqual([
        { original: "関ケ原", reading: "セキガハラ", start: 0, end: 3 },
      ]);
    });

    test("a reading yielding fewer groups than kanji runs is left untouched", () => {
      // Only kana can anchor a split, so the digit between 第 and 章 produces two
      // kanji runs but a single capture group. Splitting on a group count that does
      // not line up would hand the second kanji an undefined reading.
      expect(run(["第2章は", "ダイニショウハ"])).toEqual([
        { original: "第2章は", reading: "ダイニショウハ", start: 0, end: 4 },
      ]);
    });

    test("a reading that does not correspond to the text is left untouched", () => {
      // The reading has to end in ベル for 食べる to be splittable. When it does not,
      // returning the whole token is the only safe answer.
      expect(run(["食べる", "タベマス"])).toEqual([
        { original: "食べる", reading: "タベマス", start: 0, end: 3 },
      ]);
    });
  });

  describe("tokens that are split on their kana", () => {
    test("splits a trailing okurigana", () => {
      expect(run(["変わる", "カワル"])).toEqual([
        { original: "変", reading: "カ", start: 0, end: 1 },
      ]);
    });

    test("splits an infix okurigana into two readings", () => {
      expect(run(["作り方", "ツクリカタ"])).toEqual([
        { original: "作", reading: "ツク", start: 0, end: 1 },
        { original: "方", reading: "カタ", start: 2, end: 3 },
      ]);
    });

    test("splits a leading okurigana", () => {
      expect(run(["お守り", "オマモリ"])).toEqual([
        { original: "守", reading: "マモ", start: 1, end: 2 },
      ]);
    });

    test("treats the prolonged sound mark as kana", () => {
      // Neither \p{sc=Hira} nor \p{sc=Kana} contains ー, so it is matched explicitly.
      expect(run(["ローマ字", "ローマジ"])).toEqual([
        { original: "字", reading: "ジ", start: 3, end: 4 },
      ]);
    });
  });

  describe("offsets", () => {
    test("are UTF-16 indices, not byte indices", () => {
      // Every kanji is 3 bytes in UTF-8 but 1 UTF-16 code unit.
      const pairs: [string, string][] = [
        ["僕", "ボク"],
        ["は", "ハ"],
        ["耳", "ミミ"],
        ["と", "ト"],
        ["目", "メ"],
      ];
      const results = run(...pairs);
      expect(results).toEqual([
        { original: "僕", reading: "ボク", start: 0, end: 1 },
        { original: "耳", reading: "ミミ", start: 2, end: 3 },
        { original: "目", reading: "メ", start: 4, end: 5 },
      ]);
      expectOffsetsToMatchOriginal(results, ...pairs);
    });

    test("account for surrogate pairs", () => {
      // An emoji is 4 bytes in UTF-8 but 2 UTF-16 code units, so a byte offset
      // converted naively would point one character short.
      const pairs: [string, string][] = [
        ["😊", "*"],
        ["漢字", "カンジ"],
        ["テスト", "テスト"],
      ];
      const results = run(...pairs);
      expect(results).toEqual([{ original: "漢字", reading: "カンジ", start: 2, end: 4 }]);
      expectOffsetsToMatchOriginal(results, ...pairs);
    });

    test("stay correct for split tokens in the middle of a sentence", () => {
      const pairs: [string, string][] = [
        ["ことで", "コトデ"],
        ["変わる", "カワル"],
        ["の", "ノ"],
        ["作り方", "ツクリカタ"],
      ];
      const results = run(...pairs);
      expect(results).toEqual([
        { original: "変", reading: "カ", start: 3, end: 4 },
        { original: "作", reading: "ツク", start: 7, end: 8 },
        { original: "方", reading: "カタ", start: 9, end: 10 },
      ]);
      expectOffsetsToMatchOriginal(results, ...pairs);
    });
  });

  test("annotates a whole sentence", () => {
    const pairs: [string, string][] = [
      ["我々", "ワレワレ"],
      ["は", "ハ"],
      ["その", "ソノ"],
      ["月", "ツキ"],
      ["の", "ノ"],
      ["一", "イチ"],
      ["日", "ニチ"],
      ["に", "ニ"],
      ["不動産", "フドウサン"],
      ["の", "ノ"],
      ["所有", "ショユウ"],
      ["者", "シャ"],
      ["が", "ガ"],
      ["変わる", "カワル"],
    ];
    const results = run(...pairs);
    expect(results).toEqual([
      { original: "我々", reading: "ワレワレ", start: 0, end: 2 },
      { original: "月", reading: "ツキ", start: 5, end: 6 },
      { original: "一", reading: "イチ", start: 7, end: 8 },
      { original: "日", reading: "ニチ", start: 8, end: 9 },
      { original: "不動産", reading: "フドウサン", start: 10, end: 13 },
      { original: "所有", reading: "ショユウ", start: 14, end: 16 },
      { original: "者", reading: "シャ", start: 16, end: 17 },
      { original: "変", reading: "カ", start: 18, end: 19 },
    ]);
    expectOffsetsToMatchOriginal(results, ...pairs);
  });
});
