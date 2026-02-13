import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Planos from '../views/Planos.vue'
import Treinos from '../views/Treinos.vue'
import Anotacoes from '../views/Anotacoes.vue'
import Cadastro from '../views/Cadastro.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/login', name: 'Login', component: Login },
  // { path: '/planos', name: 'Planos', component: Planos },
  { path: '/trainers' , name: 'Treinadores', component: Treinadores },
  { path: '/notes', name: 'Notas', component: Anotacoes },
  { path: '/cadastro', name: 'Cadastro', component: Cadastro },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router