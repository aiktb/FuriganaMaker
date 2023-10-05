<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

import { State } from '../util/sort'

const state = ref(State.DEFAULT)
defineExpose({
  reset: () => {
    state.value = State.DEFAULT
  },
  state
})
</script>

<template>
  <button @click="state = (state + 1) % 3">
    <slot name="default" />
    <Icon v-if="state === State.ASCEND" icon="heroicons:arrow-up-20-solid" />
    <!-- prettier-ignore -->
    <Icon v-else-if="state === State.DESCEND" icon="heroicons:arrow-down-20-solid"/>
    <Icon v-else icon="heroicons:sparkles-20-solid" />
  </button>
</template>

<style scoped>
button {
  box-shadow: inset 0 0 0 1px currentColor;
  color: #00dc82;
  border: none;
  border-radius: 9999px;
  display: inline-flex;
  column-gap: 0.25rem;
  align-items: center;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}
</style>
