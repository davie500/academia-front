<template>
  <div class="note-card" role="button" @click="open" :title="note.title || 'Sem título'">
    <div class="note-card-inner">
      <div class="note-top">
        <h3 class="note-title">{{ note.title || 'Sem título' }}</h3>
        <div class="actions">
          <button class="icon-btn" @click.stop="$emit('open', note)" aria-label="Abrir"></button>
        </div>
      </div>

      <p class="content">{{ note.content }}</p>

      <div class="note-footer">
        <span class="date">{{ formattedDate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  note: Object
})

const emit = defineEmits(['open'])

function open() {
  emit('open', props.note)
}

const formattedDate = computed(() => {
  try {
    return props.note && props.note.date ? new Date(props.note.date).toLocaleDateString('pt-BR') : ''
  } catch (e) {
    return ''
  }
})
</script>

<style scoped>
.note-card {
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
  border-radius: 12px;
  padding: 18px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid var(--color-border);
}
.note-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(2,6,23,0.55); border-color: rgba(255,107,53,0.12); }
.note-title { margin: 0; font-size: 16px; font-weight: 700; color: var(--color-text-white); }
.content { color: var(--color-text-secondary); font-size: 14px; line-height: 1.4; margin: 8px 0 0 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.note-footer { display:flex; justify-content: flex-end; margin-top: 10px; }
.date { color: var(--color-text-tertiary); font-size: 13px; }
.icon-btn { background: transparent; border: none; color: var(--color-text-secondary); padding:6px; border-radius:8px; cursor:pointer; }
</style>