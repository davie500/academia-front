import { createApp } from 'vue'
import App from './App.vue'
import router from './router/Index'
import './assets/styles/index.css'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import { useAuth } from '@/stores/auth'

const app = createApp(App)

app.use(router)
app.use(Toast, { position: 'top-right', timeout: 3000 })

async function bootstrap() {
  const auth = useAuth()

  if (!auth.token.value) {
    app.mount('#app')
    return
  }

  const timeout = (ms: number) => new Promise((res) => setTimeout(res, ms))

  try {
    const result = await Promise.race([auth.fetchUser(), timeout(7000)])

    app.mount('#app')
    if (result === false) {
      console.warn('fetchUser returned false (unauth or network issue)')
    }
  } catch (err) {
    console.error('bootstrap fetchUser error', err)
    app.mount('#app')
  }
}

bootstrap()
