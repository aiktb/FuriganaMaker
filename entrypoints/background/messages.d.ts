import type { KanjiMark } from "@/entrypoints/background/listeners/onGetKanjiMarksMessage";
import type { ProtocolWithReturn } from "webext-bridge";

declare module "webext-bridge" {
  export interface ProtocolMap {
    getSelector: ProtocolWithReturn<{ domain: string }, { selector: string }>;
    getKanjiMarks: ProtocolWithReturn<{ text: string }, { tokens: KanjiMark[] }>;
  }
}
