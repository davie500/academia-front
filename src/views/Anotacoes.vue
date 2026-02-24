<template>
  <div class="page">
    <div class="container">
      <div v-if="notes.length === 0" class="empty-state">
        <div class="empty-card">
          <div class="empty-illustration"></div>
          <p class="empty-message">Nenhuma anotação ainda</p>
          <button class="new-note2" @click="openNew">+ Nova Anotação</button>
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
          <div>
            <button class="new-note" @click="openNew">+ Nova Anotação</button>
          </div>
        </header>

        <section class="notes">
          <transition-group name="note" tag="div" class="notes-grid">
            <div v-for="note in notes" :key="note.id" class="note-card">
              <div class="note-card-inner">
                <div class="note-top">
                  <h2 class="note-title">{{ note.title || 'Sem título' }}</h2>
                  <div class="actions">
                    <button class="icon-btn" @click="edit(note)" aria-label="Editar">✎</button>
                    <button class="icon-btn" @click="remove(note.id)" aria-label="Remover">✖</button>
                  </div>
                </div>

                <p class="content">{{ note.content.slice(0, 240) }}<span v-if="note.content.length > 240">...</span></p>

                <div class="note-footer">
                  <span class="date">{{ formatDate(note.date) }}</span>
                </div>
              </div>
            </div>
          </transition-group>
        </section>
      </div>
    </div>

    <div v-if="showModal" class="overlay" @click.self="close">
      <div class="modal modal-card">
        <div class="notebook">
          <div class="notebook-sheet full-sheet">
            <input class="input note-title-input" placeholder="Título" v-model="current.title" />
            <textarea class="textarea note-textarea" placeholder="Escreva sua anotação..." v-model="current.content" />

            <div class="modal-actions">
              <button class="cancel" @click="close">Cancelar</button>
              <button class="save" @click="save">Salvar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="toast">
      <div v-if="toast.visible" class="toast-overlay">
        <div class="toast" :class="{ confirm: toast.confirm }" role="status">
          <div class="toast-message">{{ toast.message }}</div>
          <div v-if="toast.confirm" class="toast-actions">
            <button class="btn btn-cancel" @click="confirmToastCancel">Cancelar</button>
            <button class="btn btn-confirm" @click="confirmToastConfirm">Excluir</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import api from '../controller/api'
import { useAuth } from '@/stores/auth'

const notes = ref([])
const showModal = ref(false)

const current = ref({
  id: null,
  title: "",
  content: "",
  date: ""
})

const auth = useAuth()

onMounted(async () => {
  try {
    const userId = auth.user?.id ?? null
    if (userId) {
      const resp = await api.get(`/anotacoes/usuario/${userId}`)
      console.log('Anotações carregadas do servidor:', resp.data)
      function normalize(a) {
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
      } else if (typeof resp.data === 'object' && resp.data !== null) {
        const n = normalize(resp.data)
        notes.value = n ? [n] : []
      } else {
        notes.value = []
      }
      return
    }
  } catch (error) {
    console.error('Erro ao carregar anotações do servidor:', error)
  }

  // Fallback: load from localStorage
  const saved = localStorage.getItem("notes")
  if (saved) notes.value = JSON.parse(saved)
})

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

const pendingDeleteId = ref(null)

function showConfirmToast(message, onConfirm) {
  toast.value = { visible: true, message, confirm: true, duration: 0, onConfirm }
}

function showToast(message, duration = 3000) {
  toast.value = { visible: true, message, confirm: false, duration, onConfirm: null }
  setTimeout(() => {
    if (!toast.value.confirm) {
      hideToast()
    }
  }, duration)
}

function hideToast() {
  toast.value = { visible: false, message: '', confirm: false, duration: 3000, onConfirm: null }
}

function confirmToastConfirm() {
  if (typeof toast.value.onConfirm === 'function') {
    toast.value.onConfirm()
  }
}

function confirmToastCancel() {
  pendingDeleteId.value = null
  hideToast()
}

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

