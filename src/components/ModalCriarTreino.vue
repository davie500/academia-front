<template>
  <div class="modal-overlay" @click.self="fechar">
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">Criar Novo Treino</h2>
        <button class="modal__close" @click="fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="modal__content">
        <p class="modal__subtitle">Escolha o tipo de treino que deseja criar</p>

        <div class="opcoes-container">
          <div
            class="opcao-card"
            @click="selecionarTipo('pre-montado')"
            :class="{ 'opcao-card--active': tipoSelecionado === 'pre-montado' }"
          >
            <h3 class="opcao-card__title">Treino Pré-montado</h3>
            <p class="opcao-card__descricao">
              Escolha entre treinos prontos criados por profissionais
            </p>
          </div>

          <div
            class="opcao-card"
            @click="selecionarTipo('personalizado')"
            :class="{ 'opcao-card--active': tipoSelecionado === 'personalizado' }"
          >
            <h3 class="opcao-card__title">Treino Personalizado</h3>
            <p class="opcao-card__descricao">
              Monte seu treino do zero com exercícios customizados
            </p>
          </div>
        </div>

        <div v-if="tipoSelecionado === 'pre-montado'" class="treino-lista">
          <h3 class="treino-lista__title">Treinos Pré-montados</h3>
          <p class="treino-lista__subtitle">Selecione um treino profissional</p>

          <div v-if="treinosPremontados.length === 0" class="carregando">
            Carregando treinos...
          </div>

          <div v-else class="treinos-opcoes">
            <div
              v-for="treino in treinosPremontados"
              :key="treino.id"
              class="treino-opcao"
              @click="selecionarTreinoPremontado(treino)"
            >
              <div class="treino-opcao__header">
                <h4 class="treino-opcao__nome">{{ treino.nome }}</h4>
                <span class="treino-opcao__exercicios">{{ treino.exercicios.length }} exercícios</span>
              </div>
              <div class="treino-opcao__tags">
                <span
                  v-for="tag in treino.tags"
                  :key="tag"
                  class="treino-opcao__tag"
                >
                  {{ tag }}
                </span>
              </div>
              <button class="treino-opcao__botao" @click.stop="adicionarTreinoPremontado(treino)">
                Adicionar Treino
              </button>
            </div>
          </div>
        </div>

        <div v-if="tipoSelecionado === 'personalizado'" class="formulario-treino">
          <div class="form-group">
            <label class="form-group__label">Nome do Treino</label>
            <input
              v-model="formularioTreino.nome"
              type="text"
              class="form-group__input"
              placeholder="Ex: Treino A - Peito e Tríceps"
            />
          </div>

          <div class="form-group">
            <label class="form-group__label">Selecionar Exercício</label>
            <div class="form-exercicio">
              <select v-model="novoExercicio.id" class="form-group__input form-exercicio__select">
                <option value="">Escolha um exercício</option>
                <option v-for="exercicio in exerciciosDisponiveis" :key="exercicio.id" :value="exercicio.id">
                  {{ exercicio.nome }}
                </option>
              </select>
              <div class="form-exercicio__numeros">
                <input
                  v-model.number="novoExercicio.series"
                  type="number"
                  min="1"
                  max="10"
                  class="form-exercicio__input"
                  placeholder="Séries"
                />
                <input
                  v-model.number="novoExercicio.repeticoes"
                  type="number"
                  min="1"
                  max="50"
                  class="form-exercicio__input"
                  placeholder="Reps"
                />
              </div>
              <button class="form-exercicio__botao" @click="adicionarExercicio" :disabled="!novoExercicio.id">
                <span class="form-exercicio__botao-icon">+</span>
              </button>
            </div>
          </div>

          <div v-if="formularioTreino.exercicios.length > 0" class="exercicios-lista">
            <h4 class="exercicios-lista__titulo">Exercícios do Treino</h4>
            <div
              v-for="(exercicio, index) in formularioTreino.exercicios"
              :key="index"
              class="exercicio-item"
            >
              <div class="exercicio-item__numero">{{ index + 1 }}</div>
              <div class="exercicio-item__info">
                <p class="exercicio-item__nome">{{ exercicio.nome }}</p>
                <p class="exercicio-item__series">{{ exercicio.series }} séries × {{ exercicio.repeticoes }} reps</p>
              </div>
              <button class="exercicio-item__remover" @click="removerExercicio(index)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal__footer">
        <button class="botao botao--secundario" @click="fechar">Cancelar</button>
        <button
          v-if="tipoSelecionado === 'personalizado' && formularioTreino.exercicios.length > 0"
          class="botao botao--primario"
          @click="salvarTreinoPersonalizado"
        >
          Salvar Treino
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '../controller/api'

