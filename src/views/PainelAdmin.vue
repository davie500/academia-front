<template>
  <main class="admin">
    <header class="topbar">
      <div>
        <h1>Painel Admin</h1>
        <p>Gestao de usuarios e assinaturas.</p>
      </div>
      <div class="topbar-actions">
        <button type="button" class="btn ghost">Atualizar</button>
        <button type="button" class="btn primary">Novo Usuario</button>
      </div>
    </header>

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
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Plano</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>#{{ user.id }}</td>
            <td>{{ user.nome }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.plano }}</td>
            <td>
              <span class="status" :class="user.status">{{ user.status }}</span>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="empty">Nenhum usuario encontrado.</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'

const search = ref('')
const statusFilter = ref('')

const users = ref([
  { id: 1, nome: 'Ana Paula', email: 'ana@email.com', plano: 'Mensal', status: 'ativo' },
  { id: 2, nome: 'Lucas Lima', email: 'lucas@email.com', plano: 'Trimestral', status: 'pendente' },
  { id: 3, nome: 'Marina Souza', email: 'marina@email.com', plano: 'Anual', status: 'ativo' },
  { id: 4, nome: 'Pedro Nunes', email: 'pedro@email.com', plano: 'Mensal', status: 'bloqueado' }
])

const filteredUsers = computed(() => {
  const term = search.value.trim().toLowerCase()
  return users.value.filter((u) => {
    const matchText =
      !term || u.nome.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    const matchStatus = !statusFilter.value || u.status === statusFilter.value
    return matchText && matchStatus
  })
})

const stats = computed(() => ({
  total: users.value.length,
  ativos: users.value.filter((u) => u.status === 'ativo').length,
  pendentes: users.value.filter((u) => u.status === 'pendente').length
}))
</script>

<style scoped>
.admin {
  padding: 24px;
  background: linear-gradient(180deg, var(--color-bg-dark), var(--color-bg-darker));
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
