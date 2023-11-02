<script setup lang="ts">
import { useElementBounding, useFocusWithin } from '@vueuse/core'
import tinycolor from 'tinycolor2'
import { computed, onMounted, ref, watch } from 'vue'

import { useDraggable } from '../composables/useDraggable'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [modelValue: string]
  close: []
}>()

const update = (color: string) => {
  emit('update:modelValue', color)
  emit('close')
}

const panel = ref<HTMLElement | null>(null)
const { focused } = useFocusWithin(panel)
watch(focused, () => {
  if (!focused.value) {
    emit('close')
  }
})

// prettier-ignore
const colors = [
  'black', 'white', 'tomato', 'moccasin', 'orange',
  'yellow', 'lime', 'aqua', 'teal', 'fuchsia'
]

const hue = ref<HTMLCanvasElement | null>(null)
const hueCursor = ref<HTMLElement | null>(null)
const {
  left: hueLeft,
  top: hueTop,
  right: hueRight,
  width: hueWidth,
  height: hueHeight
} = useElementBounding(hue)
const { x: hueX } = useDraggable(hueCursor, hue)
const hueBarStyle = computed(() => {
  return {
    left: `${hueX.value}px`,
    top: `${hueTop.value + hueHeight.value / 2}px`,
    backgroundColor: `hsl(${hsv.value.h}, 100%, 50%)`
  }
})

const shade = ref<HTMLCanvasElement | null>(null)
const shadeCursor = ref<HTMLElement | null>(null)
const {
  left: shadeLeft,
  right: shadeRight,
  top: shadeTop,
  bottom: shadeBottom,
  width: shadeWidth,
  height: shadeHeight
} = useElementBounding(shade)
const { x: shadeX, y: shadeY } = useDraggable(shadeCursor, shade)
const shadeBarStyle = computed(() => {
  return {
    left: `${shadeX.value}px`,
    top: `${shadeY.value}px`,
    backgroundColor: tinycolor(hsv.value).toHslString()
  }
})

const hsv = computed(() => {
  const hue = ((hueX.value - hueLeft.value) / hueWidth.value) * 360
  const saturation = (shadeX.value - shadeLeft.value) / shadeWidth.value
  const value = 1 - (shadeY.value - shadeTop.value) / shadeHeight.value
  return { h: hue, s: saturation, v: value }
})

const input = ref(props.modelValue)

watch(hsv, (hsv) => {
  input.value = tinycolor(hsv).toHexString()
})

const colorToPosition = (color: string) => {
  if (tinycolor(color).isValid()) {
    const hsv = tinycolor(color).toHsv()
    hueX.value = hueWidth.value * (hsv.h / 360) + hueLeft.value
    shadeX.value = shadeWidth.value * hsv.s + shadeLeft.value
    shadeY.value = shadeHeight.value * (1 - hsv.v) + shadeTop.value
  } else if (color === 'currentColor') {
    hueX.value = hueLeft.value
    shadeX.value = shadeLeft.value
    shadeY.value = shadeTop.value
  }
}

onMounted(() => {
  const hueCanvas = hue.value!
  const hueCtx = hueCanvas.getContext('2d')!
  const hueGradient = hueCtx.createLinearGradient(0, 0, hueCanvas.width, 0)
  for (let percent = 0; percent <= 1; percent += 1 / 6) {
    hueGradient.addColorStop(percent, `hsl(${percent * 360}, 100%, 50%)`)
  }
  hueCtx.fillStyle = hueGradient
  hueCtx.fillRect(0, 0, hueCanvas.width, hueCanvas.height)
  const shadeCanvas = shade.value!
  const shadeCtx = shadeCanvas.getContext('2d')!
  // prettier-ignore
  const whiteGradient = shadeCtx.createLinearGradient(0, 0, shadeCanvas.width, 0)
  whiteGradient.addColorStop(0, '#ffffff')
  whiteGradient.addColorStop(1, 'transparent')
  // prettier-ignore
  const blackGradient = shadeCtx.createLinearGradient(0, 0, 0, shadeCanvas.height)
  blackGradient.addColorStop(0, 'transparent')
  blackGradient.addColorStop(1, '#000000')
  shadeCtx.fillStyle = whiteGradient
  shadeCtx.fillRect(0, 0, shadeCanvas.width, shadeCanvas.height)
  shadeCtx.fillStyle = blackGradient
  shadeCtx.fillRect(0, 0, shadeCanvas.width, shadeCanvas.height)

  colorToPosition(props.modelValue)
  panel.value?.focus()
})

