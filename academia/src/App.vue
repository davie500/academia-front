<template>
    <Navbar />
    <router-view />
</template>

<script setup>
  import Navbar from './components/Navbar.vue'
  import login from './views/Login.vue'
</script>

<style>
body {
  background-color: black;
  margin: 0;
  padding: 0;
}
</style>