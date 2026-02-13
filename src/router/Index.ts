import { createRouter, createWebHistory} from 'vue-router';
import { useToast } from 'vue-toastification'
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login.vue';
import Planos from '../views/Planos.vue';
import Pagamento from '../views/Pagamento.vue';
import Treino from '../views/Treino.vue';
import Cadastro from '../views/Cadastro.vue';
import { useAuth } from '@/stores/auth';
import Anotacoes from '../views/Anotacoes.vue';
import Perfil from '../views/Perfil.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/login', name: 'Login', component: Login , meta: { hideNavbar: true }},
  { path: '/planos', name: 'Planos', component: Planos },
  { path: '/pagamento', name: 'Pagamento', component: Pagamento, meta: { hideNavbar: true, requiresAuth: true }},
  { path: '/treinos', name: 'Treino', component: Treino , meta: { requiresAuth: true }},
  { path: '/cadastro', name: 'Cadastro', component: Cadastro, meta: { hideNavbar: true } },
  { path: '/notas', name: 'Notas', component: Anotacoes, meta: { requiresAuth: true }},
  { path: '/perfil', name: 'Perfil', component: Perfil, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth()

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    const toast = useToast()
    toast.error('Você precisa estar logado')
    next('/login')
  } else {
    next()
  }
})

export default router;