<script setup lang="ts">
import FillLogoIcon from 'data-text:@Icons/FillLogo.svg'

import Menu from '~popup/Menu.vue'
</script>

<!-- All because <Menu /> needs to load chrome.storage asynchronously. -->
<template>
  <Suspense>
    <template #default>
      <Menu />
    </template>
    <template #fallback>
      <div v-html="FillLogoIcon" class="logo" />
    </template>
  </Suspense>
</template>

<style>
.logo svg {
  width: 13.5rem;
  height: 13.5rem;
}
</style>
