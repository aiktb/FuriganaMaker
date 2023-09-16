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
  <div class="panel" ref="panel" tabindex="-1">
    <button
      class="option"
      v-for="option of props.options"
      :class="{ selected: option === props.modelValue }"
      @click="update(option)"
    >
      {{ option }}
    </button>
  </div>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 1;
  box-shadow: 0 0 0.1rem 0.1rem var(--font);
  border-radius: 0.4rem;
  background-color: var(--background);
  border: 0.1rem solid var(--hover);
}

.selected {
  background-color: var(--hover);
}

.option {
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  box-sizing: border-box;
  height: 1.5rem;
  text-align: left;
  transition: background-color 250ms ease-in-out;
  text-transform: capitalize;
}

.option:focus,
.option:hover {
  background-color: var(--hover);
}

.option:focus {
  z-index: 1;
}

.option:first-child {
  border-radius: 0.3rem 0.3rem 0 0;
}

.option:last-child {
  border-radius: 0 0 0.3rem 0.3rem;
}
</style>
