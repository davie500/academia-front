<template>
  <div class="fundo"></div>
  <main class="admin">
    <header class="topbar">
      <div>
        <h1>Painel Admin</h1>
        <p>Gestao de usuarios e assinaturas.</p>
      </div>
    </header>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <section class="stats">
      <article class="card">
        <span class="label">Usuarios</span>
        <strong>{{ stats.total }}</strong>
      </article>
      <article class="card">
        <span class="label">Ativos</span>
        <strong>{{ stats.ativos }}</strong>
      </article>
      <article class="card">
        <span class="label">Pendentes</span>
        <strong>{{ stats.pendentes }}</strong>
      </article>
    </section>

    <section class="card filters">
      <input v-model="search" type="text" placeholder="Buscar por nome ou email" />
      <select v-model="statusFilter">
        <option value="">Todos os status</option>
        <option value="ativo">Ativo</option>
        <option value="pendente">Pendente</option>
        <option value="bloqueado">Bloqueado</option>
      </select>
    </section>

    <section class="card table-card">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Plano</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5" class="empty">Carregando usuários...</td>
          </tr>
          <tr v-else-if="filteredUsers.length === 0">
            <td colspan="5" class="empty">Nenhum usuario encontrado.</td>
          </tr>
          <tr v-for="user in paginatedUsers" v-else :key="user.id">
            <td>{{ user.nome }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.plano }}</td>
            <td>
              <span class="status" :class="user.status">{{ user.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    <div v-if="!loading && !error && totalPages > 1" class="pagination-wrap">
      <div class="pagination-info">
        Mostrando <strong>{{ filteredUsers.length === 0 ? 0 : ((page-1)*perPage + 1) }}</strong> –
        <strong>{{ Math.min(page*perPage, filteredUsers.length) }}</strong>
        de <strong>{{ filteredUsers.length }}</strong>
      </div>

      <nav class="pagination" aria-label="Paginação de usuários">
        <button class="page-btn" :disabled="page === 1" @click="prevPage">◀</button>
        <button v-for="p in pagesToShow" :key="p" class="page-btn" :class="{active: p === page}"
          @click="goToPage(p)">{{ p }}</button>
        <button class="page-btn" :disabled="page === totalPages" @click="nextPage">▶</button>
      </nav>
    </div>
    <LoadingOverlay :show="loading" message="Carregando usuários..." />
  </main>
</template>

<script setup>
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { computed, ref, onMounted, watch } from 'vue'
import api from '@/controller/api'

import { paginate, totalPages as calcTotalPages, pagesToShow as calcPagesToShow } from '@/lib/pagination'

const search = ref('')
const statusFilter = ref('')
const users = ref([])
const loading = ref(false)
const error = ref(null)

const page = ref(1)
const perPage = ref(10)

const getStatusFromUser = (user) => {
  if (user.deleted_at) return 'bloqueado'
  return 'ativo'
}

const getPlanoName = (user) => {
  if (!user.assinatura) return '—'
  if (user.assinatura.plano && user.assinatura.plano.nome) {
    return user.assinatura.plano.nome
  }
  return '—'
}

const loadUsers = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('usuarios/all')
    const data = Array.isArray(response.data) ? response.data : response.data?.data || []
    
    users.value = data.map((u) => ({
      id: u.id,
      nome: u.nome || 'Sem nome',
      email: u.email || '—',
      plano: getPlanoName(u),
      status: getStatusFromUser(u)
    }))
  } catch (err) {
    console.error('Erro ao carregar usuários:', err)
    error.value = 'Falha ao carregar usuários'
  } finally {
    loading.value = false
  }
}

const filteredUsers = computed(() => {
  const term = search.value.trim().toLowerCase()
  return users.value.filter((u) => {
    const matchText =
      !term || u.nome.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    const matchStatus = !statusFilter.value || u.status === statusFilter.value
    return matchText && matchStatus
  })
})

watch(filteredUsers, () => {
  if (page.value > totalPages.value) page.value = 1
})

const totalPages = computed(() => calcTotalPages(filteredUsers.value.length, perPage.value))
const paginatedUsers = computed(() => paginate(filteredUsers.value, page.value, perPage.value))
const pagesToShow = computed(() => calcPagesToShow(totalPages.value, page.value))

function prevPage() {
  if (page.value > 1) page.value--
}

function nextPage() {
  if (page.value < totalPages.value) page.value++
}

function goToPage(p) {
  if (p >= 1 && p <= totalPages.value) page.value = p
}

const stats = computed(() => ({
  total: users.value.length,
  ativos: users.value.filter((u) => u.status === 'ativo').length,
  pendentes: users.value.filter((u) => u.status === 'pendente').length
}))

const handleRefresh = () => {
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>

.admin {
  padding: 24px;
  background-image: url('/assets/fundo.png');
  color: var(--color-text-white);
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.topbar h1 {
  margin: 0;
  font-size: 28px;
}

.topbar p {
  color: var(--color-text-secondary);
}

.topbar-actions {
  display: flex;
  gap: 8px;
}

.btn {
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
  color: #101010;
}

.btn.ghost {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--color-text-primary);
}

.error-message {
  background: rgba(239, 68, 68, 0.14);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 12px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.card {
  background: var(--color-bg-card);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px;
}

.label {
  display: block;
  color: var(--color-text-secondary);
  font-size: 13px;
  margin-bottom: 6px;
}

.card strong {
  font-size: 26px;
}

.filters {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 10px;
  margin-bottom: 12px;
}

.filters input,
.filters select {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.25);
  color: var(--color-text-white);
  border-radius: 8px;
  padding: 10px 12px;
}

.table-card {
  overflow-x: auto;
  padding: 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

th,
td {
  text-align: left;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

th {
  color: var(--color-text-secondary);
  font-size: 12px;
  text-transform: uppercase;
}

.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: capitalize;
}

.status.ativo {
  color: #10b981;
  background: rgba(16, 185, 129, 0.14);
}

.status.pendente {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.14);
}

.status.bloqueado {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.14);
}

.empty {
  text-align: center;
  color: var(--color-text-secondary);
}

.pagination-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
}

.pagination-info { color: #94a3b8; font-size: 13px; }

.pagination { display: flex; gap: 8px; align-items: center; }

.page-btn {
  min-width: 38px;
  height: 38px;
  border-radius: 8px;
  background: #1a1f2e;
  color: #cbd5e1;
  border: 1px solid #4b5563;
  cursor: pointer;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  transition: transform 0.14s ease, background 0.14s ease, border-color 0.14s ease;
}

.page-btn:hover { transform: translateY(-2px); background: #262d3a; border-color: #ff7f00; }
.page-btn:disabled { opacity: 0.45; cursor: default; transform: none; }
.page-btn.active { background: linear-gradient(135deg, #ff7f00, #ff0000); box-shadow: 0 8px 20px rgba(255, 127, 0, 0.3); color: white; border-color: transparent; }

@media (max-width: 800px) {
  .admin {
    padding: 16px;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .filters {
    grid-template-columns: 1fr;
  }
}
</style>