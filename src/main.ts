import { createApp } from 'vue'
import App from './App.vue'
import router from './router/Index'
import './assets/styles/index.css'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

createApp(App)
    .use(router)
    .use(Toast, { position: 'top-right', timeout: 3000 })
    .mount('#app')