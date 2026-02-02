<template>
  <div class="page">
    <header class="header">
      <div class="title">
        <span class="icon">•</span>
        <h1>Minhas Anotações</h1>
      </div>
      <button class="new-note" @click="openNew">
        + Nova Anotação
      </button>
    </header>
    <section class="notes">
      <transition-group name="note" tag="div" class="notes-grid">
        <div
          v-for="note in notes"
          :key="note.id"
          class="note-card"
        >
          <div class="note-header">
            <h2>{{ note.title || "Sem título" }}</h2>

            <div class="actions">
              <span @click="edit(note)">✎</span>
              <span @click="remove(note.id)">✖</span>
            </div>
          </div>
          <p class="content">
            {{ note.content.slice(0, 120) }}
            <span v-if="note.content.length > 120">...</span>
          </p>
          <span class="date">{{ formatDate(note.date) }}</span>
        </div>
      </transition-group>
      <p v-if="notes.length === 0" class="empty">
        Nenhuma anotação ainda
      </p>
    </section>
    <div v-if="showModal" class="overlay" @click.self="close">
      <div class="modal">
        <input class="input" placeholder="Título" v-model="current.title" />
        <textarea class="textarea" placeholder="Escreva sua anotação..." v-model="current.content" />
        <div class="modal-actions">
          <button class="cancel" @click="close">Cancelar</button>
          <button class="save" @click="save">Salvar</button>
        </div>
      </div>
    </div>

    <transition name="toast">
      <div v-if="toast.visible" class="toast" :class="{ confirm: toast.confirm }" role="status">
        <div class="toast-message">{{ toast.message }}</div>
        <div v-if="toast.confirm" class="toast-actions">
          <button class="btn btn-cancel" @click="confirmToastCancel">Cancelar</button>
          <button class="btn btn-confirm" @click="confirmToastConfirm">Excluir</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"

const notes = ref([])
const showModal = ref(false)

const current = ref({
  id: null,
  title: "",
  content: "",
  date: ""
})

onMounted(() => {
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
  } else {
    notes.value.unshift({
      ...current.value,
      id: Date.now(),
      date: new Date().toISOString()
    })
    showToast('Anotação criada')
  }

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
  padding: 12px 22px;
  border-radius: 12px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(255, 60, 0, 0.6);
  transition: 0.2s;
}
.new-note:hover {
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
  box-shadow: 0 0 18px rgba(255, 0, 0, 0.18);
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
.toast {
  position: fixed;
  right: 18px;
  bottom: 18px;
  background: rgba(20,20,20,0.96);
  border: 1px solid rgba(255,255,255,0.04);
  color: #fff;
  padding: 12px 16px;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.6);
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 220px;
  max-width: 380px;
  z-index: 9999;
}
.toast.confirm {
  min-width: 300px;
}
.toast-message {
  flex: 1;
  font-size: 14px;
  color: #ddd;
}
.toast-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.toast-actions .btn {
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
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

/* List animation (enter/leave) */
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

/* Toast animation */
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
</style>