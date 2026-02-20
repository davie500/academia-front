<template>
  <Navbar v-if="!route.meta.hideNavbar" />
  <router-view />
  <img :src="fundo" alt="Fundo Academia" class="fundo" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import fundo from '../images/fundo.png'
import { echo } from '@/lib/echo'
import { useAuth } from '@/stores/auth'

const route = useRoute()
const auth = useAuth()

onMounted(() => {
  const pusher = (echo.connector as any).pusher

  pusher.connection.bind('connecting', () => {
    console.log('⏳ Conectando websocket...')
  })

  pusher.connection.bind('connected', () => {
    console.log('✅ WebSocket conectado')
  })

  pusher.connection.bind('disconnected', () => {
    console.log('❌ WebSocket desconectado')
  })

  echo.channel(`plano`)
      .listen('.plano.atualizado', (e: any) => {
          console.log('🔥 PAGAMENTO APROVADO')
          console.log('Novo nível:', e.nivel)
          console.log('Plano:', e.plano)
          console.log('Expira em:', e.data_fim)

          auth.usuario.nivel = e.nivel
      })
})
</script>

<style>
body {
  background-color: black;
  margin: 0;
  padding: 0;
}
</style>