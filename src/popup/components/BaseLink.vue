<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps<{
  link: string
}>()
</script>

<template>
  <a
    target="_blank"
    :href="props.link"
    class="flex grow items-center gap-x-1 rounded px-2 hover:text-azure-700 focus:text-azure-700"
  >
    <slot name="default" />
    <Icon aria-hidden="true" icon="ci:link" />
  </a>
</template>
