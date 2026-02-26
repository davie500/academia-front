<template>
    <div class="fundo"></div>

  <section class="historico-pagamentos">

    <header class="page-header">
      <h1>Histórico de Pagamentos</h1>
      <p class="page-subtitle">Acompanhe todos os seus pagamentos e transações</p>
    </header>


    <div class="summary-cards">
      <div class="card">
        <div class="card-content">
          <div class="card-info">
            <span class="card-label">Total Pago</span>
            <span class="card-value">R$ {{ totalPaid.toFixed(2) }}</span>
            <span class="card-secondary">Todos os registros</span>
          </div>
          <div class="card-icon"></div>
        </div>
      </div>



      <div class="card">
        <div class="card-content">
          <div class="card-info">
            <span class="card-label">Status</span>
            <span class="card-value">{{ statusPercent }}%</span>
            <span class="card-secondary">Pagamentos em dia</span>
          </div>
          <div class="card-icon"></div>
        </div>
      </div>
    </div>

    <div class="filters">
      <div class="filter-item search">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por descrição ou ID..."
        />
        <span class="icon"></span>
      </div>
      <div class="filter-item">
        <select v-model="statusFilter">
          <option value="">Todos os status</option>
          <option value="approved">Concluído</option>
          <option value="pending">Pendente</option>
          <option value="failed">Falhou</option>
        </select>
      </div>
      <div class="filter-item">
        <select v-model="methodFilter">
          <option value="">Todos os métodos</option>
          <option value="cartao-credit">Cartão de Crédito</option>
          <option value="pix">PIX</option>
          <option value="boleto">Boleto</option>
        </select>
      </div>
      <div class="filter-item">
        <button @click.prevent>Filtrar</button>
      </div>
    </div>

    <div class="table-wrapper">
      <div v-if="loading" class="loading">Carregando pagamentos...</div>
      <div v-if="error" class="error">{{ error }}</div>
      <table v-if="!loading && !error" class="payments-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Período</th>
            <th>Descrição</th>
            <th>Método</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in pagedPayments" :key="p.id">
            <td>{{ p.id }}</td>
            <td>{{ new Date(p.created_at).toLocaleDateString() }}</td>
            <td>{{ p.periodo?.nome || "-" }}</td>
            <td>{{ p.plano?.nome || "-" }}</td>
            <td>{{ p.metodo || "-" }}</td>
            <td>R$ {{ parseFloat(p.valor).toFixed(2) }}</td>
            <td>
              <span
                class="badge"
                :class="statusMap[p.status]?.type || ''"
              >
                {{ statusMap[p.status]?.label || p.status }}
              </span>
            </td>
          </tr>
          <tr v-if="!filteredPayments.length" class="no-data-row">
            <td :colspan="7" class="no-data">Nenhum pagamento efetuado ainda.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">‹</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">›</button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../controller/api";

const payments = ref([]);
const loading = ref(false);
const error = ref(null);

const searchTerm = ref("");
const statusFilter = ref("");
const methodFilter = ref("");

const statusMap = {
  approved: { label: "Concluído", type: "completed" },
  pending: { label: "Pendente", type: "pending" },
  failed: { label: "Falhou", type: "failed" },
};

async function loadPayments() {
  loading.value = true;
  error.value = null;
  try {
    const resp = await api.get("/pagamentos/meus");
    payments.value = Array.isArray(resp.data) ? resp.data : [resp.data];
  } catch (e) {
    console.error(e);
    error.value = "Não foi possível carregar os pagamentos.";
  } finally {
    loading.value = false;
  }
}

onMounted(loadPayments);


const totalPaid = computed(() =>
  payments.value.reduce((sum, p) => sum + parseFloat(p.valor || 0), 0)
);


const filteredPayments = computed(() => {
  return payments.value.filter((p) => {
    const term = searchTerm.value.toLowerCase();
    let matches = true;
    if (term) {
      const text = `${p.id} ${p.plano?.nome || ""}`.toLowerCase();
      matches = text.includes(term);
    }
    if (matches && statusFilter.value) {
      matches = p.status === statusFilter.value;
    }
    if (matches && methodFilter.value) {
      matches = p.metodo === methodFilter.value;
    }
    return matches;
  });
});

const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = computed(() => Math.ceil(filteredPayments.value.length / pageSize.value));
const pagedPayments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredPayments.value.slice(start, start + pageSize.value);
});

function goToPage(n) {
  if (n < 1) n = 1;
  if (n > totalPages.value) n = totalPages.value;
  currentPage.value = n;
}

import { watch } from "vue";
watch([searchTerm, statusFilter, methodFilter], () => {
  currentPage.value = 1;
});


const statusPercent = computed(() => {
  if (!payments.value.length) return 0;
  const completed = payments.value.filter((p) => p.status === "approved");
  return Math.round((completed.length / payments.value.length) * 100);
});

</script>

<style scoped>

.fundo {
    width: 100%;
    height: 100vh;
    background-image: url('/assets/fundo.png');
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    filter: brightness(0.5);
    backdrop-filter: blur(5px);
}

.fundo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2); 
  backdrop-filter: blur(5px);      
}

.historico-pagamentos {
  padding: 1rem;
  color: var(--color-text-primary);
  background: var(--color-bg-card);
}

.page-header h1 {
  margin: 0;
  font-size: 1.75rem;
  color: var(--color-primary);
}

