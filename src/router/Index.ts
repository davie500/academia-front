import { createRouter, createWebHistory} from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login.vue';
import Planos from '../views/Planos.vue';
import Pagamento from '../views/Pagamento.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/login', name: 'Login', component: Login },
  { path: '/planos', name: 'Planos', component: Planos }
  ,{ path: '/pagamento', name: 'Pagamento', component: Pagamento }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;