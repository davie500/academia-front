<template>
  <div class="fundo"></div>
  <div class="page">
    <div class="container">
      <div v-if="notes.length === 0" class="empty-state">
        <div class="empty-card">
          <div class="empty-illustration"></div>
          <p class="empty-message">Nenhuma anotação ainda</p>
          <button class="new-note2" @click="openNew">Nova Anotação</button>
        </div>
      </div>

      <div v-else class="with-notes">
        <header class="notes-header">
          <div class="title-wrap">
            <span class="icon">•</span>
            <div>
              <h1 class="page-title">Minhas Anotações</h1>
              <p class="page-sub">Organize suas ideias e lembretes</p>
            </div>
          </div>
          <div class="header-actions">
            <input class="search-input" v-model="searchQuery" placeholder="Pesquisar por título..." />
            <button class="new-note" @click="openNew">Nova Anotação</button>
          </div>
        </header>

        <section class="notes">
          <div class="notes-grid">
            <NoteCard v-for="note in paginatedNotes" :key="note.id" :note="note" @open="openDetail" />
          </div>
        </section>
        <div class="pagination" v-if="totalPages > 1">
          <button class="page-btn" :disabled="page === 1" @click="prevPage">Anterior</button>
          <span class="page-info">Página {{ page }} / {{ totalPages }}</span>
          <button class="page-btn" :disabled="page === totalPages" @click="nextPage">Próxima</button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="overlay" @click.self="close">
      <div class="modal modal-card">
        <div class="notebook">
          <div class="notebook-sheet full-sheet">
            <input class="input note-title-input" placeholder="Título" v-model="current.title" />
            <textarea class="textarea note-textarea" placeholder="Escreva sua anotação..." v-model="current.content" />

            <div class="modal-actions">
              <button class="cancel" @click="close" :disabled="saving">Cancelar</button>
              <button class="save" @click="save" :disabled="saving">{{ saving ? 'Salvando...' : 'Salvar' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <NoteModal :note="selectedNote" :visible="showDetailModal" @close="showDetailModal = false" @delete="(id) => { remove(id, selectedNote?.title); showDetailModal = false }" />

    <ModalConfirmarExclusao v-if="showDeleteModal" :id="Number(deleteTargetId)" :titulo="deleteTargetTitle" :url="`http://127.0.0.1:8000/api/anotacoes/${deleteTargetId}`" :label="'Anotação'" @fechar="showDeleteModal = false" @confirmado="() => { showDeleteModal = false; loadNotes(true) }" />

    <LoadingOverlay :show="loading" message="Carregando..." />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, Ref } from "vue"
import api from '../controller/api'
import { useAuth } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import NoteCard from '@/components/NoteCard.vue'
import NoteModal from '@/components/NoteModal.vue'
import ModalConfirmarExclusao from '@/components/ModalConfirmarExclusao.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'


type Note = {
  id: number | string | null
  title: string
  content: string
  date?: string
  usuario_id?: number | null
}

const notes: Ref<Note[]> = ref([])
const showModal = ref(false)

const current: Ref<Note> = ref({
  id: null,
  title: "",
  content: "",
  date: ""
})

const auth = useAuth()
const columns = ref(4)
const page = ref(1)

const selectedNote = ref<Note | null>(null)
const showDetailModal = ref(false)
const loading = ref(false)
const showDeleteModal = ref(false)
const deleteTargetId = ref<number | string | null>(null)
const deleteTargetTitle = ref('')
const saving = ref(false)

function updateColumns() {
  const w = window.innerWidth
  if (w >= 1025) columns.value = 4
  else if (w >= 769) columns.value = 3
  else if (w >= 426) columns.value = 2
  else columns.value = 1
}

onMounted(() => {
  updateColumns()
  window.addEventListener('resize', updateColumns)
})

const pageSize = computed(() => columns.value * 3) 
const searchQuery = ref('')

const filteredNotes = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return notes.value
  return notes.value.filter(n => (n.title || '').toLowerCase().includes(q))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredNotes.value.length / pageSize.value)))

watch([columns, () => filteredNotes.value.length], () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})

watch(searchQuery, () => { page.value = 1 })

const paginatedNotes = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredNotes.value.slice(start, start + pageSize.value)
})

function prevPage() {
  if (page.value > 1) page.value--
}

function nextPage() {
  if (page.value < totalPages.value) page.value++
}

function openDetail(note) {
  selectedNote.value = note
  showDetailModal.value = true
}

