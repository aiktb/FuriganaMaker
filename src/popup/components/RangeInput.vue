<script setup lang="ts">
import { useDraggable, useElementBounding, useMousePressed } from '@vueuse/core'
import { useClamp } from '@vueuse/math'
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
const { left, right, top, width, height } = useElementBounding(track)
const { x: useX } = useDraggable(thumb)
const x = useClamp(useX, left, right)
const style = computed(() => {
  return {
    left: `${x.value}px`,
    top: `${top.value + height.value / 2}px`
  }
})

const emitNewModelValue = () => {
  const percent = (useX.value - left.value) / width.value
  const newModelValue = Math.round(
    percent * (props.max - props.min) + props.min
  )
  emit('update:modelValue', newModelValue)
  emit('change')
}

const { pressed } = useMousePressed({ target: thumb })
watch(pressed, (pressed) => {
  if (!pressed) {
    emitNewModelValue()
  }
})

// prettier-ignore
enum KeyEvent { Add, Subtract, Emit }
const keyHandler = (type: KeyEvent) => {
  switch (type) {
    case KeyEvent.Add:
      useX.value++
      break
    case KeyEvent.Subtract:
      useX.value--
      break
    case KeyEvent.Emit:
      emitNewModelValue()
      break
  }
}

onMounted(() => {
  const percent = (props.modelValue - props.min) / (props.max - props.min)
  useX.value = percent * width.value + left.value
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
      <div class="thumb" ref="thumb" :style="style" />
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
  transform: translate(-50%, -50%);
}
</style>
