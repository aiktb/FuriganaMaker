<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

import type { Rule } from '~contents/core'

import RuleEditor from './RuleEditor.vue'

const props = defineProps<{
  rule: Rule
}>()

const emit = defineEmits<{
  delete: []
  update: [rule: Rule]
  toggle: []
}>()

const ruleEditorIsOpen = ref(false)
const deleting = ref(false)
const progress = ref(5000) // 5 seconds

const intervalId = ref<number | null>(null)
const deleteHandler = () => {
  deleting.value = true
  intervalId.value = window.setInterval(() => {
    progress.value -= 1000
    if (progress.value <= 0) {
      deleting.value = false
      progress.value = 5000
      emit('delete')
    }
  }, 1000)
}

const undoDelete = () => {
  window.clearInterval(intervalId.value!)
  deleting.value = false
  progress.value = 5000
}

const update = (rule: Rule) => {
  emit('update', rule)

  ruleEditorIsOpen.value = false
}
</script>

<template>
  <div v-if="!deleting" class="flex flex-col justify-between gap-x-6 py-5 sm:flex-row">
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
        <p class="w-72 truncate text-xs leading-5 sm:w-96 md:w-[30rem] lg:w-[36rem]">
          {{ props.rule.selector }}
        </p>
      </div>
    </div>
    <div class="flex shrink-0 flex-col items-end">
      <div
        class="flex w-full items-center justify-between gap-x-1.5 sm:flex-col sm:items-end sm:justify-evenly"
      >
        <button
          class="mr-1 flex flex-row-reverse items-center gap-x-1.5 sm:flex-row"
          @click="emit('toggle')"
        >
          <p class="text-sm leading-5 transition hover:text-slate-950 dark:hover:text-white">
            {{ props.rule.active ? 'Active' : 'Inactive' }}
          </p>
          <span class="relative flex h-2 w-2">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              :class="props.rule.active ? 'bg-sky-400' : 'bg-gray-400'"
            />
            <span
              class="relative inline-flex h-2 w-2 rounded-full"
              :class="props.rule.active ? 'bg-sky-500' : 'bg-gray-500'"
            />
          </span>
        </button>
        <div class="mt-1 flex gap-x-1.5">
          <button
            class="flex items-center gap-x-1 rounded-md border border-gray-200 px-1 py-0.5 text-sm font-bold text-sky-500 shadow transition-[background-color] hover:bg-transparent/10 dark:border-slate-800 dark:hover:bg-transparent/20"
            @click="ruleEditorIsOpen = true"
          >
            <Icon class="h-4 w-4" aria-hidden="true" icon="tabler:edit" />
            Edit
          </button>
          <button
            class="flex items-center gap-x-1 rounded-md border border-gray-200 px-1 py-0.5 text-sm font-bold text-red-600 shadow transition-[background-color] hover:bg-transparent/10 dark:border-slate-800 dark:text-red-500 dark:hover:bg-transparent/20"
            @click="deleteHandler"
          >
            <Icon class="h-4 w-4" aria-hidden="true" icon="tabler:trash" />
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
  <button
    v-else
    class="w-full rounded-md px-16 py-5 text-sm font-bold leading-6 shadow-sm transition duration-150 ease-in-out hover:bg-transparent/10 hover:text-black dark:hover:bg-transparent/20 dark:hover:text-white sm:px-40 lg:px-60"
    @click="undoDelete"
  >
    <div class="flex h-12 items-center">
      <svg
        class="-ml-1 mr-3 h-5 w-5 animate-spin text-sky-500 dark:text-sky-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      Click here to undo the deletion action.
    </div>
  </button>
  <TransitionRoot appear :show="ruleEditorIsOpen" as="template">
    <Dialog as="div" class="relative z-20" @close="ruleEditorIsOpen = false">
      <div class="fixed inset-0 backdrop-blur backdrop-filter" aria-hidden="true" />
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900"
            >
              <RuleEditor :rule="rule" @update="update" />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
