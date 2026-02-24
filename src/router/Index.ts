import { createRouter, createWebHistory } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuth } from '@/stores/auth'

import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Planos from '../views/Planos.vue'
import Treinos from '../views/Treinos.vue'
import Anotacoes from '../views/Anotacoes.vue'
import Cadastro from '../views/Cadastro.vue'
import Pagamento from '../views/Pagamento.vue'
import Perfil from '../views/Perfil.vue'
import Admin from '../views/PainelAdmin.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/login', name: 'Login', component: Login, meta: { hideNavbar: true }},
  { path: '/planos', name: 'Planos', component: Planos },
  { path: '/pagamento', name: 'Pagamento', component: Pagamento, meta: { hideNavbar: true, requiresAuth: true }},
  { path: '/treinos', name: 'Treino', component: Treinos, meta: { requiresAuth: true }},
  { path: '/cadastro', name: 'Cadastro', component: Cadastro, meta: { hideNavbar: true } },
  { path: '/notas', name: 'Notas', component: Anotacoes, meta: { requiresAuth: true }},
  { path: '/perfil', name: 'Perfil', component: Perfil, meta: { requiresAuth: true } },
  { path: '/admin', name: 'Admin', component: Admin }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuth()
  const toast = useToast()

  if (to.meta.requiresAuth && !auth.token) {
    toast.error('Você precisa estar logado')
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  if (typeof to.meta.requiredLevel === 'number') {
    if ((auth.nivel ?? 0) < to.meta.requiredLevel) {
      toast.error('Seu plano não permite acessar esta página')
      return next('/planos')
    }
  }

  next()
})

export default router