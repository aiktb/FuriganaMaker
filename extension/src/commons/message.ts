import { defineExtensionMessaging } from "@webext-core/messaging";

export type { ExtensionMessage } from "@webext-core/messaging";

import type { FuriganaType } from "@/commons/constants";
import type { KanjiMark } from "@/entrypoints/background/listeners/onGetKanjiMarksMessage";

interface ProtocolMap {
  addFurigana(): void;
  canAddFurigana(): boolean;
  getKanjiMarks(data: { text: string; furiganaType: FuriganaType }): { tokens: KanjiMark[] };
  getSelector(data: { domain: string }): { selector: string };
  markActiveTab(): void;
  markDisabledTab(): void;
  modifyKanjiFilter(): void;
  openOptionsPage(): void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>({
  breakError: true,
});
