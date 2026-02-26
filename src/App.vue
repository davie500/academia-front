<template>
  <Navbar v-if="!route.meta.hideNavbar" />
  <router-view />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import { echo } from '@/lib/echo'
import { useAuth } from '@/stores/auth'

const route = useRoute()
const auth = useAuth()
const router = useRouter()

onMounted(() => {
  const pusher = (echo.connector as any).pusher

  pusher.connection.bind('connecting', () => {
    
  })

  pusher.connection.bind('connected', () => {
  
  })

  pusher.connection.bind('disconnected', () => {
  })

  echo.channel(`plano`)
    .listen('.plano.atualizado', (e: any) => {

      
      localStorage.setItem('nivel', String(e.nivel))

      if (e.status_pagamento === 'approved') {
        router.push('/perfil')
      } 
      

      if (e.status_pagamento === 'rejected') {
      }
    });
})
</script>

<style>
body {
  background-color: black;
  margin: 0;
  padding: 0;
}
</style>