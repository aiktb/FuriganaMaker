<script setup lang="ts">
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

const change = () => {
  emit('update:modelValue', !props.modelValue)
  emit('change')
}
</script>

<template>
  <button class="button" @click="change">
    <slot name="default" />
  </button>
</template>

<style scoped>
.button {
  height: 1.5rem;
  padding: 0 0.5rem;
  border-radius: 0.3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  transition: opacity 250ms ease-in-out;
}
</style>
