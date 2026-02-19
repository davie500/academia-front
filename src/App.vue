<template>
  <Navbar v-if="!route.meta.hideNavbar" />
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/stores/auth'
import Navbar from './components/Navbar.vue'

const route = useRoute()
const auth = useAuth()


</script>

<style>
body {
  background-color: black;
  margin: 0;
  padding: 0;
}
</style>
