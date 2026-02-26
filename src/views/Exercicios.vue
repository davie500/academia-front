<template>
  <div class="page">
    <LoadingOverlay :show="loading" message="Carregando exercícios..." />
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
              <button class="badge__edit-btn" @click.prevent="openEditCargaModal(exercise)" title="Editar carga máxima">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </span>
          </div>

          <div class="card-actions">
            <button v-if="canViewDetails" class="btn-primary" @click.prevent="openModal(exercise)">Ver mais</button>
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
          <div class="modal__header">
            <h2 class="modal__title">{{ selectedExercise?.name }}</h2>
            <button class="modal__close" @click="closeModal" aria-label="Fechar modal">✕</button>
          </div>
          
          <div class="modal__content">
            <div class="modal__info">
              <p class="modal__message"><strong>Grupo:</strong> {{ selectedExercise?.group }}</p>
              <p class="modal__message"><strong>Membro do grupo:</strong> {{ selectedExercise?.raw?.membro_grupo || '—' }}</p>
              <p class="modal__message modal__description">{{ selectedExercise?.description || 'Sem descrição' }}</p>
            </div>

            <div v-if="selectedExercise?.media_url" class="modal__media-wrapper">
              <!-- se houver mídia, renderiza a imagem com alt vazio para não exibir texto algum -->
              <img :src="mediaSrc(selectedExercise.media_url)" alt="" class="modal__image" />
            </div>
          </div>

          <div class="modal__footer">
            <button class="botao botao--secundario" @click="closeModal">Fechar</button>
          </div>
        </div>
      </div>

      <!-- modal de editar carga máxima -->
      <div v-if="showEditCargaModal" class="modal-overlay" @click.self="closeEditCargaModal">
        <div class="modal modal--small">
          <div class="modal__header">
            <h2 class="modal__title">Atualizar Carga Máxima</h2>
            <button class="modal__close" @click="closeEditCargaModal" aria-label="Fechar modal">✕</button>
          </div>
          
          <div class="modal__content">
            <div class="edit-carga__group">
              <label class="edit-carga__label">Exercício: <span class="edit-carga__value">{{ exerciseToEdit?.name }}</span></label>
            </div>
            
            <div class="edit-carga__group">
              <label for="new-carga" class="edit-carga__label">Nova Carga (kg):</label>
              <input 
                v-model.number="newCargaValue" 
                id="new-carga"
                type="number" 
                placeholder="Ex: 20" 
                class="edit-carga__input"
                min="0"
                step="0.5"
              />
            </div>
          </div>

          <div class="modal__footer">
            <button class="botao botao--secundario" @click="closeEditCargaModal">Cancelar</button>
            <button class="botao botao--primary" @click="updateCargaMaxima" :disabled="updatingCarga">
              {{ updatingCarga ? 'Atualizando...' : 'Atualizar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/controller/api"
import LoadingOverlay from "@/components/LoadingOverlay.vue"
import { useToast } from 'vue-toastification'
import { useAuth } from '@/stores/auth'

export default {
  name: "SavedExercises",
  components: {
    LoadingOverlay
  },

  data() {
    return {
      search: "",
      exercises: [],
      loading: false,
      error: null,
      currentPage: 1,
      perPage: 12,
      showModal: false,
      selectedExercise: null,
      toast: null,
      showEditCargaModal: false,
      exerciseToEdit: null,
      newCargaValue: null,
      updatingCarga: false
    }
  },

  async mounted() {
    this.loading = true
    this.error = null

    // inicializa toast para notificações
    try {
      this.toast = useToast()
    } catch (err) {
      console.warn('falha ao inicializar toast', err)
    }

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
    },
    openEditCargaModal(ex) {
      this.exerciseToEdit = ex
      this.newCargaValue = null
      this.showEditCargaModal = true
    },
    closeEditCargaModal() {
      this.showEditCargaModal = false
      this.exerciseToEdit = null
      this.newCargaValue = null
      this.updatingCarga = false
    },
    async updateCargaMaxima() {
      if (!this.newCargaValue || this.newCargaValue < 0 || !this.exerciseToEdit?.id) {
        this.toast?.error('Por favor, insira um valor válido de carga')
        return
      }

      this.updatingCarga = true
      try {
        await api.post(`exercicio/carga-maxima`, {
          carga_maxima: this.newCargaValue,
          exercicio_id: this.exerciseToEdit.id
        })

        const exerciseIndex = this.exercises.findIndex(e => e.id === this.exerciseToEdit.id)
        if (exerciseIndex !== -1) {
          this.exercises[exerciseIndex].max = `${this.newCargaValue}kg`
        }

        this.closeEditCargaModal()
        this.toast?.success('Carga máxima atualizada com sucesso!')
      } catch (err) {
        console.error('Erro ao atualizar carga:', err)
        this.toast?.error(err?.response?.data?.message || 'Erro ao atualizar carga máxima')
      } finally {
        this.updatingCarga = false
      }
    },
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
    userNivel() {
      const auth = useAuth()
      return auth.nivel || 0
    },

    canViewDetails() {
      return this.userNivel >= 2
    },
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
  background: url("/assets/fundo.png") center/cover no-repeat;
  background-color: #0f1419;
  color: #cbd5e1;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15,20,25,0.7), rgba(0,0,0,0.8));
  backdrop-filter: blur(4px);
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
  color: #ffffff;
  background: linear-gradient(135deg, #ff7f00, #ff0000);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  margin-top: 8px;
  color: #94a3b8;
  font-size: 14px;
}

.search-wrap {
  margin-top: 12px;
}

.search-input {
  display: inline-flex;
  align-items: center;
  background: rgba(26,31,46,0.8);
  border-radius: 12px;
  padding: 10px 14px;
  border: 1px solid #4b5563;
  transition: box-shadow 0.22s ease, border-color 0.22s ease;
}

.search-input:focus-within {
  box-shadow: 0 6px 22px rgba(255, 127, 0, 0.12);
  border-color: #ff7f00;
}

.search-input input {
  background: transparent;
  border: none;
  color: #cbd5e1;
  padding: 8px 10px;
  width: 340px;
  outline: none;
  font-size: 14px;
}

.search-input input::placeholder {
  color: #94a3b8;
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
  grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
}

.card {
  background: linear-gradient(135deg, #1a1f2e 0%, #262d3a 100%);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #4b5563;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  transition: transform 0.28s cubic-bezier(.2,.9,.3,1), box-shadow 0.28s, border-color 0.28s;
  opacity: 0;
  transform: translateY(8px);
  animation: fadeUp 420ms ease forwards;
  animation-delay: calc(var(--i) * 70ms);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(255, 127, 0, 0.15);
  border-color: #ff7f00;
}

.card-top { margin-bottom: 12px; }

.exercise-name {
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 6px;
}

.group {
  font-size: 13px;
  color: #94a3b8;
}

.card-mid { margin: 12px 0; }

.badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(255, 127, 0, 0.1);
  border: 1px solid rgba(255, 127, 0, 0.3);
  color: #ffb366;
  font-size: 13px;
  font-weight: 600;
  position: relative;
}

.badge .trophy { width: 18px; height: 18px; color: #ff7f00; }

.badge strong { font-weight: 700; color: #ff7f00; margin-right: 4px; }
.badge .max { color: #ffffff; margin-left: 4px; font-weight: 700; }

.badge__edit-btn {
  background: transparent;
  border: none;
  color: #ffb366;
  width: 20px;
  height: 20px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.18s ease, transform 0.18s ease;
  margin-left: 6px;
  flex-shrink: 0;
}

.badge__edit-btn:hover {
  color: #ff7f00;
  transform: scale(1.1);
}

.badge__edit-btn svg {
  width: 16px;
  height: 16px;
}

.card-actions { margin-top: 10px; }

.btn-primary {
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 700;
  background: linear-gradient(135deg, #ff7f00 0%, #ff0000 100%);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}

.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(255, 0, 0, 0.4); }

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
  color: #cbd5e1;
  background: rgba(26,31,46,0.6);
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #4b5563;
}

.error { color: #ff9999; border-color: rgba(255,0,0,0.2); }

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
  overflow-y: auto;
  animation: fadeIn 0.18s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: rgba(26,31,46,0.96);
  border-radius: 12px;
  border: 1px solid #4b5563;
  max-width: 95vw;
  max-height: 90vh;
  width: 100%;
  padding: 0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.26s ease-out;
  overflow: hidden;
}

.modal--small {
  max-width: 480px;
  max-height: auto;
}

@media (min-width: 640px) {
  .modal {
    max-width: 640px;
  }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal__content { margin-bottom: 12px; width:100%; }
.modal__title { font-size: 20px; color: #ffffff; margin: 0 0 8px 0; font-weight: 800; }
.modal__message { font-size: 14px; color: #cbd5e1; margin: 4px 0; line-height: 1.5; }
.modal__footer { display: flex; gap: 12px; width: 100%; align-items: center; justify-content: center; margin-top: 8px; }

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 18px;
  border-bottom: 1px solid #4b5563;
  flex-shrink: 0;
}

.modal__title {
  font-size: 20px;
  color: #ffffff;
  margin: 0;
  font-weight: 800;
  flex: 1;
  text-align: left;
}

.modal__close {
  background: transparent;
  border: none;
  color: #cbd5e1;
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.18s ease;
  margin-left: 12px;
  flex-shrink: 0;
}

.modal__close:hover {
  color: #ff7f00;
}

.modal__content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal__info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal__message {
  font-size: 14px;
  color: #cbd5e1;
  margin: 0;
  line-height: 1.5;
  text-align: left;
}

.modal__description {
  margin-top: 8px;
  color: #94a3b8;
  padding-top: 8px;
  border-top: 1px solid #4b5563;
}

.modal__media-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 80px;
  max-height: 250px;
  flex-shrink: 0;
}

.modal__image {
  max-width: 90%;
  max-height: 250px;
  width: auto;
  height: auto;
  border-radius: 8px;
  object-fit: contain;
}

@media (max-width: 768px) {
  .modal__media-wrapper {
    max-height: 200px;
  }
  
  .modal__image {
    max-height: 200px;
  }
}

@media (max-width: 520px) {
  .modal__media-wrapper {
    max-height: 160px;
  }
  
  .modal__image {
    max-height: 160px;
    max-width: 85%;
  }
}

.modal__footer {
  display: flex;
  gap: 12px;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 16px 18px;
  border-top: 1px solid #4b5563;
  flex-shrink: 0;
  background: rgba(0,0,0,0.2);
}

.botao { padding: 10px 18px; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.18s; display:inline-flex; align-items:center; justify-content:center; }
.botao--secundario { background: transparent; color: #cbd5e1; border: 1px solid #4b5563; }
.botao--secundario:hover { background: rgba(255,127,0,0.1); color: #ffffff; border-color: #ff7f00; }
.botao--primary { background: linear-gradient(135deg, #ff7f00, #ff0000); color: #ffffff; border: none; }
.botao--primary:hover:not(:disabled) { box-shadow: 0 8px 20px rgba(255, 127, 0, 0.3); transform: translateY(-2px); }
.botao--primary:disabled { opacity: 0.6; cursor: not-allowed; }

.edit-carga__group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-carga__label {
  font-size: 14px;
  font-weight: 600;
  color: #cbd5e1;
}

.edit-carga__value {
  color: #ff7f00;
  font-weight: 700;
}

.edit-carga__input {
  padding: 10px 12px;
  border: 1px solid #4b5563;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  color: #ffffff;
  font-size: 14px;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.edit-carga__input:focus {
  outline: none;
  border-color: #ff7f00;
  box-shadow: 0 0 8px rgba(255, 127, 0, 0.2);
}

.edit-carga__input::placeholder {
  color: #94a3b8;
}

.modal__media {
  margin-top: 14px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal__image {
  max-width: 90%;
  max-height: 250px;
  width: auto;
  height: auto;
  border-radius: 8px;
  object-fit: contain;
}

@media (max-width: 768px) {
  .modal__image {
    max-height: 200px;
  }
}

@media (max-width: 520px) {
  .modal__image {
    max-height: 160px;
    max-width: 85%;
  }
}
</style>