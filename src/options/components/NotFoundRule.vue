<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="flex flex-col items-center px-6 pb-24 pt-16 text-center">
    <Icon class="h-20 w-20 text-sky-500" icon="fluent:location-not-found-24-regular" />
    <h1 class="space-x-[2px] pt-3 text-xl font-bold leading-5 text-sky-500">NOT FOUND RULE</h1>
    <div class="mx-auto mb-[18px] mt-6 h-[1px] w-16 bg-sky-500" />
    <p class="mx-auto my-0 max-w-[256px] text-base font-[500]">
      Please add a new rule, or import an existing configuration file (in JSON format), otherwise
      this extension will not do anything.
    </p>
  </div>
</template>