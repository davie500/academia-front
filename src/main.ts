import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router/Index'
import './assets/styles/index.css'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(Toast, { position: 'top-right', timeout: 3000 })

app.mount('#app')