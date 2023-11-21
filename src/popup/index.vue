<script setup lang="ts">
import MainMenu from './MainMenu.vue'

import './style.css'

if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
</script>

<!-- All because <MainMenu /> needs to load chrome.storage asynchronously. -->
<template>
  <div
    class="select-none whitespace-nowrap bg-white p-2 font-mono text-sm font-bold text-slate-800 dark:bg-slate-900 dark:text-slate-200"
  >
    <Suspense>
      <MainMenu />
    </Suspense>
  </div>
</template>
