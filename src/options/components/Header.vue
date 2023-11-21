<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, type Ref } from 'vue'

if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

const theme: Ref<'light' | 'dark'> = ref(localStorage.theme ?? 'light')

const toggleTheme = () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark')
    localStorage.theme = 'light'
    theme.value = 'light'
  } else {
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
    theme.value = 'dark'
  }
}
</script>

<template>
  <header class="sticky top-0 z-30 h-[72px] backdrop-blur backdrop-filter">
    <div class="max-w-8xl mx-auto xl:px-8">
      <div
        class="mx-auto flex max-w-3xl items-center justify-between border-b border-gray-200 px-4 py-5 dark:border-slate-800 sm:px-6 lg:max-w-7xl lg:px-8"
      >
        <div class="flex items-center text-base">
          <Icon
            class="mr-1 h-6 w-6 text-sky-500"
            aria-hidden="true"
            icon="material-symbols:rule-rounded"
          />
          <span class="font-bold text-black dark:text-white">User Rules Editor</span>
        </div>
        <div class="flex gap-x-6">
          <button @click="toggleTheme">
            <span class="sr-only">Toggle Theme Mode</span>
            <Icon
              v-if="theme === 'light'"
              class="h-6 w-6 text-sky-500"
              aria-hidden="true"
              icon="tabler:sun"
            />
            <Icon v-else class="h-6 w-6 text-sky-500" aria-hidden="true" icon="tabler:moon-stars" />
          </button>
          <a class="transition hover:text-gray-400" href="https://github.com/aiktb/FuriganaMaker">
            <span class="sr-only">GitHub repository</span>
            <Icon class="h-6 w-6" icon="mdi:github" />
          </a>
        </div>
      </div>
    </div>
  </header>
</template>
