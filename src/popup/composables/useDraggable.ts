import { useEventListener } from '@vueuse/core'
import { ref, type Ref } from 'vue'

/**
 * @remark Need to be used with 'position: fixed;' & '@Composables/useClamp'.
 */
export const useDraggable = (
  draggableElement: Ref<HTMLElement | null>,
  onEnd?: () => void
) => {
  const x = ref(0)
  const y = ref(0)
  const pressed = ref(false)

  const start = (event: PointerEvent) => {
    pressed.value = true
    draggableElement.value?.setPointerCapture(event.pointerId)
  }

  const move = (event: PointerEvent) => {
    if (pressed.value) {
      x.value = event.clientX
      y.value = event.clientY
    }
  }

  const end = (event: PointerEvent) => {
    pressed.value = false
    draggableElement.value?.releasePointerCapture(event.pointerId)
    onEnd && onEnd()
  }

  useEventListener(draggableElement, 'pointerdown', start)
  useEventListener(draggableElement, 'pointermove', move)
  useEventListener(draggableElement, 'pointerup', end)

  return { x, y }
}