async function handleDelete(id: number | string) {
  try {
    const userId = auth.user?.id ?? null
    if (userId) {
      await api.delete(`http://127.0.0.1:8000/api/anotacoes/${id}`)
      await loadNotes(true)
    } else {
      notes.value = notes.value.filter(n => n.id !== id)
    }
    toastify.success('Anotação excluída', { timeout: 3000, position: 'bottom-right', hideProgressBar: true })
  } catch (err) {
    console.error('Erro ao excluir anotação:', err)
    toastify.error('Erro ao excluir anotação', { timeout: 3000, position: 'bottom-right', hideProgressBar: true })
  }
}

async function loadNotes(silent = false) {
  if (!silent) loading.value = true
  try {
    const userId = auth.user?.id ?? null
    if (userId) {
      const resp = await api.get(`/anotacoes/usuario/${userId}`)
      function normalize(a: any) {
        if (!a) return null
        return {
          id: a.id,
          title: a.titulo ?? a.title ?? '',
          content: a.texto ?? a.content ?? '',
          date: a.created_at ?? a.date ?? new Date().toISOString(),
          usuario_id: a.usuario_id ?? null
        }
      }

      if (Array.isArray(resp.data)) {
        notes.value = resp.data.map(normalize).filter(Boolean)
        notes.value.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      } else if (typeof resp.data === 'object' && resp.data !== null) {
        const n = normalize(resp.data)
        notes.value = n ? [n] : []
      } else {
        notes.value = []
      }
      return
    }

    const saved = localStorage.getItem("notes")
    if (saved) {
      notes.value = JSON.parse(saved)
      notes.value.sort((a: Note, b: Note) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime())
    } else notes.value = []
  } catch (error) {
    console.error('Erro ao carregar anotações do servidor:', error)
    toastify.error('Erro ao carregar anotações', { timeout: 3000, position: 'bottom-right', hideProgressBar: true })
  } finally {
    if (!silent) loading.value = false
  }
}

onMounted(() => loadNotes())

watch(
  notes,
  () => {
    localStorage.setItem("notes", JSON.stringify(notes.value))
  },
  { deep: true }
)

const toast = ref({
  visible: false,
  message: '',
  confirm: false,
  duration: 3000,
  onConfirm: null
})
const toastify = useToast()

function openNew() {
  current.value = {
    id: null,
    title: "",
    content: "",
    date: ""
  }
  showModal.value = true
} 

function edit(note) {
  current.value = { ...note }
  showModal.value = true
}

async function save() {
  if (!current.value.content.trim()) return
  saving.value = true
  try {
    const isEdit = !!current.value.id

    if (isEdit) {
      const index = notes.value.findIndex(
        n => n.id === current.value.id
      )
      notes.value[index] = { ...current.value }
      toastify.success('Anotação atualizada', { timeout: 3000, position: 'bottom-right', hideProgressBar: true })
      close()
      return
    }

    const userId = auth.user?.id ?? null
    if (userId) {
      const payload = {
        usuario_id: userId,
        texto: current.value.content,
        titulo: current.value.title
      }
      try {
        await api.post('/anotacoes', payload)
        await loadNotes(true)
        toastify.success('Anotação criada', { timeout: 3000, position: 'bottom-right', hideProgressBar: true })
        close()
      } catch (err) {
        console.error('Erro ao criar anotação:', err)
        toastify.error('Erro ao criar anotação', { timeout: 3000, position: 'bottom-right', hideProgressBar: true })
      }

      return
    }

    notes.value.unshift({
      ...current.value,
      id: Date.now(),
      date: new Date().toISOString()
    })
    toastify.success('Anotação criada', { timeout: 3000, position: 'bottom-right', hideProgressBar: true })
    close()
  } catch (err) {
    console.error('Erro ao salvar anotação:', err)
    toastify.error('Erro ao salvar anotação', { timeout: 3000, position: 'bottom-right', hideProgressBar: true })
  } finally {
    saving.value = false
  }
}

function remove(id: number | string, title?: string) {
  deleteTargetId.value = id
  deleteTargetTitle.value = title ?? ''
  showDeleteModal.value = true
}

function close() {
  showModal.value = false
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR")
}
</script>

<style scoped>
.fundo {
  width: 100%;
  height: 100vh;
  background-image: url('/assets/fundo.png');
  object-fit: cover;
  position: fixed;
  inset: 0;
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

.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  min-height: 100vh;
  padding: 32px;
}

.empty-message {
  color: #aaa;
  font-size: 22px;
  text-align: center;
}

.with-notes {
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #2a0000;
  padding-bottom: 24px;
}

.title {
  display: flex;
  gap: 12px;
  align-items: center;
}

.title h1 {
  font-size: 32px;
}

.icon {
  font-size: 28px;
  color: #ff2a2a;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions span {
  margin-left: 10px;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: background 0.15s ease, transform 0.12s ease;
}

