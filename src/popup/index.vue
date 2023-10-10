<script setup lang="ts">
import MainMenu from './MainMenu.vue'

import './tailwind.css'
</script>

<!-- All because <Menu /> needs to load chrome.storage asynchronously. -->
<template>
  <div
    class="bg-slate-200 p-2 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
  >
    <Suspense>
      <template #default>
        <MainMenu />
      </template>
    </Suspense>
  </div>
</template>
