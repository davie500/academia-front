import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Treinadores from '../views/Treinadores.vue'
import Anotacoes from '../views/Anotacoes.vue'
import Cadastro from '../views/Cadastro.vue'
import PerfilUsuario from '../views/Perfil.usuario.vue'
import Planos from '@/views/Planos.vue'


const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/login', name: 'Login', component: Login },
  { path: '/planos', name: 'Planos', component: Planos },
  { path: '/trainers' , name: 'Treinadores', component: Treinadores },
  { path: '/notes', name: 'Notas', component: Anotacoes },
  { path: '/cadastro', name: 'Cadastro', component: Cadastro },
  { path: '/perfil',component: PerfilUsuario },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router