<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { Rule } from '~contents/core'

const props = defineProps<{
  rule: Rule
}>()

const emit = defineEmits(['delete', 'update'])
</script>

<template>
  <li class="flex flex-col justify-between gap-x-6 py-5 sm:flex-row">
    <div class="flex min-w-0 gap-x-4">
      <Icon
        class="h-12 w-12 flex-none text-sky-500"
        aria-hidden="true"
        icon="solar:layers-minimalistic-outline"
      />
      <div class="flex-auto">
        <a
          class="truncate text-sm font-semibold leading-6 text-sky-500 transition hover:text-sky-700"
          :href="`https://${props.rule.domain}`"
        >
          {{ props.rule.domain }}
        </a>
        <p class="leading-5sm:w-96 mt-1 w-72 truncate text-xs md:w-[30rem] lg:w-[36rem]">
          {{ props.rule.selector }}
        </p>
      </div>
    </div>
    <div class="flex shrink-0 flex-col items-end">
      <div
        class="flex w-full items-center justify-between gap-x-1.5 sm:flex-col sm:items-end sm:justify-evenly"
      >
        <div class="mr-1 flex items-center gap-x-1.5">
          <p class="text-sm leading-5">{{ props.rule.enabled ? 'Active' : 'Inactive' }}</p>
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              :class="props.rule.enabled ? 'bg-sky-400' : 'bg-gray-400'"
            />
            <span
              class="relative inline-flex h-2 w-2 rounded-full"
              :class="$props.rule.enabled ? 'bg-sky-500' : 'bg-gray-500'"
            />
          </span>
        </div>
        <div class="mt-1 flex gap-x-1.5">
          <button
            class="flex items-center gap-x-1 rounded-md border border-gray-200 px-1 py-0.5 text-sm font-bold text-sky-500 shadow transition-[background-color] hover:bg-transparent/10 dark:border-slate-800 dark:hover:bg-transparent/80"
          >
            <Icon class="h-4 w-4" aria-hidden="true" icon="tabler:edit" />
            Edit
          </button>
          <button
            class="flex items-center gap-x-1 rounded-md border border-gray-200 px-1 py-0.5 text-sm font-bold text-red-600 shadow transition-[background-color] hover:bg-transparent/10 dark:border-slate-800 dark:text-red-500 dark:hover:bg-transparent/80"
            @click="emit('delete')"
          >
            <Icon class="h-4 w-4" aria-hidden="true" icon="tabler:trash" />
            Delete
          </button>
        </div>
      </div>
    </div>
  </li>
</template>
