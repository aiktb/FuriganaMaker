<script setup lang="ts">
import Logo from 'data-text:@Icons/Logo.svg'

import MainMenu from './MainMenu.vue'
</script>

<!-- All because <Menu /> needs to load chrome.storage asynchronously. -->
<template>
  <Suspense>
    <template #default>
      <MainMenu />
    </template>
    <template #fallback>
      <div class="logo" v-html="Logo" />
    </template>
  </Suspense>
</template>

<style>
@font-face {
  font-display: swap;
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 700;
  src:
    local('JetBrains Mono'),
    url('../../assets/fonts/jetbrains-mono-v18-latin-700.woff2') format('woff2');
}

:root {
  --fm-blue-deep: #007fff;
  --fm-white-light: #e1e1e1;
  --fm-white-deep: #d5d7d8;
  --fm-black-light: #27415a;
  --fm-black-deep: #1c2732;
}

:root {
  --feature: var(--fm-blue-deep);
  --hover: var(--fm-white-light);
  --background: var(--fm-white-light);
  --font: var(--fm-black-deep);
}

@media (prefers-color-scheme: dark) {
  :root {
    --feature: var(--fm-blue-deep);
    --hover: var(--fm-black-light);
    --background: var(--fm-black-deep);
    --font: var(--fm-white-deep);
  }
}

html {
  font-size: 16px;
  color: var(--font);
  background-color: var(--background);
  user-select: none;
}

* {
  font-family: 'JetBrains Mono', monospace;
  box-sizing: border-box;
  text-align: left;
  font-size: 1rem;
  margin: 0;
  padding: 0;
}

button {
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: currentColor;
}

:focus-visible {
  outline: 0.15rem solid var(--font);
  box-shadow: none;
}

.logo svg {
  width: 13.5rem;
  height: 13.5rem;
}
</style>
