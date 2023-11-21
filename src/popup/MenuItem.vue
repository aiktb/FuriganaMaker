<script setup lang="ts">
const props = withDefaults(defineProps<{ tip?: boolean }>(), {
  tip: false
})
</script>

<template>
  <li class="group relative m-2 flex items-center gap-x-2">
    <div class="text-2xl" aria-hidden="true">
      <slot name="icon" />
    </div>
    <div
      class="peer relative flex grow rounded transition-all focus-within:bg-slate-300 hover:bg-slate-300 dark:focus-within:bg-slate-700 dark:hover:bg-slate-700"
    >
      <slot name="content" />
    </div>
    <div
      v-if="props.tip"
      class="invisible absolute -right-2 -top-3/4 z-10 rounded bg-slate-900 px-2 text-slate-200 opacity-0 transition-opacity delay-200 duration-500 group-first:top-full peer-focus-within:visible peer-focus-within:opacity-100 peer-hover:visible peer-hover:opacity-100 dark:bg-slate-200 dark:text-slate-800"
    >
      <slot name="tip" />
    </div>
  </li>
</template>
