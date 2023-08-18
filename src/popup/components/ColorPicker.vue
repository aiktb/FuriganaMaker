Realize hover prompt box
<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits<{
  'update:modelValue': [modelValue: string]
  change: []
}>()
</script>

<template>
  <div class="colorPicker"></div>
</template>

<style scoped>
.colorPicker {
  display: flex;
  align-items: center;
  position: relative;
  flex-grow: 1;
  box-sizing: border-box;
  height: 1.5rem;
  text-align: left;
  border: none;
  border-radius: 0.3rem;
  transition: all 250ms;
  padding: 0 0.5rem;
}
</style>
