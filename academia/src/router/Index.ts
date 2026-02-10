import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Planos from '../views/Planos.vue'
import Treinos from '../views/Treinos.vue'
import Anotacoes from '../views/Anotacoes.vue'
import Cadastro from '../views/Cadastro.vue'
import Pagamento from '../views/Pagamento.vue'
import Perfil from '../views/Perfil.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/login', name: 'Login', component: Login },
  { path: '/planos', name: 'Planos', component: Planos },
  { path: '/treinos', name: 'Treinos', component: Treinos },
  { path: '/notas', name: 'Notas', component: Anotacoes },
  { path: '/cadastro', name: 'Cadastro', component: Cadastro },
  { path: '/pagamento', name: 'Pagamento', component: Pagamento },
  { path: '/perfil', name: 'Perfil', component: Perfil },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router