.page-subtitle {
  margin-top: 0.25rem;
  color: var(--color-text-secondary);
}


.summary-cards {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}
.card {
  flex: 1 1 200px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 1rem;
  box-shadow: var(--card-shadow, 0 1px 3px rgba(0,0,0,.1));
}
.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-info {
  display: flex;
  flex-direction: column;
}
.card-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
.card-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-primary);
}
.card-secondary {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}
.card-icon {
  font-size: 1.75rem;
  color: var(--color-primary, inherit);
}

.filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 1rem;
}
.filter-item {
  position: relative;
}
.filter-item.search {
  flex: 2 1 250px;
}
.filter-item input,
.filter-item select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-bg-card);
  color: var(--color-text-primary);
}
.filter-item input:focus,
.filter-item select:focus {
  border-color: var(--color-primary);
  outline: none;
}
.filter-item .icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--color-text-secondary);
}
.filter-item button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: var(--color-primary);
  color: var(--color-text-white);
  cursor: pointer;
  transition: var(--transition-base);
}
.filter-item button:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.table-wrapper {
  overflow-x: auto;
  position: relative;
}

.historico-pagamentos {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.table-wrapper {
  flex: 1 1 auto;
  overflow: auto;
}
.table-wrapper .loading,
.table-wrapper .error {
  padding: 1rem;
  text-align: center;
  color: var(--color-text-secondary);
}
.payments-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}
.payments-table tbody tr:hover {
  background: var(--hover-bg);
}
.payments-table th,
.payments-table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
  color: var(--color-text-primary);
  min-width: 120px; 
}
.no-data-row td.no-data {
  text-align: center;
  padding: 2rem 0;
  color: var(--color-text-secondary);
  font-style: italic;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
.pagination button {
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  cursor: pointer;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pagination span {
  color: var(--color-text-primary);
}
.payments-table th {
  font-weight: 600;
  background: var(--color-bg-card);
  color: var(--color-text-primary, inherit);
}
.payments-table thead th {
  background: var(--color-bg-card);
  position: sticky;
  top: 0;
  z-index: 1;
}
.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--color-text-white);
}
.badge.completed {
  background: var(--color-primary);
}
.badge.pending {
  background: var(--color-secondary);
}
.badge.failed {
  background: var(--color-secondary-dark);
}
.badge {
  display: inline-block;
  min-width: 60px;
  text-align: center;
}

@media (max-width: 768px) {
  .summary-cards {
    flex-direction: column;
  }
  .filters {
    flex-direction: column;
  }
  .filter-item {
    width: 100%;
  }
}

@media (max-width: 320px) {
  .page-header h1,
  .page-subtitle {
    text-align: left;
  }

  .summary-cards {
    flex-direction: column;
    gap: 0.75rem;
  }
  .card {
    flex: 0 0 100%;
    width: 100%;
  }
  .card-value {
    font-size: 1rem;
  }

  .filters {
    flex-direction: column;
    gap: 0.5rem;
  }
  .filter-item {
    width: 100%;
  }
  .filter-item button {
    width: 100%;
  }

  .table-wrapper {
    overflow-x: auto;
  }
  .payments-table {
    min-width: 600px;
  }
  .payments-table th,
  .payments-table td {
    font-size: 0.8rem;
  }

  .badge {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
    min-width: auto;
  }
}

@media (min-width: 321px) and (max-width: 375px) {
  .summary-cards {
    flex-direction: column;
    gap: 1rem;
  }
  .filters {
    flex-direction: column;
    gap: 0.75rem;
  }
  .filter-item {
    width: 100%;
  }
  .filter-item button {
    width: 100%;
    margin-top: 0.25rem;
  }
  .table-wrapper {
    overflow-x: auto;
  }
}

@media (min-width: 376px) and (max-width: 425px) {
  .summary-cards {
    flex-direction: column;
    gap: 1rem;
  }
  .filters {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .filter-item.search {
    flex: 0 0 100%;
  }
  .filter-item:not(.search) {
    flex: 1 1 calc(50% - 0.5rem);
  }
  .filter-item button {
    align-self: flex-end;
    width: auto;
  }
  .table-wrapper {
    overflow-x: auto;
  }
}

@media (min-width: 426px) and (max-width: 768px) {
  .summary-cards {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .card {
    flex: 0 0 calc(50% - 0.5rem);
    width: calc(50% - 0.5rem);
  }

  .filters {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  .filter-item.search {
    flex: 0 0 100%;
  }
  .filter-item {
  }
  .filter-item button {
    align-self: flex-end;
  }

  .table-wrapper {
    overflow-x: auto;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .summary-cards {
    flex-wrap: nowrap;
    gap: 1rem;
  }
  .card {
    flex: 0 0 45%;
    width: 45%;
  }
  .filters {
    flex-wrap: nowrap;
    gap: 1rem;
    align-items: center;
  }
  .filter-item {
    flex: 1 1 auto;
  }
  .filter-item.search {
    flex: 2 1 auto;
  }
  .table-wrapper {
    overflow-x: visible;
  }
  .payments-table {
    min-width: auto;
  }
}

@media (min-width: 1025px) {
  .summary-cards {
    flex-wrap: nowrap;
    gap: 1rem;
  }
  .filters {
    flex-wrap: nowrap;
    gap: 1rem;
    align-items: center;
  }
}

</style>
