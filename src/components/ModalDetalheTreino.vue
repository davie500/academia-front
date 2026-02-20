<template>
  <div class="modal-overlay" @click.self="fechar">
    <div class="modal">
      <div class="modal__header">
        <div class="modal__header-content">
          <div class="modal__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="8" width="3" height="8" rx="0.8" />
              <rect x="20" y="8" width="3" height="8" rx="0.8" />
              <rect x="7" y="10" width="10" height="4" rx="0.8" />
            </svg>
          </div>
          <div class="modal__header-texto">
            <h2 class="modal__title">{{ treino.nome }}</h2>
            <p class="modal__info">{{ treino.tipo }} • {{ treino.exercicios.length }} exercícios</p>
          </div>
        </div>
        <button class="modal__close" @click="fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="modal__content">
        <h3 class="exercicios__titulo">Exercícios</h3>
        <div v-if="treino.exercicios.length === 0" class="vazio">
          Nenhum exercício adicionado
        </div>
        <div v-else class="exercicios-lista">
          <div
            v-for="(exercicio, index) in treino.exercicios"
            :key="index"
            class="exercicio-detalhe"
          >
            <div class="exercicio-detalhe__numero">{{ index + 1 }}</div>
            <div class="exercicio-detalhe__info">
              <h4 class="exercicio-detalhe__nome">{{ exercicio.nome }}</h4>
              <p class="exercicio-detalhe__series">
                {{
                  exercicio.series !== undefined && exercicio.repeticoes !== undefined
                    ? exercicio.series + ' séries × ' + exercicio.repeticoes + ' repetições'
                    : exercicio.pivot && exercicio.pivot.series !== undefined && exercicio.pivot.repeticoes !== undefined
                      ? exercicio.pivot.series + ' séries × ' + exercicio.pivot.repeticoes + ' repetições'
                      : 'Séries e repetições não informadas'
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="modal__footer">
        <div class="modal__footer-left">
          <button class="botao botao--danger" @click="excluirTreino" :disabled="loading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="icon-small">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Excluir
          </button>
        </div>

        <div class="modal__footer-right">
          <button class="botao botao--secundario" @click="fechar" :disabled="loading">
            Fechar
          </button>
          <button class="botao botao--primario" @click="editarTreino" :disabled="loading">
            Editar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PivotData {
  series: number
  repeticoes: number
}

interface Exercicio {
  id?: number
  nome: string
  series?: number
  repeticoes?: number
  pivot?: PivotData
}

interface Treino {
  id: number
  nome: string
  tipo: 'Pré-montado' | 'Personalizado'
  exercicios: Exercicio[]
}

import { ref } from 'vue'
import api from '../controller/api'

const props = defineProps<{
  treino: Treino
}>()

const emit = defineEmits<{
  fechar: []
  'treino-atualizado': [treino: Treino]
  'treino-excluido': [id: number]
}>()

const loading = ref(false)

function fechar() {
  if (!loading.value) emit('fechar')
}

function editarTreino() {
  if (loading.value) return
  fechar()
}

async function excluirTreino() {
  if (loading.value) return

  const ok = window.confirm('Deseja realmente excluir este treino? Esta ação não pode ser desfeita.')
  if (!ok) return

  loading.value = true
  try {
    await api.delete(`/treinos/${props.treino.id}`)
    emit('treino-excluido', props.treino.id)
    fechar()
  } catch (error) {
    console.error('Erro ao excluir treino:', error)
    alert('Não foi possível excluir o treino. Tente novamente.')
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
  z-index: 10000;
  padding: 16px;
}

.modal {
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
}

.modal__header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.modal__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 8px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.modal__icon svg {
  width: 24px;
  height: 24px;
}

.modal__header-texto {
  flex: 1;
}

.modal__title {
  font-size: var(--font-size-xl);
  color: var(--color-text-white);
  margin: 0;
  font-weight: var(--font-weight-bold);
}

.modal__info {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 4px 0 0 0;
}

.modal__close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: var(--transition-base);
  flex-shrink: 0;
}

.modal__close:hover {
  color: var(--color-text-white);
}

.modal__close svg {
  width: 24px;
  height: 24px;
}

.modal__content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.exercicios__titulo {
  font-size: var(--font-size-lg);
  color: var(--color-text-white);
  margin: 0 0 16px 0;
  font-weight: var(--font-weight-bold);
}

.vazio {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 32px 16px;
}

.exercicios-lista {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exercicio-detalhe {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.exercicio-detalhe__numero {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: white;
  border-radius: 6px;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
}

.exercicio-detalhe__info {
  flex: 1;
}

.exercicio-detalhe__nome {
  font-size: var(--font-size-base);
  color: var(--color-text-white);
  margin: 0;
  font-weight: var(--font-weight-bold);
}

.exercicio-detalhe__series {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 4px 0 0 0;
}

.modal__footer {
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-darker);
  border-bottom-left-radius: var(--radius-md);
  border-bottom-right-radius: var(--radius-md);
}

.modal__footer {
  justify-content: space-between;
  align-items: center;
}

.modal__footer-left {
  display: flex;
  align-items: center;
}

.modal__footer-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.botao {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: var(--transition-base);
}

.botao--primario {
  background: var(--color-primary);
  color: white;
  flex: 1;
}

.botao--primario:hover {
  background: var(--color-primary-dark);
}

.botao--secundario {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.botao--secundario:hover {
  border-color: var(--color-text-primary);
  color: var(--color-text-white);
}

.botao--danger {
  background: var(--color-secondary);
  color: white;
  border: none;
}

.botao--danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.icon-small {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  vertical-align: middle;
}
</style>