function save() {
  if (!current.value.content.trim()) return
  const isEdit = !!current.value.id

  if (isEdit) {
    const index = notes.value.findIndex(
      n => n.id === current.value.id
    )
    notes.value[index] = { ...current.value }
    showToast('Anotação atualizada')
    close()
    return
  }

  // Create via API if user available
  const userId = auth.user?.id ?? null
  if (userId) {
    const payload = {
      usuario_id: userId,
      texto: current.value.content,
      titulo: current.value.title
    }

    api.post('/anotacoes', payload)
      .then(resp => {
        // Normalize created annotation
        const a = resp.data
        const created = a && typeof a === 'object' ? {
          id: a.id,
          title: a.titulo ?? a.title ?? current.value.title,
          content: a.texto ?? a.content ?? current.value.content,
          date: a.created_at ?? a.date ?? new Date().toISOString(),
          usuario_id: a.usuario_id ?? userId
        } : {
          id: resp.data?.id ?? Date.now(),
          title: current.value.title,
          content: current.value.content,
          date: new Date().toISOString()
        }
        notes.value.unshift(created)
        showToast('Anotação criada')
        close()
      })
      .catch(err => {
        console.error('Erro ao criar anotação:', err)
        showToast('Erro ao criar anotação')
      })

    return
  }

  // Fallback: local-only create
  notes.value.unshift({
    ...current.value,
    id: Date.now(),
    date: new Date().toISOString()
  })
  showToast('Anotação criada')
  close()
}

function remove(id) {
  pendingDeleteId.value = id
  showConfirmToast("Excluir esta anotação?", () => {
    notes.value = notes.value.filter(n => n.id !== pendingDeleteId.value)
    pendingDeleteId.value = null
    hideToast()
    showToast("Anotação excluída")
  })
} 

function close() {
  showModal.value = false
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR")
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: radial-gradient(circle at top, #1c1c1c, #050505);
  color: #fff;
  padding: 32px;
  font-family: "Segoe UI", sans-serif;
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
.new-note {
  background: linear-gradient(90deg, #ff0000, #ff6a00);
  border: none;
  padding: 18px 22px;
  border-radius: 12px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(255, 60, 0, 0.6);
  transition: 0.2s;
  font-size: 15px;
}
.new-note:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(255, 90, 0, 0.9);
}
.new-note2 {
  background: linear-gradient(90deg, #ff0000, #ff6a00);
  border: none;
  padding: 20px 32px;
  border-radius: 12px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(255, 60, 0, 0.6);
  transition: 0.2s;
  font-size: 20px;
}
.new-note2:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(255, 90, 0, 0.9);
}
.notes {
  margin-top: 32px;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}
.empty {
  color: #aaa;
}
.note-card {
  width: 340px;
  background: #121212;
  border: 1px solid #8b0000;
  border-radius: 14px;
  padding: 18px;
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
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
.toast-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
}
.toast {
  position: relative;
  background: rgba(20,20,20,0.98);
  border: 1px solid rgba(255,255,255,0.04);
  color: #fff;
  padding: 24px 32px;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
  min-width: 380px;
  max-width: 500px;
  z-index: 9999;
}
.toast.confirm {
  min-width: 420px;
}
.toast-message {
  flex: 1;
  font-size: 16px;
  color: #fff;
  text-align: center;
}
.toast-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
}
.toast-actions .btn {
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
}
.toast-actions .btn-cancel {
  background: transparent;
  color: #ccc;
  border: 1px solid rgba(255,255,255,0.06);
}
.toast-actions .btn-confirm {
  background: linear-gradient(90deg,#ff0000,#ff6a00);
  color: #fff;
  box-shadow: 0 4px 14px rgba(255,90,0,0.15);
}

.notes-grid {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}
.note-enter-from,
.note-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.995);
}
.note-enter-active,
.note-leave-active {
  transition: all 240ms cubic-bezier(.2,.8,.2,1);
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

.container {
  max-width: 1200px;
  margin: 0 auto;
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
  background: rgba(255,107,53,0.12);
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
  box-shadow: 0 8px 30px rgba(255,107,53,0.08);
  transition: transform .16s ease, box-shadow .16s ease;
}

.new-note:hover { transform: translateY(-3px); box-shadow: 0 18px 40px rgba(255,107,53,0.12); }

.new-note2 {
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  color: var(--color-text-white);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(255,107,53,0.08);
  transition: transform .16s ease, box-shadow .16s ease;
}

.new-note2:hover { transform: translateY(-3px); box-shadow: 0 18px 40px rgba(255,107,53,0.12); }

.notes {
  margin-top: 6px;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

.note-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 18px;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}

.note-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(2,6,23,0.55); border-color: rgba(255,107,53,0.16); }

