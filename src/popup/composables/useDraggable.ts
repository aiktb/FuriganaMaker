import { useElementBounding, useEventListener } from '@vueuse/core'
import { ref, type Ref } from 'vue'

/**
 * Confine `target` to `container`, click `container` or drag `target` to move `target`.
 * @remark Need to be used with 'position: fixed;'.
 */
export const useDraggable = (
  target: Ref<HTMLElement | null>,
  container: Ref<HTMLElement | null>,
  onEnd?: () => void
) => {
  const x = ref(0)
  const y = ref(0)
  const pressed = ref(false)
  const { left, right, top, bottom } = useElementBounding(container)
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
