<script setup lang="ts">
import { onMounted, ref } from 'vue'

import ResetIcon from 'data-text:@Icons/Reset.svg'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: string]
  change: []
}>()

const set = (color: string) => {
  emit('update:modelValue', color)
  emit('change')
}

const color = ref('#0075ff')

const reset = () => {
  set('currentColor')
  color.value = '#0075ff'
}

onMounted(() => {
  if (props.modelValue !== 'currentColor') {
    color.value = props.modelValue
  }
})
</script>

<template>
  <div class="colorPicker">
    <input type="color" class="color" v-model="color" @change="set(color)" />
    <div
      tabindex="0"
      class="resetIcon"
      v-html="ResetIcon"
      @click="reset"
      @keyup.enter="reset"
    />
  </div>
</template>

<style scoped>
.colorPicker {
  display: flex;
  align-items: center;
  position: relative;
  text-align: left;
  transition: all 250ms;
  padding: 0 0.5rem;
  gap: 0.7rem;
}

.color {
  width: 1.2rem;
  height: 1.2rem;
  box-sizing: content-box;
  padding: 0;
  border-radius: 50%;
  cursor: pointer;
  appearance: none;
  position: relative;
  border: none;
  transition: all 250ms;
  background-color: transparent;
}

.color::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color::-webkit-color-swatch {
  border: none;
  border-radius: 50%;
  box-shadow: none;
}

.resetIcon {
  width: 1.3rem;
  height: 1.3rem;
  display: flex;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
}
.resetIcon:hover {
  color: var(--feature);
  transition: all 250ms;
}
</style>
