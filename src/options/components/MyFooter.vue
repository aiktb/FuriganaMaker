<script setup lang="ts">
import GithubLogo from 'data-text:@Icons/Github.svg'
import PlasmoLogo from 'data-text:@Icons/Plasmo.svg'
</script>

<template>
  <div class="line">
    <a
      class="icon github"
      href="https://github.com/aiktb/FuriganaMaker"
      target="_blank"
      v-html="GithubLogo"
    />
  </div>
  <footer>
    <div class="made">
      Made by
      <a
        class="icon plasmo"
        href="https://plasmo.com"
        target="_blank"
        v-html="PlasmoLogo"
      />
    </div>
    <div class="license">
      Published under
      <a
        href="https://github.com/aiktb/FuriganaMaker/blob/main/LICENSE"
        target="_blank"
      >
        MIT License
      </a>
    </div>
    <div class="copyright">
      Copyright © 2023
      <a href="https://aiktb.com" target="_blank">aiktb</a>
    </div>
  </footer>
</template>

<style scoped>
footer {
  display: grid;
  justify-content: space-around;
  align-items: center;
}
.max-width {
  display: flex;
  justify-content: center;
}
@media (min-width: 1024px) {
  footer {
    grid-template-areas: 'made license copyright';
    grid-template-columns: 1fr 1fr 1fr;
    padding: 1rem 2rem;
  }
  .made {
    justify-content: start;
  }
  .license {
    justify-content: center;
  }
  .copyright {
    justify-content: end;
  }
}
@media (max-width: 1023px) {
  footer {
    grid-template-areas: 'made' 'license' 'copyright';
    grid-template-rows: 1fr 1fr 1fr;
    padding: 2rem 1rem;
  }

  .made,
  .license,
  .copyright {
    justify-content: center;
  }
}

footer > * {
  display: flex;
  gap: 0.3rem;
}

a {
  color: var(--strong);
}

.plasmo {
  height: 1rem;
}

.line {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1px;
  background-color: var(--hover);
}

.github {
  height: 1.2rem;
  display: flex;
  align-items: center;
  padding: 0 0.8rem;
  background-color: var(--background);
}

.icon:deep(svg) {
  height: 100%;
  width: auto;
}
</style>
