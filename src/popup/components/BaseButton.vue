<script setup lang="ts">
import { ref } from 'vue'

/*
 * Vue bug: https://github.com/vuejs/core/pull/8602, wait release.
 * Vue boolean prop behaves very strangely.
 * const props = withDefaults(defineProps<{ modelValue?: boolean }>(), {
 *    modelValue: undefined
 * })
 */
const props = defineProps<{
  modelValue?: boolean
}>()

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
    class="flex grow items-center justify-between px-2"
    @click="change"
  >
    <slot name="default" />
  </button>
</template>
