import type { MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Welcome to Furigana Maker!',
    },
  ];
};
