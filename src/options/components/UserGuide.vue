<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <header
    class="mb-4 rounded-md bg-slate-300 p-4 outline outline-2 outline-slate-600 dark:bg-slate-900"
  >
    <h1 class="my-2 flex items-center text-2xl font-bold text-sky-600 dark:text-sky-400">
      User Guide
      <Icon class="ml-2 inline-block h-7 w-7" icon="mingcute:information-line" />
    </h1>
    <p class="py-1">
      Editing User Rule requires mastering basic
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors"
        target="_blank"
        class="text text-sky-600 underline transition-all hover:text-sky-700 dark:text-sky-400"
      >
        CSS selector</a
      >
      syntax, which may render the extension invalid, so please operate with caution.
    </p>
    <p class="py-1">
      Turn on the flag
      <code class="gray-200 rounded px-1 text-sky-600 dark:bg-slate-800 dark:text-sky-400"
        >dynamic</code
      >
      and Furigana Maker will track newly loaded content in the page, which is necessary for
      dynamically loaded websites such as Twitter.
    </p>
    <p class="py-1">
      Set
      <code class="gray-200 rounded px-1 text-sky-600 dark:bg-slate-800 dark:text-sky-400"
        >enable="false"</code
      >
      to disable the corresponding rule.
    </p>
    <p class="py-1">
      In textarea you can use
      <kbd class="gray-200 rounded px-1 text-sky-600 dark:bg-slate-800 dark:text-sky-400"
        >ctrl + s</kbd
      >
      to save the settings.
    </p>
  </header>
</template>
