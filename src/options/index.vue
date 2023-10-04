<script setup lang="ts">
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import Main from './components/Main.vue'
</script>

<template>
  <Header />
  <Suspense>
    <template #default>
      <Main />
    </template>
  </Suspense>
  <Footer />
</template>

<style>
:root {
  --feature: #0075ff;
  --hover: #e1e1e1;
  --background: #f5f5f5;
  --font: #000000;
}

@media (prefers-color-scheme: dark) {
  :root {
    --feature: #0075ff;
    --hover: #27415a;
    --background: #1c2732;
    --font: #9ca3af;
    --strong: #ffffff;
  }
}

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

body {
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: var(--font);
  background-color: var(--background);
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  text-decoration: none;
  background-color: transparent;
  color: currentColor;
}
</style>
