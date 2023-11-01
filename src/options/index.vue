<script setup lang="ts">
import '../popup/tailwind.css'

import ItemMessage from './components/ItemMessage.vue'
import JsonEditor from './components/JsonEditor.vue'
import UserGuide from './components/UserGuide.vue'
</script>

<template>
  <div
    class="w-full bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
  >
    <div class="mx-auto min-h-screen w-full max-w-3xl p-2 text-lg">
      <UserGuide />
      <main>
        <Suspense>
          <JsonEditor />
        </Suspense>
      </main>
      <ItemMessage />
    </div>
  </div>
</template>
