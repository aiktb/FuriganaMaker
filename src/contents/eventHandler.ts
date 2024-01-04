import type { PlasmoCSConfig } from 'plasmo';
import { toHiragana, toKatakana, toRomaji } from 'wanakana';
import Browser from 'webextension-polyfill';

import { Storage } from '@plasmohq/storage';

import {
  ExtensionEvent,
  ExtensionStorage,
  FURIGANA_CLASS,
  FuriganaType,
  SelectMode,
  type StyleEvent,
} from './core';
import { Selector } from './customSelector';

export const config: PlasmoCSConfig = {
  matches: ['https://*/*'],
};

// styleHandler uses storage and is called immediately,
// so it needs to be initialized immediately.
initialize();
async function initialize() {
  const styleEvents: StyleEvent[] = [
    ExtensionEvent.ToggleDisplay,
    ExtensionEvent.ToggleHoverMode,
    ExtensionEvent.SwitchSelectMode,
    ExtensionEvent.AdjustFontSize,
    ExtensionEvent.AdjustFontColor,
  ];
  await Promise.all(styleEvents.map((item) => styleHandler(item)));
}

// The plasmo Storage watch API could be used instead, but is not necessary.
Browser.runtime.onMessage.addListener((event: ExtensionEvent) => {
  switch (event) {
    case ExtensionEvent.SwitchFuriganaType:
      switchFuriganaHandler();
      break;
    case ExtensionEvent.AddFurigana:
      addFuriganaHandler();
      break;
    default:
      styleHandler(event);
      break;
  }
});

async function switchFuriganaHandler() {
  const rtSelector = `ruby.${FURIGANA_CLASS} > rt`;
  const nodes = document.querySelectorAll(rtSelector);
  const storage = new Storage({ area: 'local' });
  const value: FuriganaType = await storage.get(ExtensionStorage.FuriganaType);
  switch (value) {
    case FuriganaType.Hiragana:
      nodes.forEach((node) => {
        node.textContent = toHiragana(node.textContent!);
      });
      break;
    case FuriganaType.Katakana:
      nodes.forEach((node) => {
        node.textContent = toKatakana(node.textContent!);
      });
      break;
    case FuriganaType.Romaji:
      nodes.forEach((node) => {
        node.textContent = toRomaji(node.textContent!);
      });
      break;
  }
}

function addFuriganaHandler() {
  const selector = Selector.create();
  const selectHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      selector.close();
      document.removeEventListener('keydown', selectHandler);
    }
  };
  selector.open();
  document.addEventListener('keydown', selectHandler);
}

async function styleHandler(type: StyleEvent) {
  const rtSelector = `ruby.${FURIGANA_CLASS} > rt`;
  const rtHoverSelector = `ruby.${FURIGANA_CLASS}:hover > rt`;
  const storage = new Storage({ area: 'local' });

  let value: string | number | boolean;
  let css: string;
  switch (type) {
    case ExtensionEvent.ToggleDisplay:
      value = await storage.get(ExtensionStorage.Display);
      css = `
        ${rtSelector} {
          display: ${value ? 'revert' : 'none'};
        }
      `;
      break;
    case ExtensionEvent.ToggleHoverMode:
      value = await storage.get(ExtensionStorage.HoverMode);
      css = `
        ${rtSelector} {
          opacity: ${value ? 0 : 1};
        }

        ${rtHoverSelector} {
          opacity: 1;
        }
      `;
      break;
    case ExtensionEvent.SwitchSelectMode:
      value = await storage.get(ExtensionStorage.SelectMode);
      css = `
        ${rtSelector} {
          user-select: ${value === SelectMode.Original ? 'none' : 'text'};
        }
      `;
      break;
    case ExtensionEvent.AdjustFontSize:
      value = await storage.get(ExtensionStorage.FontSize);
      css = `
        ${rtSelector} {
          font-size: ${value}%;
        }
      `;
      break;
    case ExtensionEvent.AdjustFontColor:
      value = await storage.get(ExtensionStorage.FontColor);
      css = `
        ${rtSelector} {
          color: ${value};
        }
      `;
      break;
  }
  const id = `${FURIGANA_CLASS}${type}`;
  const oldStyle = document.getElementById(id);
  if (oldStyle) {
    oldStyle.textContent = css;
  } else {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('id', id);
    style.textContent = css;
    document.head.appendChild(style);
  }
}
