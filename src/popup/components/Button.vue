<template>
  <div class="button" tabindex="0">
    <slot name="default" />
  </div>
</template>

<style scoped>
.button {
  cursor: pointer;
  height: 1.5rem;
  padding: 0 0.5rem;
  border-radius: 0.3rem;
  display: flex;
  align-items: center;
  transition: all 250ms;
}
</style>
