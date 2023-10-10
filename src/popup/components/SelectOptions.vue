<script setup lang="ts">
import { useFocusWithin } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  options: string[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: string]
  close: []
}>()

const update = (option: string) => {
  emit('update:modelValue', option)
  emit('close')
}

const panel = ref<HTMLElement | null>(null)
const { focused } = useFocusWithin(panel)
watch(focused, () => {
  if (!focused.value) {
    emit('close')
  }
})

onMounted(() => {
  panel.value?.focus()
})
</script>

<template>
  <div
    id="panel"
    ref="panel"
    class="column absolute left-0 top-full z-10 flex w-full flex-col overflow-hidden rounded-md border-2 border-slate-500 bg-slate-200 dark:border-slate-700 dark:bg-slate-800"
    tabindex="-1"
  >
    <button
      v-for="option of props.options"
      :key="option"
      class="box-content flex items-center px-2 capitalize transition-all hover:bg-slate-300 focus:z-10 focus:bg-slate-300 focus:text-blue-600 dark:hover:bg-slate-700 dark:focus:bg-slate-700"
      role="option"
      :class="{
        'bg-slate-300 text-[--feature-color] dark:bg-slate-700':
          option === props.modelValue
      }"
      :aria-selected="option === props.modelValue"
      @click="update(option)"
    >
      {{ option }}
    </button>
  </div>
</template>

<style scoped>
#panel {
  box-shadow: 0 0 0.2rem 0.1rem gray;
}
</style>
