<template>
  <router-view />
  <TabBar v-if="$route.meta.showTab" />
</template>

<script setup>
import TabBar from './components/TabBar.vue'
</script>

<style>
.van-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
