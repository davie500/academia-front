import { createRouter, createWebHistory} from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login.vue';
import Planos from '../views/Planos.vue';
import Pagamento from '../views/Pagamento.vue';
import Treino from '../views/Treino.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/login', name: 'Login', component: Login },
  { path: '/planos', name: 'Planos', component: Planos },
  { path: '/pagamento', name: 'Pagamento', component: Pagamento, meta: { hideNavbar: true } },
  { path: '/treinos', name: 'Treino', component: Treino }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;