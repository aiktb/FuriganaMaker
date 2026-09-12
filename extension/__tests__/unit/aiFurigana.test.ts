import { describe, expect, it } from "vitest";
import { getAiKanjiTokens, parseAiTokens } from "@/core/aiFurigana";

const response = (...pairs: [surface: string, reading: string][]) =>
  JSON.stringify(pairs.map(([surface, reading]) => ({ surface, reading })));

describe("AI token adapter", () => {
  it("derives Lindera-compatible byte offsets for emoji, whitespace and okurigana", () => {
    const output = response(["😊\n ", "*"], ["食べる", "タベル"], ["。", "*"]);
    expect(parseAiTokens(output, "😊\n 食べる。")).toEqual([
      { surface: "😊\n ", reading: "*", byteStart: 0, byteEnd: 6 },
      { surface: "食べる", reading: "タベル", byteStart: 6, byteEnd: 15 },
      { surface: "。", reading: "*", byteStart: 15, byteEnd: 18 },
    ]);
    expect(getAiKanjiTokens(output, "😊\n 食べる。")).toEqual([
      { original: "食", reading: "タ", start: 4, end: 5 },
    ]);
  });

  it("reuses kana splitting and leaves kana, digits and punctuation without ruby", () => {
    const output = response(
      ["😊", "*"],
      ["お守り", "オマモリ"],
      ["の", "ノ"],
      ["作り方", "ツクリカタ"],
      ["です", "デス"],
      ["。", "*"],
      ["10", "ジュッ"],
      ["頭身", "トウシン"],
      ["テスト", "テスト"],
    );
    expect(getAiKanjiTokens(output, "😊お守りの作り方です。10頭身テスト")).toEqual([
      { original: "守", reading: "マモ", start: 3, end: 4 },
      { original: "作", reading: "ツク", start: 6, end: 7 },
      { original: "方", reading: "カタ", start: 8, end: 9 },
      { original: "頭身", reading: "トウシン", start: 14, end: 16 },
    ]);
  });

  it.each([
    ["食べる", "タベマス"],
    ["学生です。", "ガクセイデス"],
    ["😊学生", "ガクセイ"],
    ["10頭身", "ジュットウシン"],
  ])("never renders unsplittable mixed AI tokens as a whole: %s", (surface, reading) => {
    expect(getAiKanjiTokens(response([surface, reading]), surface)).toEqual([]);
  });

  it("preserves kanji compounds and iteration marks", () => {
    expect(
      getAiKanjiTokens(response(["我々", "ワレワレ"], ["学生", "ガクセイ"]), "我々学生"),
    ).toEqual([
      { original: "我々", reading: "ワレワレ", start: 0, end: 2 },
      { original: "学生", reading: "ガクセイ", start: 2, end: 4 },
    ]);
  });

  it.each([
    '[{"surface":"十頭身","reading":"ジュットウシン"}]',
    '[{"surface":"10頭身","reading":"jittoushin"}]',
    '[{"surface":"10頭身","reading":"じっとうしん"}]',
    '[{"surface":"10頭身"}]',
    '[{"surface":"","reading":"*"}]',
    '[{"text":"10頭身","reading":"ジュットウシン"}]',
    '```json\n[{"surface":"10頭身","reading":"ジュットウシン"}]\n```',
    "[]",
  ])("rejects changed text and malformed model output: %s", (output) => {
    expect(() => parseAiTokens(output, "10頭身")).toThrow();
  });
});
