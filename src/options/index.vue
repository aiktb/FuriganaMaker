<script setup lang="ts">
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import Main from './components/Main.vue'

import './style.css'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Header />
    <Suspense>
      <Main />
    </Suspense>
    <Footer />
  </div>
</template>