interface ExercicioBanco {
  id: number
  nome: string
  descricao?: string
  grupoMuscular?: string
}

interface ExercicioTreino {
  id?: number
  nome: string
  series: number
  repeticoes: number
}

interface TreinoPremontado {
  id: number
  nome: string
  exercicios: ExercicioTreino[]
  tags: string[]
}

interface FormularioTreino {
  nome: string
  exercicios: ExercicioTreino[]
}

interface NovoExercicio {
  id: string | number
  series: number
  repeticoes: number
}

const emit = defineEmits<{
  fechar: []
  'treino-criado': [treino: any]
}>()

const tipoSelecionado = ref<'pre-montado' | 'personalizado' | null>(null)
const treinosPremontados = ref<TreinoPremontado[]>([])
const exerciciosDisponiveis = ref<ExercicioBanco[]>([])
const novoExercicio = ref<NovoExercicio>({
  id: '',
  series: 3,
  repeticoes: 12
})
const formularioTreino = ref<FormularioTreino>({
  nome: '',
  exercicios: []
})

onMounted(async () => {
  await carregarTreinosPremontados()
  await carregarExercicios()
})

async function carregarTreinosPremontados() {
  try {
    const response = await api.get('/api/treinos-premontados')
    treinosPremontados.value = response.data
  } catch (error) {
    console.error('Erro ao carregar treinos pré-montados:', error)
  }
}

async function carregarExercicios() {
  try {
    const response = await api.get('/api/exercicios')
    exerciciosDisponiveis.value = response.data
  } catch (error) {
    console.error('Erro ao carregar exercícios:', error)
  }
}

function selecionarTipo(tipo: 'pre-montado' | 'personalizado') {
  tipoSelecionado.value = tipo
}

function adicionarExercicio() {
  if (!novoExercicio.value.id) return

  const exercicioSelecionado = exerciciosDisponiveis.value.find(
    e => e.id === Number(novoExercicio.value.id)
  )

  if (exercicioSelecionado) {
    formularioTreino.value.exercicios.push({
      id: exercicioSelecionado.id,
      nome: exercicioSelecionado.nome,
      series: novoExercicio.value.series,
      repeticoes: novoExercicio.value.repeticoes
    })
    novoExercicio.value = {
      id: '',
      series: 3,
      repeticoes: 12
    }
  }
}

function removerExercicio(index: number) {
  formularioTreino.value.exercicios.splice(index, 1)
}

function selecionarTreinoPremontado(treino: TreinoPremontado) {
  tipoSelecionado.value = 'pre-montado'
}

async function adicionarTreinoPremontado(treino: TreinoPremontado) {
  try {
    const payload = {
      nome: treino.nome,
      tipo: 'Pré-montado',
      exercicios: treino.exercicios
    }
    const response = await api.post('/api/treinos', payload)
    emit('treino-criado', response.data)
  } catch (error) {
    console.error('Erro ao adicionar treino:', error)
  }
}

async function salvarTreinoPersonalizado() {
  if (!formularioTreino.value.nome.trim()) {
    alert('Por favor, insira um nome para o treino')
    return
  }

  try {
    const payload = {
      nome: formularioTreino.value.nome,
      tipo: 'Personalizado',
      exercicios: formularioTreino.value.exercicios
    }
    const response = await api.post('/api/treinos', payload)
    emit('treino-criado', response.data)
  } catch (error) {
    console.error('Erro ao salvar treino:', error)
  }
}

function fechar() {
  emit('fechar')
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
  z-index: 1000;
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
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--color-border);
}

.modal__title {
  font-size: var(--font-size-xl);
  color: var(--color-text-white);
  margin: 0;
  font-weight: var(--font-weight-bold);
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

.modal__subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: 0 0 24px 0;
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

.opcoes-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.opcao-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 20px;
  background: rgba(26, 31, 46, 0.5);
  cursor: pointer;
  transition: var(--transition-base);
}

