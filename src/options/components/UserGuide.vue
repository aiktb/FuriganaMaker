<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <header
    class="mb-4 rounded-md p-4 outline outline-2 outline-slate-600 dark:bg-slate-900"
  >
    <h1 class="my-2 flex items-center text-2xl font-bold text-sky-400">
      User Guide
      <Icon class="ml-2 inline-block h-6 w-6" icon="carbon:information" />
    </h1>
    <p class="py-1">
      Editing User Rule requires mastering basic
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors"
        target="_blank"
        class="text text-sky-400 underline transition-all hover:text-sky-600"
      >
        CSS selector</a
      >
      syntax, which may render the extension invalid, so please operate with
      caution.
    </p>
    <p class="py-1">
      Turn on the flag
      <code class="rounded bg-slate-800 px-1 text-sky-400">dynamic</code>
      and Furigana Maker will track newly loaded content in the page, which is
      necessary for dynamically loaded websites such as Twitter.
    </p>
    <p class="py-1">
      Set
      <code class="rounded bg-slate-800 px-1 text-sky-400">enable="false"</code>
      to disable the corresponding rule.
    </p>
    <p class="py-1">
      In textarea you can use
      <kbd class="rounded bg-slate-800 px-1 text-sky-400">ctrl + s</kbd>
      to save the settings.
    </p>
  </header>
</template>
