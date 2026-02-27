<template>
  <div class="modal-overlay" @click.self="fechar">
    <div class="modal">
      <div class="modal__header">
        <div class="modal__header-content">
          <h2 class="modal__title">Editar {{ treino.nome }}</h2>
          <p class="modal__info">Adicionar exercícios ao treino</p>
        </div>
        <button class="modal__close" @click="fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="modal__content">
        <div class="form-group">
          <label class="form-label">Selecione um exercício</label>
          <select v-model="exercicioSelecionado" class="form-select">
            <option value="">Escolha um exercício</option>
            <option v-for="exercicio in exerciciosDisponiveis" :key="exercicio.id" :value="exercicio.id">
              {{ exercicio.nome }}
            </option>
          </select>
        </div>

        <div v-if="exercicioSelecionado" class="form-group">
          <label class="form-label">Séries</label>
          <input v-model.number="series" type="number" min="1" class="form-input" placeholder="Número de séries" />
        </div>

        <div v-if="exercicioSelecionado" class="form-group">
          <label class="form-label">Repetições</label>
          <input v-model.number="repeticoes" type="number" min="1" class="form-input" placeholder="Número de repetições" />
        </div>

        <div v-if="exercicioSelecionado" class="form-group">
          <button class="botao botao--primario" @click="adicionarExercicio" :disabled="loading || !series || !repeticoes">
            Adicionar Exercício
          </button>
        </div>

        <h3 class="exercicios__titulo" style="margin-top: 32px;">Exercícios no treino</h3>
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
        <button class="botao botao--secundario" @click="fechar" :disabled="loading">
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '../controller/api'

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

const props = defineProps<{
  treino: Treino
  exerciciosDisponiveis: any[]
}>()

const emit = defineEmits<{
  fechar: []
  'treino-atualizado': [treino: Treino]
}>()

const loading = ref(false)
const exercicioSelecionado = ref('')
const series = ref<number | null>(null)
const repeticoes = ref<number | null>(null)

function fechar() {
  if (!loading.value) emit('fechar')
}

async function adicionarExercicio() {
  if (!exercicioSelecionado.value || !series.value || !repeticoes.value) {
    alert('Preencha todos os campos')
    return
  }

  loading.value = true
  try {
    const response = await api.post(`/treinos/adicionar/${props.treino.id}`, {
      exercicio_id: parseInt(exercicioSelecionado.value),
      series: series.value,
      repeticoes: repeticoes.value
    })

    // Recarregar os dados do treino
    const treinoAtualizado = response.data
    emit('treino-atualizado', treinoAtualizado)

    // Resetar formulário
    exercicioSelecionado.value = ''
    series.value = null
    repeticoes.value = null
  } catch (error) {
    console.error('Erro ao adicionar exercício:', error)
    alert('Erro ao adicionar exercício ao treino')
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

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-text-white);
  margin-bottom: 8px;
  font-weight: var(--font-weight-bold);
}

.form-select,
.form-input {
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-white);
  font-size: var(--font-size-base);
  transition: var(--transition-base);
}

.form-select:focus,
.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: rgba(0, 0, 0, 0.3);
}

.form-select option {
  background: #1a1f2e;
  color: var(--color-text-white);
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
  justify-content: flex-end;
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
  width: 100%;
}

.botao--primario:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.botao--primario:disabled {
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
}

.botao--secundario:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
