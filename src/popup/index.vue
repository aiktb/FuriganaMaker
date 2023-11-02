<script setup lang="ts">
import MainMenu from './MainMenu.vue'

import './tailwind.css'
</script>

<!-- All because <MainMenu /> needs to load chrome.storage asynchronously. -->
<template>
  <div
    class="select-none whitespace-nowrap bg-white p-2 font-mono text-sm font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200"
  >
    <Suspense>
      <template #default>
        <MainMenu />
      </template>
    </Suspense>
  </div>
</template>
