import { useElementBounding, useEventListener } from '@vueuse/core'
import { ref, type Ref } from 'vue'

/**
 * Confine `target` to `container`, click `container` or drag `target` to move `target`.
 * @remark Need to be used with 'position: fixed;'.
 * @remark This composable item does not have the ability to set normal initial values before mounting,
 * and needs to be manually set in the `onMounted` hook.
 */
export const useDraggable = (
  target: Ref<HTMLElement | null>,
  container: Ref<HTMLElement | null>,
  onEnd?: () => void
) => {
  // These values are all 0 before the component is mounted.
  const { left, right, top, bottom } = useElementBounding(container)
  const x = ref(left.value)
  const y = ref(right.value)
  const pressed = ref(false)
  const targetStart = (event: PointerEvent) => {
    pressed.value = true
    target.value?.setPointerCapture(event.pointerId)
  }

  const containerStart = (event: PointerEvent) => {
    pressed.value = true
    target.value?.setPointerCapture(event.pointerId)
    x.value = event.clientX
    y.value = event.clientY
  }

  const move = (event: PointerEvent) => {
    if (pressed.value) {
      x.value = Math.min(Math.max(event.clientX, left.value), right.value)
      y.value = Math.min(Math.max(event.clientY, top.value), bottom.value)
    }
  }

  const end = (event: PointerEvent) => {
    pressed.value = false
    target.value?.releasePointerCapture(event.pointerId)
    onEnd && onEnd()
  }

  useEventListener(target, 'pointerdown', targetStart)
  useEventListener(target, 'pointermove', move)
  useEventListener(target, 'pointerup', end)
  useEventListener(container, 'pointerdown', containerStart)
  useEventListener(container, 'pointermove', move)
  useEventListener(container, 'pointerup', end)

  return { x, y }
}
