<template>
  <div class="page">
    <div class="overlay"></div>

    <div class="content">
      <header class="header">
        <div>
          <h1>Meus Exercícios Salvos</h1>
          <p class="subtitle">Visualize todos os exercícios cadastrados na sua rotina de academia.</p>
        </div>

        <div class="search-wrap">
          <label class="search-input" aria-label="Pesquisar exercício">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21l-4.35-4.35" stroke="#9fb3d9" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="11" cy="11" r="5" stroke="#9fb3d9" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input
              v-model="search"
              placeholder="Pesquisar exercício..."
              type="search"
            />
          </label>
        </div>
      </header>

      <div v-if="loading" class="loading">Carregando exercícios...</div>
      <div v-else-if="error" class="error">Erro ao carregar: {{ error }}</div>
      <section v-else class="grid">
        <article
          class="card"
          v-for="(exercise, index) in paginatedExercises"
          :key="exercise.id || exercise.name || index"
          :style="{'--i': index}"
          role="article"
          aria-label="exercício"
        >
          <div class="card-top">
            <h2 class="exercise-name">{{ exercise.name }}</h2>
            <span class="group">{{ exercise.group }}</span>
          </div>

          <div class="card-mid">
            <span class="badge" aria-hidden="true">
              <svg class="trophy" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3h8v4a4 4 0 01-4 4 4 4 0 01-4-4V3z" stroke="#FFB020" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 7v2a5 5 0 005 5h6a5 5 0 005-5V7" stroke="#FFB020" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <strong>Maior carga:</strong>
              <span class="max">{{ exercise.max }}</span>
            </span>
          </div>

          <div class="card-actions">
            <button class="btn-primary" @click.prevent="openModal(exercise)">Ver mais</button>
          </div>
        </article>
      </section>

      <div v-if="!loading && !error" class="pagination-wrap">
        <div class="pagination-info">
          Mostrando <strong>{{ (filteredExercises.length === 0) ? 0 : ((currentPage-1)*perPage + 1) }}</strong>
          –
          <strong>{{ Math.min(currentPage*perPage, filteredExercises.length) }}</strong>
          de <strong>{{ filteredExercises.length }}</strong>
        </div>

        <nav class="pagination" aria-label="Paginação de exercícios">
          <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">◀</button>

          <button v-for="p in pagesToShow" :key="p" class="page-btn" :class="{active: p === currentPage}"
            @click="goToPage(p)">
            {{ p }}
          </button>

          <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">▶</button>
        </nav>
      </div>
    
      <!-- modal de detalhes -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal__content" style="text-align:left; align-items:flex-start;">
            <h2 class="modal__title">{{ selectedExercise?.name }}</h2>
            <p class="modal__message"><strong>Grupo:</strong> {{ selectedExercise?.group }}</p>
            <p class="modal__message"><strong>Membro do grupo:</strong> {{ selectedExercise?.raw?.membro_grupo || '—' }}</p>
            <p class="modal__message" style="margin-top:10px">{{ selectedExercise?.description || 'Sem descrição' }}</p>

            <div v-if="selectedExercise?.media_url" style="margin-top:14px; width:100%; display:flex; justify-content:center;">
              <img :src="mediaSrc(selectedExercise.media_url)" alt="execução" style="max-width:100%; border-radius:12px;" />
            </div>
          </div>

          <div class="modal__footer" style="margin-top:12px;">
            <button class="botao botao--secundario" @click="closeModal">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/controller/api"

