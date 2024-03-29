import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Furigana Maker - Add furigana to Japanese text on any page',
    },
    {
      name: 'description',
      content:
        'A browser extension that adds furigana to Japanese text on any page, for learning kanji pronunciation.',
    },
    {
      name: 'keywords',
      content:
        'furigana, onyomi, kunyomi, kanji, japanese, reading, pronunciation, browser, extension, ',
    },
  ];
};

export default function Index() {
  return <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}></div>;
}