.actions span:hover {
  background: rgba(255, 255, 255, 0.04);
  transform: translateY(-1px);
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #141414;
  border: 1px solid #8b0000;
  border-radius: 16px;
  width: 420px;
  padding: 24px;
  box-shadow: 0 0 30px rgba(255, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input,
.textarea {
  background: #0e0e0e;
  border: 1px solid #333;
  color: #fff;
  padding: 12px;
  border-radius: 8px;
}

.textarea {
  min-height: 140px;
  resize: none;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel {
  background: transparent;
  border: 1px solid #555;
  color: #ccc;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.save {
  background: linear-gradient(90deg, #ff0000, #ff6a00);
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}



.toast-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.toast-enter-active {
  transition: all 180ms ease;
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.toast-leave-active {
  transition: all 160ms ease;
}

.page {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--color-bg-dark) 0%, var(--color-bg) 100%);
  color: var(--color-text-white);
  padding: 40px 20px;
  font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}


.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  padding: 40px 16px;
}

.empty-card {
  padding: 48px 36px;
  border-radius: 14px;
  text-align: center;
  width: 100%;
  max-width: 680px;
}

.empty-illustration {
  font-size: 36px;
  color: var(--color-primary);
  margin-bottom: 12px;
}

.empty-message {
  color: var(--color-text-secondary);
  font-size: 20px;
  margin-bottom: 18px;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--color-border);
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  color: var(--color-text-white);
  min-width: 220px;
}

.title-wrap {
  display: flex;
  gap: 14px;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 28px;
  font-weight: var(--font-weight-bold);
}

.page-sub {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 107, 53, 0.12);
  color: var(--color-primary);
  font-weight: 700;
}

.new-note {
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
  border: none;
  padding: 12px 18px;
  border-radius: 10px;
  color: var(--color-text-white);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(255, 107, 53, 0.08);
  transition: transform .16s ease, box-shadow .16s ease;
}

.new-note:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 40px rgba(255, 107, 53, 0.12);
}

.new-note2 {
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  color: var(--color-text-white);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(255, 107, 53, 0.08);
  transition: transform .16s ease, box-shadow .16s ease;
}

.new-note2:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 40px rgba(255, 107, 53, 0.12);
}

.notes {
  margin-top: 6px;
}

.notes-grid {
  display: grid;
  gap: 18px;
}

.note-card {
  background: linear-gradient(180deg, #1E293B);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 18px;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}

.note-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(2, 6, 23, 0.55);
  border-color: rgba(255, 107, 53, 0.16);
}

.note-card-inner {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 160px;
}

.note-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.note-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-white);
}

.actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  transition: background .12s ease, transform .12s ease;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.03);
  transform: translateY(-2px);
  color: var(--color-text-white);
}

.content {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  overflow: hidden;
}

.note-footer {
  display: flex;
  justify-content: flex-end;
}

.date {
  color: var(--color-text-tertiary, var(--color-text-secondary));
  font-size: 13px;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 9999;
}

.modal-card {
  width: 100%;
  max-width: 720px;
  border-radius: 12px;
  padding: 24px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  box-shadow: 0 30px 80px rgba(2, 6, 23, 0.75);
}

.notebook {
  display: block;
}

.notebook-sheet {
  width: 100%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.00));
  border-radius: 8px;
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.02);
  position: relative;
  box-shadow: 0 8px 30px rgba(2, 6, 23, 0.45);
  min-height: 320px;
}

.notebook-sheet::before {
  content: "";
  position: absolute;
  inset: 18px 18px 18px 18px;
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 100% 28px;
  pointer-events: none;
  border-radius: 4px;
}

.input,
.textarea {
  width: 100%;
  background: transparent;
  border: none;
  color: var(--color-text-white);
  padding: 8px 10px;
  border-radius: 4px;
}

.note-title-input {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
  padding-left: 6px;
}

.note-textarea {
  min-height: 220px;
  resize: vertical;
  padding-left: 6px;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.cancel {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--color-text-secondary);
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.save {
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
  border: none;
  color: var(--color-text-white);
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}



.btn {
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
}

.btn-cancel {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.04);
  color: var(--color-text-secondary);
}

.btn-confirm {
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
  color: var(--color-text-white);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.toast-enter-active {
  transition: all 180ms ease;
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.toast-leave-active {
  transition: all 160ms ease;
}

.pagination {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin-top: 18px;
}

.page-btn {
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
  border: none;
  color: var(--color-text-white);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.page-btn[disabled] {
  opacity: 0.45;
  cursor: not-allowed;
}

.page-info {
  color: var(--color-text-secondary);
  font-size: 14px;
}
</style>