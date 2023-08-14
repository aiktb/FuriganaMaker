<template>
  <div class="menuItem">
    <slot name="icon" />
    <slot name="content" />
  </div>
</template>

<style>
.menuItem {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.2rem;
}
</style>