export default {
  name: "SavedExercises",

  data() {
    return {
      search: "",
      exercises: [],
      loading: false,
      error: null,
      // paginação
      currentPage: 1,
      perPage: 24
      ,
      // modal
      showModal: false,
      selectedExercise: null
    }
  },

  async mounted() {
    this.loading = true
    this.error = null

    try {
      const res = await api.get("exercicios")
      const payload = res.data?.data ?? res.data

      this.exercises = (Array.isArray(payload) ? payload : []).map((item) => {
        const rawMax = item.carga_maxima ?? item.max ?? item.maior_carga ?? null
        let formattedMax = "—"

        if (rawMax !== null && rawMax !== undefined) {
          const num = Number(rawMax)
          if (!Number.isNaN(num)) {
            formattedMax = Number.isInteger(num) ? `${num}kg` : `${num}kg`
          } else {
            formattedMax = String(rawMax)
          }
        }

        return {
          id: item.id,
          name: item.nome || item.name || "Sem nome",
          group: item.grupo || item.membro_grupo || item.group || "Geral",
          description: item.descricao || "",
          media_url: item.media_url || null,
          max: formattedMax,
          raw: item
        }
      })
    } catch (err) {
      console.error("Erro ao buscar exercícios:", err)
      this.error = err?.response?.data?.message || err.message || "Erro desconhecido"
    } finally {
      this.loading = false
    }
  },

  methods: {
    goToPage(n) {
      const page = Number(n) || 1
      this.currentPage = Math.max(1, Math.min(page, this.totalPages))
      window.scrollTo({ top: 120, behavior: 'smooth' })
    },
    prevPage() { if (this.currentPage > 1) this.goToPage(this.currentPage - 1) },
    nextPage() { if (this.currentPage < this.totalPages) this.goToPage(this.currentPage + 1) }
    ,
    openModal(ex) {
      this.selectedExercise = ex
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedExercise = null
    }
    ,
    mediaSrc(path) {
      if (!path) return null
      // se já for URL absoluta, retorna direto
      if (/^https?:\/\//i.test(path)) return path

      // derive origin a partir do baseURL do axios (remove /api)
      const base = (api.defaults && api.defaults.baseURL) ? String(api.defaults.baseURL).replace(/\/api\/?$/i, '') : 'http://127.0.0.1:8000'
      return `${base.replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`
    }
  },

  watch: {
    // quando a lista filtrada muda, resetar a paginação para 1
    filteredExercises() {
      if (this.currentPage > this.totalPages) this.currentPage = 1
    }
  },

  computed: {
    filteredExercises() {
      const q = this.search.trim().toLowerCase()
      if (!q) return this.exercises
      return this.exercises.filter(e => (e.name || "").toLowerCase().includes(q))
    }
    ,
    totalPages() {
      return Math.max(1, Math.ceil((this.filteredExercises || []).length / this.perPage))
    },
    paginatedExercises() {
      const start = (this.currentPage - 1) * this.perPage
      return (this.filteredExercises || []).slice(start, start + this.perPage)
    },
    pagesToShow() {
      const total = this.totalPages
      const current = this.currentPage
      const maxButtons = 7
      if (total <= maxButtons) return Array.from({length: total}, (_, i) => i + 1)

      let start = Math.max(1, current - 3)
      let end = Math.min(total, start + maxButtons - 1)
      if (end - start < maxButtons - 1) start = Math.max(1, end - (maxButtons - 1))
      const pages = []
      for (let i = start; i <= end; i++) pages.push(i)
      return pages
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Segoe UI", sans-serif;
}

.page {
  position: relative;
  min-height: 100vh;
  background: url("https://images.unsplash.com/photo-1599058917765-a780eda07a3e") center/cover no-repeat;
  color: #e6eef8;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(3,6,20,0.6), rgba(3,6,20,0.75));
  backdrop-filter: blur(6px);
}

.content {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 56px 28px;
}

.header {
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

h1 {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.subtitle {
  margin-top: 8px;
  color: #9aa4c7;
  font-size: 14px;
}

.search-wrap {
  margin-top: 12px;
}

.search-input {
  display: inline-flex;
  align-items: center;
  background: rgba(12,18,32,0.6);
  border-radius: 14px;
  padding: 8px 12px;
  border: 1px solid rgba(255,255,255,0.04);
  transition: box-shadow 0.22s ease, border-color 0.22s ease;
}

.search-input:focus-within {
  box-shadow: 0 6px 22px rgba(20, 80, 160, 0.14);
  border-color: rgba(100,160,255,0.16);
}

.search-input input {
  background: transparent;
  border: none;
  color: #dce9ff;
  padding: 10px 10px 10px 8px;
  width: 340px;
  outline: none;
  font-size: 14px;
}

.search-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  opacity: 0.9;
}

.grid {
  display: grid;
  gap: 22px;
  margin-top: 32px;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 992px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1280px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}

.card {
  background: linear-gradient(180deg, #051227);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(3,8,20,0.6), 0 1px 0 rgba(255,255,255,0.02) inset;
  transition: transform 0.28s cubic-bezier(.2,.9,.3,1), box-shadow 0.28s, background 0.28s;
  opacity: 0;
  transform: translateY(8px);
  animation: fadeUp 420ms ease forwards;
  animation-delay: calc(var(--i) * 70ms);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 18px 40px #051227 inset;
  background: linear-gradient(180deg, #051227);
}

.card-top { margin-bottom: 12px; }

.exercise-name {
  font-size: 18px;
  font-weight: 800;
  color: #f3f8ff;
  margin-bottom: 6px;
}

.group {
  font-size: 13px;
  color: #93a7d7;
}

.card-mid { margin: 12px 0; }

.badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255,176,32,0.08);
  border: 1px solid rgba(255,176,32,0.16);
  color: #ffd39a;
  font-size: 13px;
}

.badge .trophy { width: 18px; height: 18px; }

.badge strong { font-weight: 700; color: #ffd39a; margin-right: 6px; }
.badge .max { color: #fff; margin-left: 4px; font-weight: 700; }

.card-actions { margin-top: 10px; }

.btn-primary {
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  background: linear-gradient(90deg, #ff6a52 0%, #ff3b7a 100%);
  box-shadow: 0 8px 20px rgba(255,80,110,0.12);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}

.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 36px rgba(255,72,120,0.14); }

@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}

/* small responsive tweaks */
@media (max-width: 520px) {
  .search-input input { width: 200px; }
  .content { padding: 36px 18px; }
  h1 { font-size: 26px; }
}

.loading,
.error {
  margin-top: 28px;
  color: #cfe4ff;
  background: rgba(8,12,22,0.45);
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.02);
}

.error { color: #ffd2d2; border-color: rgba(255,60,60,0.12); }

.pagination-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
}

.pagination-info { color: #9fb3d9; font-size: 13px; }

.pagination { display: flex; gap: 8px; align-items: center; }

.page-btn {
  min-width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255,255,255,0.03);
  color: #d8e9ff;
  border: 1px solid rgba(255,255,255,0.02);
  cursor: pointer;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  transition: transform 0.14s ease, background 0.14s ease;
}

.page-btn:hover { transform: translateY(-3px); background: rgba(255,255,255,0.04); }
.page-btn:disabled { opacity: 0.45; cursor: default; transform: none; }
.page-btn.active { background: linear-gradient(90deg,#3c6ef7,#6a9bff); box-shadow: 0 8px 20px rgba(60,110,247,0.12); color: white; }

/* Modal styles (copiado de PricingCard.vue para consistência) */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10001;
  padding: 16px;
  animation: fadeIn 0.18s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: rgba(6,10,20,0.96);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.04);
  max-width: 640px;
  width: 100%;
  padding: 22px 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: slideUp 0.26s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal__content { margin-bottom: 12px; width:100%; }
.modal__title { font-size: 20px; color: #f3f8ff; margin: 0 0 8px 0; font-weight: 800; }
.modal__message { font-size: 14px; color: #cfe4ff; margin: 4px 0; line-height: 1.5; }
.modal__footer { display: flex; gap: 12px; width: 100%; align-items: center; justify-content: center; margin-top: 8px; }

.botao { padding: 10px 18px; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.18s; display:inline-flex; align-items:center; justify-content:center; }
.botao--secundario { background: transparent; color: #cfe4ff; border: 1px solid rgba(255,255,255,0.04); }
.botao--secundario:hover { background: rgba(255,255,255,0.02); color: #fff; }
</style>