import '~/assets/style.css';

import { Suspense } from 'react';

import { Storage } from '@plasmohq/storage';

import { ExtensionStorage, type SelectorRule } from '~contents/core';

import Footer from './components/Footer';
import Header from './components/Header';
import Main from './components/Main';

export default function Options() {
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  async function initializeRules() {
    const storage = new Storage({ area: 'local' });
    const rules: SelectorRule[] = await storage.get(ExtensionStorage.SelectorRules);
    return rules;
  }
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <p className="mx-auto mb-2 max-w-full whitespace-normal text-balance border-b border-gray-200 p-4 text-center text-base font-bold dark:border-slate-800">
        Feel free to share your custom rules in the{' '}
        <a
          href="https://github.com/aiktb/FuriganaMaker/discussions"
          className="text-sky-500 underline transition hover:text-sky-700"
          target="_blank"
          rel="noreferrer noopener"
        >
          Github Discussions
        </a>
        !
      </p>
      <Suspense fallback={<div className="min-h-screen" />}>
        <Main rulesPromise={initializeRules()} />
      </Suspense>
      <Footer />
    </div>
  );
}
