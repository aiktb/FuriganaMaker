<script setup lang="ts">
import {
  clamp,
  useDraggable,
  useElementBounding,
  useMousePressed
} from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: number
  min: number
  max: number
}>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: number]
  change: []
}>()
const track = ref<HTMLElement | null>(null)
const thumb = ref<HTMLElement | null>(null)
const { left, right, top, bottom } = useElementBounding(track)
const { width, height } = useElementBounding(thumb)

const { x: useX } = useDraggable(thumb)
const x = computed(() => {
  return clamp(useX.value, left.value, right.value - width.value)
})

const newModelValue = computed(() => {
  const trackWidth = right.value - left.value - width.value
  const percent = (x.value - left.value) / trackWidth
  return Math.round(percent * (props.max - props.min) + props.min)
})

const { pressed } = useMousePressed({ target: thumb })
watch(pressed, (pressed) => {
  if (!pressed) {
    emit('update:modelValue', newModelValue.value)
    emit('change')
  }
})

enum KeyEvent {
  Add,
  Subtract,
  Emit
}
const keyHandler = (type: KeyEvent) => {
  switch (type) {
    case KeyEvent.Add:
      useX.value = clamp(useX.value + 1, left.value, right.value - width.value)
      break
    case KeyEvent.Subtract:
      useX.value = clamp(useX.value - 1, left.value, right.value - width.value)
      break
    case KeyEvent.Emit:
      emit('update:modelValue', newModelValue.value)
      emit('change')
      break
  }
}

const y = computed(() => {
  return top.value + (bottom.value - top.value) / 2 - height.value / 2
})

// [left, right, top, bottom, width, height]
// are only available after the component is mounted.
onMounted(() => {
  const percent = (props.modelValue - props.min) / (props.max - props.min)
  const trackWidth = right.value - left.value - width.value
  useX.value = clamp(
    percent * trackWidth + left.value,
    left.value,
    right.value - width.value
  )
})
</script>

<template>
  <div
    class="range"
    tabindex="0"
    @keydown.left="keyHandler(KeyEvent.Subtract)"
    @keydown.right="keyHandler(KeyEvent.Add)"
    @keydown.up="keyHandler(KeyEvent.Add)"
    @keydown.down="keyHandler(KeyEvent.Subtract)"
    @keyup="keyHandler(KeyEvent.Emit)"
  >
    <div class="track" ref="track">
      <div
        class="thumb"
        ref="thumb"
        :style="{ left: `${x}px`, top: `${y}px` }"
      />
    </div>
  </div>
</template>

<style scoped>
.range {
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

.range:hover,
.range:focus-within {
  transition: all 250ms;
  background-color: var(--hover);
}

.track {
  height: 12%;
  width: 100%;
  border-radius: 0.5rem;
  background-color: currentColor;
}

.thumb {
  position: fixed;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background-color: var(--feature);
  cursor: pointer;
  outline: none;
}
</style>
