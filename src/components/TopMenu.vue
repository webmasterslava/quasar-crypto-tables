<template>
  <div class="top-menu column bg-white">
    <div class="top-menu-inside container row col-grow">
      <!-- Main menu. -->
      <div class="main-menu row">
        <router-link
          v-for="(item, index) of items"
          class="items-center row q-px-lg"
          :key="index"
          :to="item.path"
        >
          {{ item.name }}
        </router-link>
      </div>
      <q-space />
      <!-- Top links. -->
      <div class="links row">
        <a
          v-for="(link, index) of links"
          class="items-center row text-h5 q-px-sm"
          :href="link.path"
          :key="index"
          target="_blank"
          :title="link.title"
        >
          <q-icon :name="link.icon" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { links } from './links';

// Menu item type.
interface MenuItem {
  name: string;
  path: string;
}

// List of menu items.
const items: MenuItem[] = [
  { name: 'Home', path: '/' },
];
</script>

<style scoped lang="scss">
.top-menu {
  height: 58px;
}
.main-menu {
  a {
    &:hover {
      background-color: rgba(0, 0, 0, .03);
    }
    &.router-link-exact-active {
      background-color: rgba(0, 0, 0, .06);
    }
  }
}
.links {
  a {
    opacity: .5;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
