<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ modelValue?: boolean }>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: boolean]
  change: []
}>()

const root = ref<HTMLElement | null>(null)
defineExpose({
  focus: () => {
    root.value?.focus()
  }
})

const change = () => {
  emit('update:modelValue', !props.modelValue)
  emit('change')
}
</script>

<template>
  <button
    ref="root"
    class="flex grow items-center justify-between rounded px-2"
    @click="change"
  >
    <slot name="default" />
  </button>
</template>
