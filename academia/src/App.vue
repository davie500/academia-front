<template>
    <Navbar />
    <router-view />
    <img :src="fundo" alt="Fundo Academia" class="fundo" />
</template>

<script setup>
  import Navbar from './components/Navbar.vue'
  import fundo from '../assets/fundo.png'
</script>

<style>
body {
  background-color: black;
  margin: 0;
  padding: 0;
}
</style>