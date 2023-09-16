<script setup lang="ts">
import { ref } from 'vue'

import Button from '@Components/Button.vue'
import ColorPicker from '@Components/ColorPicker.vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: string]
  change: []
}>()

const display = ref(false)
const selected = ref(props.modelValue)
const colorButton = ref<InstanceType<typeof Button> | null>(null)
const close = () => {
  display.value = false
  colorButton.value?.focus()
  emit('update:modelValue', selected.value)
  emit('change')
}
</script>

<template>
  <Button class="colorButton" @click="display = true" ref="colorButton">
    Select color
    <div class="colorIdentify" />
  </Button>
  <Transition>
    <ColorPicker v-model="selected" v-if="display" @close="close" />
  </Transition>
</template>

<style scoped>
.colorIdentify {
  display: none;
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background-color: v-bind('props.modelValue');
}

.colorButton:hover .colorIdentify,
.colorButton:focus-within .colorIdentify {
  display: block;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