const bound = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}
// prettier-ignore
enum KeyEvent {HueLeft, HueRight, ShadeUp, ShadeDown, ShadeLeft, ShadeRight}
const keyHandler = (type: KeyEvent) => {
  switch (type) {
    case KeyEvent.HueLeft:
      hueX.value = bound(hueX.value - 1, hueLeft.value, hueRight.value)
      break
    case KeyEvent.HueRight:
      hueX.value = bound(hueX.value + 1, hueLeft.value, hueRight.value)
      break
    case KeyEvent.ShadeUp:
      shadeY.value = bound(shadeY.value - 1, shadeTop.value, shadeBottom.value)
      break
    case KeyEvent.ShadeDown:
      shadeY.value = bound(shadeY.value + 1, shadeTop.value, shadeBottom.value)
      break
    case KeyEvent.ShadeLeft:
      shadeX.value = bound(shadeX.value - 1, shadeLeft.value, shadeRight.value)
      break
    case KeyEvent.ShadeRight:
      shadeX.value = bound(shadeX.value + 1, shadeLeft.value, shadeRight.value)
      break
  }
}
</script>

<template>
  <div
    ref="panel"
    class="fixed bottom-0 left-0 right-0 top-0 z-10 flex flex-col items-center justify-between bg-slate-100 p-3 dark:bg-slate-800"
    tabindex="-1"
    aria-label="color picker"
  >
    <canvas
      id="shade"
      ref="shade"
      class="h-[70%] w-full rounded-sm"
      :style="{ backgroundColor: hueBarStyle.backgroundColor }"
    />
    <div
      id="shadeCursor"
      ref="shadeCursor"
      aria-label="shade cursor"
      class="fixed h-4 w-4 cursor-pointer rounded-full shadow-md transition-all duration-300 [transform:translate(-50%,-50%)] hover:transition-none focus:transition-none"
      tabindex="0"
      :style="shadeBarStyle"
      @keydown.up="keyHandler(KeyEvent.ShadeUp)"
      @keydown.down="keyHandler(KeyEvent.ShadeDown)"
      @keydown.left="keyHandler(KeyEvent.ShadeLeft)"
      @keydown.right="keyHandler(KeyEvent.ShadeRight)"
      @keyup.enter="update(input)"
    />
    <canvas id="hue" ref="hue" class="h-[3%] w-full rounded" />
    <div
      id="hueCursor"
      ref="hueCursor"
      aria-label="hue cursor"
      class="fixed h-3 w-3 cursor-pointer rounded-full shadow-md transition-all duration-300 [transform:translate(-50%,-50%)] hover:transition-none focus:transition-none"
      tabindex="0"
      :style="hueBarStyle"
      @keydown.up="keyHandler(KeyEvent.HueRight)"
      @keydown.down="keyHandler(KeyEvent.HueLeft)"
      @keydown.left="keyHandler(KeyEvent.HueLeft)"
      @keydown.right="keyHandler(KeyEvent.HueRight)"
      @keyup.enter="update(input)"
    />
    <div class="flex w-full flex-wrap justify-between">
      <button
        v-for="color of colors"
        :id="tinycolor(color).toHexString() === input ? 'selected' : ''"
        :key="color"
        class="h-3.5 w-3.5 rounded border-2 border-slate-400 dark:border-transparent"
        :style="{ backgroundColor: color }"
        :aria-label="color"
        @click="colorToPosition(color)"
      />
    </div>
    <div class="grid w-full grid-cols-10">
      <input
        v-model="input"
        class="w-20 rounded border-2 border-slate-400 bg-white px-1 uppercase transition-all dark:border-slate-700 dark:bg-slate-900"
        aria-label="Input a HEX color"
        @change="colorToPosition(input)"
      />
      <button
        class="col-start-6 grid-flow-row-dense rounded px-1 transition-all hover:text-blue-600 focus:text-blue-600"
        @click="update('currentColor')"
      >
        RESET
      </button>
      <button
        class="col-start-9 col-end-11 flex items-center justify-center rounded border-2 border-slate-400 bg-white transition-all hover:text-[--feature-color] focus:text-[--feature-color] dark:border-slate-700 dark:bg-slate-900"
        @click="update(input)"
      >
        OK
      </button>
    </div>
  </div>
</template>

<style scoped>
#shade,
#hue {
  box-shadow:
    0 0 0 0.05rem #cbd5e1,
    0 0 0.05rem 0.05rem currentColor;
}

@media (prefers-color-scheme: dark) {
  #shade,
  #hue {
    box-shadow:
      0 0 0 0.05rem rgb(51 65 85),
      0 0 0.05rem 0.05rem currentColor;
  }
}
#shadeCursor,
#hueCursor {
  box-shadow:
    0 0 0 0.1rem white,
    inset 0 0 0.1rem 0.1rem #0006,
    0 0 0.1rem 0.1rem #0006;
}

#selected {
  box-shadow:
    0 0 0 0.1rem var(--feature-color),
    inset 0 0 0.1rem 0.1rem var(--feature-color),
    0 0 0.2rem 0.2rem var(--feature-color);
}
</style>
