import { createRouter, createWebHistory } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuth } from '@/stores/auth'

import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import Planos from '../views/Planos.vue'
import Pagamento from '../views/Pagamento.vue'
import Treino from '../views/Treino.vue'
import Cadastro from '../views/Cadastro.vue'
import Anotacoes from '../views/Anotacoes.vue'
import Perfil from '../views/Perfil.vue'
import NotFound from '../views/NotFound.vue'
import exercicios from '@/views/exercicios.vue'
import Admin from '../views/PainelAdmin.vue'
import HistoricoPagamento from '../views/HistoricoPagamento.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/login', name: 'Login', component: Login, meta: { hideNavbar: true } },
  { path: '/planos', name: 'Planos', component: Planos },
  { path: '/pagamento', name: 'Pagamento', component: Pagamento, meta: { hideNavbar: true, requiresAuth: true } },
  { path: '/treinos', name: 'Treino', component: Treino, meta: { requiresAuth: true, requiredLevel: 1 } },
  { path: '/cadastro', name: 'Cadastro', component: Cadastro, meta: { hideNavbar: true } },
  { path: '/notas', name: 'Notas', component: Anotacoes, meta: { requiresAuth: true, requiredLevel: 1 } },
  { path: '/perfil', name: 'Perfil', component: Perfil, meta: { requiresAuth: true } },
  { path: '/exercicios', name: 'Exercicios', component: exercicios, meta: { requiresAuth: true, requiredLevel: 1 } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { hideNavbar: true } },
  { path: '/admin', name: 'Admin', component: Admin, meta: { requiresAdmin: true } },
  { path: '/historico', name: 'Historico', component: HistoricoPagamento, meta: { requiresAuth: true} },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuth()
  const toast = useToast()

  const publicPaths = ['/', '/planos', '/login', '/cadastro']
  if (!auth.token && !publicPaths.includes(to.path)) {
    return next({ name: 'NotFound' })
  }

  if (to.meta.requiresAuth && !auth.token) {
    toast.error('Você precisa estar logado')
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  if (typeof to.meta.requiredLevel === 'number' && !auth.admin) {
    if ((auth.nivel ?? 0) < to.meta.requiredLevel) {
      toast.error('Seu plano não permite acessar esta página')
      return next('/planos')
    }
  }

  if (to.meta.requiresAdmin && !auth.admin) {
    toast.error('Área reservada a administradores')
    return next('/')
  }

  next()
})

export default router