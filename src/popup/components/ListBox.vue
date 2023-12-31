<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useFocusWithin } from '@vueuse/core'
import { ref, watch } from 'vue'

const props = defineProps<{
  options: string[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: string]
  change: []
}>()

const display = ref(false)
const panel = ref<HTMLElement | null>(null)
const { focused } = useFocusWithin(panel)
watch(focused, () => {
  if (!focused.value) {
    display.value = false
  }
})
</script>

<template>
  <div ref="panel" class="group flex grow">
    <button
      ref="selectButton"
      role="listbox"
      :aria-expanded="display"
      class="group peer flex grow items-center justify-between rounded px-2 capitalize"
      :class="{ 'bg-slate-300 dark:bg-slate-700': display }"
      @click="display = !display"
    >
      {{ props.modelValue }}
      <Icon
        class="text-azure-700 group-focus-within:flex group-hover:flex"
        :class="{ hidden: !display }"
        aria-hidden="true"
        icon="ep:arrow-down-bold"
      />
    </button>
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="display"
        class="column absolute left-0 top-full z-10 flex w-full flex-col rounded-md border-2 border-slate-500 bg-slate-100 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        tabindex="-1"
      >
        <button
          v-for="option of props.options"
          :key="option"
          class="box-content flex items-center px-2 capitalize transition-all first:rounded-t last:rounded-b hover:bg-slate-300 focus:z-10 focus:bg-slate-300 focus:text-azure-700 dark:hover:bg-slate-700 dark:focus:bg-slate-700"
          role="option"
          :aria-selected="option === props.modelValue"
          @click="
            () => {
              emit('update:modelValue', option)
              emit('change')
              display = false
            }
          "
        >
          {{ option }}
        </button>
      </div>
    </Transition>
  </div>
</template>
