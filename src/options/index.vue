<script setup lang="ts">
import MyFooter from './components/MyFooter.vue'
import MyHeader from './components/MyHeader.vue'
import MyMain from './components/MyMain.vue'
</script>

<template>
  <MyHeader />
  <Suspense>
    <template #default>
      <MyMain />
    </template>
  </Suspense>
  <MyFooter />
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

@font-face {
  font-display: swap;
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 400;
  src:
    local('Inter'),
    url('../../assets/fonts/dm-sans-v14-latin-regular.woff2') format('woff2');
}

:root {
  --fm-blue-light: #12b8fd;
  --fm-blue-deep: #007fff;
  --fm-white-light: #e1e1e1;
  --fm-white-deep: #d5d7d8;
  --fm-black-light: #27415a;
  --fm-black-deep: #1c2732;
}

:root {
  --background: var(--fm-white-light);
  --font: var(--fm-black-deep);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: var(--fm-black-deep);
    --font: var(--fm-white-deep);
  }
}

html {
  font-size: 14px;
  line-height: 1.5;
  color: var(--font);
  background-color: var(--background);
}

* {
  box-sizing: border-box;
  font-family: 'DM Sans', sans-serif;
  padding: 0;
  margin: 0;
  text-decoration: none;
  background-color: transparent;
  color: currentColor;
}
</style>
