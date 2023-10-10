<script setup lang="ts">
import { ref } from 'vue'

import BaseButton from './BaseButton.vue'
import ColorPicker from './ColorPicker.vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: string]
  change: []
}>()

const display = ref(false)
const selected = ref(props.modelValue)
const colorButton = ref<InstanceType<typeof BaseButton> | null>(null)
const close = () => {
  display.value = false
  colorButton.value?.focus()
  emit('update:modelValue', selected.value)
  emit('change')
}
</script>

<template>
  <BaseButton ref="colorButton" class="group" @click="display = true">
    Select color
    <div
      class="hidden h-3 w-3 rounded-full group-focus-within:block group-hover:block"
      :style="{ backgroundColor: props.modelValue }"
    />
  </BaseButton>
  <Transition>
    <ColorPicker v-if="display" v-model="selected" @close="close" />
  </Transition>
</template>
