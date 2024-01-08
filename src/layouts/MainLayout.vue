<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Top menu. -->
    <top-menu />
    <!-- Header block. -->
    <header-block />
    <q-page-container>
      <div class="container">
        <router-view />
      </div>
    </q-page-container>
    <!-- Footer block. -->
    <footer-block />
  </q-layout>
</template>

<script setup lang="ts">
import TopMenu from 'components/TopMenu.vue';
import HeaderBlock from 'components/HeaderBlock.vue';
import FooterBlock from 'components/FooterBlock.vue';
</script>

<style scoped lang="scss">
.q-page-container {
  margin-bottom: 48px;
  margin-top: -48px;
}
</style>
