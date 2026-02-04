<template>
    <Navbar v-if="!isAuthPage" />
    <router-view />
    <img :src="fundo" alt="Fundo Academia" class="fundo" />
</template>

<script setup>
  import Navbar from './components/Navbar.vue'
  import fundo from '../assets/fundo.png'
  import { useRoute } from 'vue-router'
  import { computed } from 'vue'

  const route = useRoute()
  
  const isAuthPage = computed(() => {
    return route.name === 'Login' || route.name === 'Cadastro'
  })
</script>

<style>
body {
  background-color: black;
  margin: 0;
  padding: 0;
}
</style>