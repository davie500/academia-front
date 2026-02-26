<template>
  <div v-if="visible" class="overlay" @click.self="close">
    <div class="modal-card">
      <div class="modal-body">
        <h2 class="modal-title">{{ note.title || 'Sem título' }}</h2>
        <div class="modal-content">{{ note.content }}</div>
        <div class="modal-footer">
          <span class="date">{{ formattedDate }}</span>
          <div class="actions">
            <button class="btn cancel" @click="close">Fechar</button>
            <button class="btn delete" @click="confirmDelete">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  note: Object,
  visible: Boolean
})

const emit = defineEmits(['close', 'delete'])

function close() {
  emit('close')
}

function confirmDelete() {
  if (props.note && props.note.id) emit('delete', props.note.id)
  emit('close')
}

const formattedDate = computed(() => {
  if (!props.note) return ''
  try { return props.note.date ? new Date(props.note.date).toLocaleDateString('pt-BR') : '' } catch { return '' }
})
</script>

<style scoped>
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 9999; }
.modal-card { width: 100%; max-width: 720px; border-radius: 12px; padding: 20px; background: var(--color-bg-card); border: 1px solid var(--color-border); box-shadow: 0 30px 80px rgba(2,6,23,0.75); }
.modal-title { margin: 0 0 12px 0; font-size: 20px; font-weight: 800; }
.modal-content { white-space: pre-wrap; color: var(--color-text-secondary); font-size: 15px; line-height: 1.6; max-height: 60vh; overflow: auto; }
.modal-footer { display:flex; justify-content: space-between; align-items: center; margin-top: 12px; gap: 12px; }
.date { color: var(--color-text-tertiary); font-size: 13px; }
.actions { display:flex; gap: 8px; }
.btn { padding: 8px 12px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn.cancel { background: transparent; border: 1px solid rgba(255,255,255,0.06); color: var(--color-text-secondary); }
.btn.delete { background: linear-gradient(90deg,#ff4b4b,#ff1a1a); color: #fff; border: none; box-shadow: 0 8px 30px rgba(255,20,20,0.16); }
</style>