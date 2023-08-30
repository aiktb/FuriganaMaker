import { computed, type Ref } from 'vue'

export const useClamp = (
  value: Ref<number>,
  min: Ref<number>,
  max: Ref<number>
) => {
  return computed<number>({
    get() {
      // get() can't modify value, which will cause "Maximum recursive updates exceeded" error.
      return Math.min(Math.max(value.value, min.value), max.value)
    },
    set(newValue: number) {
      value.value = Math.min(Math.max(newValue, min.value), max.value)
    }
  })
}