.note-card-inner { display: flex; flex-direction: column; gap: 12px; min-height: 160px; }

.note-top { display:flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.note-title { margin: 0; font-size: 16px; font-weight: 700; color: var(--color-text-white); }

.actions { display:flex; gap:8px; }
.icon-btn { background: transparent; border: none; color: var(--color-text-secondary); padding:6px; border-radius:8px; cursor:pointer; transition: background .12s ease, transform .12s ease; }
.icon-btn:hover { background: rgba(255,255,255,0.03); transform: translateY(-2px); color: var(--color-text-white); }

.content { color: var(--color-text-secondary); font-size: 14px; line-height: 1.4; margin: 0; overflow: hidden; }

.note-footer { display:flex; justify-content: flex-end; }
.date { color: var(--color-text-tertiary, var(--color-text-secondary)); font-size: 13px; }

.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 9999; }
.modal-card { width: 100%; max-width: 720px; border-radius: 12px; padding: 24px; background: var(--color-bg-card); border: 1px solid var(--color-border); box-shadow: 0 30px 80px rgba(2,6,23,0.75); }

.notebook {
  display: block;
}

.notebook-sheet {
  width: 100%;
  background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00));
  border-radius: 8px;
  padding: 18px;
  border: 1px solid rgba(255,255,255,0.02);
  position: relative;
  box-shadow: 0 8px 30px rgba(2,6,23,0.45);
  min-height: 320px;
}

/* lined paper effect */
.notebook-sheet::before {
  content: "";
  position: absolute;
  inset: 18px 18px 18px 18px;
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 100% 28px;
  pointer-events: none;
  border-radius: 4px;
}

.input, .textarea {
  width: 100%;
  background: transparent;
  border: none;
  color: var(--color-text-white);
  padding: 8px 10px;
  border-radius: 4px;
}
.note-title-input { font-size: 18px; font-weight: 700; margin-bottom: 6px; padding-left: 6px; }
.note-textarea { min-height: 220px; resize: vertical; padding-left: 6px; line-height: 1.6; }
.modal-actions { display:flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
.modal-actions { display:flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
.cancel { background: transparent; border: 1px solid rgba(255,255,255,0.06); color: var(--color-text-secondary); padding: 10px 14px; border-radius: 8px; cursor: pointer; }
.save { background: linear-gradient(90deg,var(--color-primary),var(--color-primary-dark)); border: none; color: var(--color-text-white); padding: 10px 16px; border-radius: 8px; cursor: pointer; }

.toast-overlay { position: fixed; inset: 0; display:flex; align-items:center; justify-content:center; z-index: 9998; }
.toast { background: var(--color-bg-card); border: 1px solid var(--color-border); color: var(--color-text-white); padding: 20px 28px; border-radius: 12px; box-shadow: 0 12px 40px rgba(2,6,23,0.6); min-width: 320px; }
.toast.confirm { min-width: 420px; }
.toast-message { font-size: 15px; margin-bottom: 12px; }
.toast-actions { display:flex; gap:12px; justify-content:center; }
.btn { padding: 8px 14px; border-radius: 8px; font-weight:600; }
.btn-cancel { background: transparent; border: 1px solid rgba(255,255,255,0.04); color: var(--color-text-secondary); }
.btn-confirm { background: linear-gradient(90deg,var(--color-primary),var(--color-primary-dark)); color: var(--color-text-white); }

.note-enter-from, .note-leave-to { opacity:0; transform: translateY(8px) scale(0.995); }
.note-enter-active, .note-leave-active { transition: all 240ms cubic-bezier(.2,.8,.2,1); }

.toast-enter-from { opacity:0; transform: translateY(12px) scale(0.98); }
.toast-enter-active { transition: all 180ms ease; }
.toast-leave-to { opacity:0; transform: translateY(12px) scale(0.98); }
.toast-leave-active { transition: all 160ms ease; }

@media (max-width: 720px) {
  .notes-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .notes-grid { grid-template-columns: 1fr; }
  .note-card-inner { min-height: auto; }
  .empty-card { padding: 28px 18px; }
}

</style>