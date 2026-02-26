<template>
  <div class="modal-overlay" @click.self="fechar">
    <div class="modal">
      <div class="modal__icon-danger">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m-6.364-1.636l1.414-1.414m4.95-4.95l1.414-1.414m0 8.364l-1.414 1.414m-4.95 4.95l-1.414 1.414" />
          <circle cx="12" cy="12" r="9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
      </div>

      <div class="modal__content">
        <h2 class="modal__title">Excluir {{ labelText }}</h2>
        <p class="modal__message">
          Tem certeza que deseja excluir {{ labelText }} <strong>{{ titulo }}</strong>? Esta ação não pode ser desfeita.
        </p>
      </div>

      <div class="modal__footer">
        <button class="botao botao--secundario" @click="fechar" :disabled="loading">
          Cancelar
        </button>
        <button class="botao botao--danger" @click="confirmar" :disabled="loading">
          <span v-if="loading" class="loader"></span>
          {{ loading ? 'Excluindo...' : 'Excluir' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '../controller/api'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps<{
  id: number
  titulo: string
  url?: string
  label?: string
}>()

const emit = defineEmits<{
  fechar: []
  confirmado: []
}>()

const loading = ref(false)

const labelText = props.label ?? 'Treino'

function fechar() {
  if (!loading.value) emit('fechar')
}

async function confirmar() {
  if (loading.value) return

  loading.value = true
  try {
    const deleteUrl = props.url ?? `/treinos/${props.id}`
    await api.delete(deleteUrl)
    toast.success(`${labelText} excluído com sucesso!`)
      emit('confirmado')
  } catch (error) {
    console.error('Erro ao excluir treino:', error)
      toast.error(`Não foi possível excluir ${props.label ?? 'o item'}. Tente novamente.`)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import '../assets/styles/variables.css';

.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10001;
  padding: 16px;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  max-width: 400px;
  width: 100%;
  padding: 32px 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal__icon-danger {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
  color: #ef4444;
  margin-bottom: 20px;
}

.modal__icon-danger svg {
  width: 32px;
  height: 32px;
}

.modal__content {
  margin-bottom: 28px;
}

.modal__title {
  font-size: var(--font-size-xl);
  color: var(--color-text-white);
  margin: 0 0 12px 0;
  font-weight: var(--font-weight-bold);
}

.modal__message {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.6;
}

.modal__message strong {
  color: var(--color-text-white);
}

.modal__footer {
  display: flex;
  gap: 12px;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.botao {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;
}

.botao:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.botao--secundario {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.botao--secundario:hover:not(:disabled) {
  border-color: var(--color-text-primary);
  color: var(--color-text-white);
  background: rgba(255, 107, 53, 0.05);
}

.botao--danger {
  background: #ef4444;
  color: white;
}

.botao--danger:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-1px);
}

.botao--danger:active:not(:disabled) {
  transform: translateY(0);
}

.loader {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>