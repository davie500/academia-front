<template>
    <Navbar v-if="!route.meta.hideNavbar"/>
    <router-view />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()
</script>

<style>
body {
  background-color: black;
  margin: 0;
  padding: 0;
}
</style>