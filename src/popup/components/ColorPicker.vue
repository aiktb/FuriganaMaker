<script setup lang="ts">
import { ref } from 'vue'

import ColorPanel from './ColorPanel.vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: string]
  change: []
}>()

const display = ref(false)
const selected = ref(props.modelValue)
const colorButton = ref<HTMLElement | null>(null)
const close = () => {
  display.value = false
  colorButton.value?.focus()
  emit('update:modelValue', selected.value)
  emit('change')
}
</script>

<template>
  <button
    ref="colorButton"
    class="group flex grow items-center justify-between rounded px-2"
    @click="display = true"
  >
    Select color
    <div
      class="hidden h-3 w-3 rounded-full group-focus-within:block group-hover:block"
      :style="{ backgroundColor: props.modelValue }"
    />
  </button>
  <Transition
    enter-active-class="duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <ColorPanel v-if="display" v-model="selected" @close="close" />
  </Transition>
</template>