.opcao-card:hover {
  border-color: var(--color-primary);
  background: rgba(255, 107, 53, 0.1);
}

.opcao-card--active {
  border-color: var(--color-primary);
  background: rgba(255, 107, 53, 0.1);
}

.opcao-card__title {
  font-size: var(--font-size-lg);
  color: var(--color-text-white);
  margin: 0 0 8px 0;
  font-weight: var(--font-weight-bold);
}

.opcao-card__descricao {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.treino-lista {
  margin-top: 24px;
}

.treino-lista__title {
  font-size: var(--font-size-lg);
  color: var(--color-text-white);
  margin: 0 0 4px 0;
  font-weight: var(--font-weight-bold);
}

.treino-lista__subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0 0 16px 0;
}

.carregando {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 32px;
}

.treinos-opcoes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.treino-opcao {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
  background: rgba(26, 31, 46, 0.5);
  transition: var(--transition-base);
}

.treino-opcao:hover {
  border-color: var(--color-primary);
  background: rgba(255, 107, 53, 0.1);
}

.treino-opcao__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 8px;
}

.treino-opcao__nome {
  font-size: var(--font-size-lg);
  color: var(--color-text-white);
  margin: 0;
  font-weight: var(--font-weight-bold);
}

.treino-opcao__exercicios {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.treino-opcao__tags {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.treino-opcao__tag {
  display: inline-block;
  padding: 3px 8px;
  background: rgba(255, 107, 53, 0.15);
  color: var(--color-primary);
  border-radius: 4px;
  font-size: 12px;
  font-weight: var(--font-weight-bold);
}

.treino-opcao__botao {
  width: 100%;
  padding: 10px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: var(--transition-base);
}

.treino-opcao__botao:hover {
  background: var(--color-primary-dark);
}

.formulario-treino {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-white);
  font-weight: var(--font-weight-bold);
}

.form-group__input {
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-white);
  font-size: var(--font-size-base);
  transition: var(--transition-base);
}

.form-group__input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: rgba(255, 107, 53, 0.05);
}

.form-group__input::placeholder {
  color: var(--color-text-secondary);
}

.form-exercicio {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.form-exercicio__input {
  width: 100px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-white);
  font-size: var(--font-size-base);
  text-align: center;
  transition: var(--transition-base);
}

.form-exercicio__input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: rgba(255, 107, 53, 0.05);
}

.form-exercicio__numeros {
  display: flex;
  gap: 8px;
}

.form-exercicio__select {
  flex: 1;
}

.form-exercicio__botao {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: var(--transition-base);
  flex-shrink: 0;
}

.form-exercicio__botao:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.form-exercicio__botao:disabled {
  background: var(--color-text-secondary);
  opacity: 0.5;
  cursor: not-allowed;
}

.form-exercicio__botao-icon {
  font-size: 20px;
  font-weight: bold;
}

.exercicios-lista {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

.exercicios-lista__titulo {
  font-size: var(--font-size-sm);
  color: var(--color-text-white);
  margin: 0 0 12px 0;
  font-weight: var(--font-weight-bold);
}

.exercicio-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.exercicio-item__numero {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: white;
  border-radius: 4px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
}

.exercicio-item__info {
  flex: 1;
}

.exercicio-item__nome {
  font-size: var(--font-size-sm);
  color: var(--color-text-white);
  margin: 0;
  font-weight: var(--font-weight-bold);
}

.exercicio-item__series {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin: 2px 0 0 0;
}

.exercicio-item__remover {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: var(--transition-base);
  flex-shrink: 0;
}

.exercicio-item__remover:hover {
  background: rgba(230, 57, 70, 0.1);
  border-color: var(--color-secondary);
  color: var(--color-secondary);
}

.exercicio-item__remover svg {
  width: 16px;
  height: 16px;
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

@media (max-width: 600px) {
  .opcoes-container {
    grid-template-columns: 1fr;
  }

  .form-exercicio {
    flex-direction: column;
  }

  .form-exercicio__numeros {
    width: 100%;
  }

  .form-exercicio__input {
    width: 100%;
  }

  .form-exercicio__botao {
    width: 100%;
  }
}
</style>