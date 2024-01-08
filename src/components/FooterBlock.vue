<template>
  <div class="footer-block column">
    <div class="footer-block-inside container row col-grow items-center justify-center">
      <!-- Footer links. -->
      <a
        v-for="(link, index) of links"
        class="q-mx-md text-white"
        :href="link.path"
        :key="index"
        target="_blank"
        :title="link.title"
      >
        <q-icon :name="link.icon" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { links } from './links';
</script>

<style scoped lang="scss">
.footer-block {
  background-image: linear-gradient(to right, rgb(63, 81, 181), rgb(100, 181, 246));
  height: 128px;
}
a {
  font-size: 36px;
  opacity: .5;

  &:hover {
    opacity: 1;
  }
}
</style>
