<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <footer
    class="my-4 flex justify-between rounded-md border-slate-900 bg-slate-300 p-4 outline outline-2 outline-slate-600 dark:bg-slate-900"
  >
    <p>
      Made by
      <a
        href="https://plasmo.com"
        class="text text-sky-600 underline transition-all hover:text-sky-700 dark:text-blue-600"
        target="_blank"
      >
        Plasmo</a
      >, developed by
      <a
        href="https://aiktb.com"
        class="text text-sky-600 underline transition-all hover:text-sky-700 dark:text-blue-600"
        target="_blank"
      >
        aiktb</a
      >.
    </p>
    <a href="https://github.com/aiktb/FuriganaMaker" title="Open in Github">
      <Icon class="h-6 w-6 transition-all hover:text-sky-600" icon="akar-icons:github-fill" />
    </a>
  </footer>
</template>
