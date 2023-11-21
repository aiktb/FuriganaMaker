<script setup lang="ts">
import { Icon } from '@iconify/vue'

const generateYear = () => {
  const year = new Date().getFullYear()
  return year === 2023 ? year : `2023-${year}`
}
</script>

<template>
  <footer>
    <div
      class="mx-auto flex max-w-3xl items-center justify-between border-t border-gray-200 px-4 dark:border-slate-800 sm:px-6 lg:max-w-7xl lg:px-8"
    >
      <div class="py-8 text-center text-sm sm:text-left">
        <span class="block sm:inline"
          >Copyright &copy; {{ generateYear() }}
          <a
            class="text-sky-500 transition hover:text-sky-700"
            href="https://github.com/aiktb"
            target="_blank"
            >aiktb</a
          >.
        </span>
        <span class="block sm:inline">All rights reserved.</span>
      </div>
      <a
        class="transition hover:text-gray-400"
        href="https://github.com/aiktb/FuriganaMaker"
        target="_blank"
      >
        <span class="sr-only">GitHub repository</span>
        <Icon class="h-6 w-6" icon="mdi:github" />
      </a>
    </div>
  </footer>
</template>
