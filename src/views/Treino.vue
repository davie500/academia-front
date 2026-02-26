<template>
  <div class="fundo"></div>

  <LoadingOverlay
    :show="loading"
    message="Carregando treinos..."
  />

 

  <div v-if="!loading" class="treino-page">
    <div class="treino-header">
      <div class="treino-header__content">
        <h1 class="treino-header__title">
          <span class="treino-header__text-white">Meus</span>
          <span class="treino-header__text-highlight">Treinos</span>
        </h1>
        <p class="treino-header__subtitle">
          Gerencie e acompanhe seus treinos
        </p>
      </div>
      <button class="treino-header__button" @click="abrirModalCriar">
        <span class="treino-header__button-icon">+</span>
        Criar Treino
      </button>
    </div>

    <div v-if="treinosUsuario.length === 0" class="treino-empty">
      <div class="treino-empty__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
        </svg>
      </div>
      <h2 class="treino-empty__title">Nenhum treino criado ainda</h2>
      <p class="treino-empty__text">
        Clique em "Criar Treino" para começar
      </p>
    </div>

    <div v-else class="treino-container">
      <div class="treino-grid">
        <div
          v-for="treino in treinosUsuario"
          :key="treino.id"
          class="treino-card"
          @click="abrirModalDetalhes(treino)"
        >
          <div class="treino-card__header">
            <div class="treino-card__icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h3v16H6V4zm9 0h3v16h-3V4zm-4 6h8v4h-8v-4z" />
                <circle cx="4" cy="12" r="1.5" />
                <circle cx="20" cy="12" r="1.5" />
              </svg>
            </div>
            <span class="treino-card__tipo">{{ treino.tipo }}</span>
          </div>
          <h3 class="treino-card__title">{{ treino.nome }}</h3>
          <p class="treino-card__exercicios">{{ treino.exercicios.length }} exercícios</p>
        </div>
      </div>
    </div>
  </div>

  <ModalCriarTreino
    v-if="mostrarModalCriar"
    :treinos-premontados="treinosPremontados"
    :exercicios-disponiveis="exerciciosDisponiveis"
    :carregando-treinos="carregandoTreinos"
    :carregando-exercicios="carregandoExercicios"
    @fechar="fecharModalCriar"
    @treino-criado="adicionarTreino"
  />

  <ModalDetalheTreino
    v-if="mostrarModalDetalhes && treinoSelecionado"
    :treino="treinoSelecionado"
    @fechar="fecharModalDetalhes"
    @treino-atualizado="atualizarTreino"
    @treino-excluido="excluirTreino"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import LoadingOverlay from '../components/LoadingOverlay.vue'
import ModalCriarTreino from '../components/ModalCriarTreino.vue'
import ModalDetalheTreino from '../components/ModalDetalheTreino.vue'
import api from '../controller/api'

interface Exercicio {
  id?: number
  nome: string
  series: number
  repeticoes: number
}

interface Treino {
  id: number
  nome: string
  tipo: 'Pré-montado' | 'Personalizado'
  exercicios: Exercicio[]
  usuario_id?: number | null
  usuarioId?: number | null
}

const treinos = ref<Treino[]>([])
const loading = ref(false)
const mostrarModalCriar = ref(false)
const mostrarModalDetalhes = ref(false)
const treinoSelecionado = ref<Treino | null>(null)
const usuarioId = ref<number | null>(null)
const treinosPremontados = ref<any[]>([])
const exerciciosDisponiveis = ref<any[]>([])
const carregandoTreinos = ref(true)
const carregandoExercicios = ref(true)

const treinosUsuario = computed(() => {
  return treinos.value.filter(treino => {
    const id = treino.usuario_id ?? treino.usuarioId
    return id !== null && id !== undefined
  })
})

onMounted(async () => {
  await carregarTreinos()
  await carregarTreinosPremontados()
  await carregarExercicios()
})

async function carregarTreinosPremontados() {
  carregandoTreinos.value = true
  try {
    const response = await api.get('/treinos?publicos=true')
    treinosPremontados.value = response.data
  } catch (error) {
    console.error('Erro ao carregar treinos pré-montados:', error)
  } finally {
    carregandoTreinos.value = false
  }
}

async function carregarExercicios() {
  carregandoExercicios.value = true
  try {
    const response = await api.get('/exercicios')
    exerciciosDisponiveis.value = response.data
  } catch (error) {
    console.error('Erro ao carregar exercícios:', error)
  } finally {
    carregandoExercicios.value = false
  }
}

async function carregarTreinos() {
  loading.value = true
  try {
    const response = await api.get('/treinos')
    treinos.value = response.data
  } catch (error) {
    console.error('Erro ao carregar treinos:', error)
  } finally {
    loading.value = false
  }
}

function abrirModalCriar() {
  mostrarModalCriar.value = true
}

function fecharModalCriar() {
  mostrarModalCriar.value = false
}

function abrirModalDetalhes(treino: Treino) {
  treinoSelecionado.value = treino
  mostrarModalDetalhes.value = true
}

function fecharModalDetalhes() {
  mostrarModalDetalhes.value = false
  treinoSelecionado.value = null
}

function adicionarTreino(novoTreino: Treino) {
  treinos.value.push(novoTreino)
  fecharModalCriar()
}

function atualizarTreino(treinoAtualizado: Treino) {
  const index = treinos.value.findIndex(t => t.id === treinoAtualizado.id)
  if (index !== -1) {
    treinos.value[index] = treinoAtualizado
  }
  fecharModalDetalhes()
}

async function excluirTreino(id: number) {
  const index = treinos.value.findIndex(t => t.id === id)
  if (index !== -1) {
    treinos.value.splice(index, 1)
  }
  fecharModalDetalhes()
}
</script>

<style scoped>
@import '../assets/styles/variables.css';

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

.treino-page {
  min-height: 100vh;
  padding: 48px 16px;
}

.treino-header {
  max-width: 1200px;
  margin: 0 auto 64px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
}

.treino-header__content {
  flex: 1;
}

.treino-header__title {
  font-size: 48px;
  font-weight: var(--font-weight-bold);
  margin: 0 0 8px 0;
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.treino-header__text-white {
  color: var(--color-text-white);
}

.treino-header__text-highlight {
  color: var(--color-primary);
}

.treino-header__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
  font-weight: var(--font-weight-normal);
}

.treino-header__button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: var(--transition-base);
  white-space: nowrap;
}

.treino-header__button:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

.treino-header__button:active {
  transform: translateY(0);
}

.treino-header__button-icon {
  font-size: 18px;
  font-weight: bold;
}

.treino-empty {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 80px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.treino-empty__icon {
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
  color: var(--color-text-secondary);
  opacity: 0.5;
}

.treino-empty__title {
  font-size: var(--font-size-xl);
  color: var(--color-text-white);
  margin: 0 0 8px 0;
  font-weight: var(--font-weight-bold);
}

.treino-empty__text {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

.treino-container {
  max-width: 1200px;
  margin: 0 auto;
}

.treino-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.treino-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 24px;
  background: linear-gradient(135deg, var(--color-bg-card) 0%, rgba(26, 31, 46, 1) 100%);
  cursor: pointer;
  transition: var(--transition-base);
}

.treino-card:hover {
  border-color: var(--color-primary);
  background: linear-gradient(135deg, rgba(26, 31, 46, 1) 100%);
  transform: translateY(-4px);
}

.treino-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.treino-card__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 8px;
  color: var(--color-primary);
}

.treino-card__icon svg {
  width: 24px;
  height: 24px;
}

.treino-card__tipo {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 107, 53, 0.15);
  color: var(--color-primary);
  border-radius: 4px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.treino-card__title {
  font-size: var(--font-size-lg);
  color: var(--color-text-white);
  margin: 0 0 8px 0;
  font-weight: var(--font-weight-bold);
}

.treino-card__exercicios {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

@media (max-width: 768px) {
  .treino-page {
    padding: 32px 12px;
  }

  .treino-header {
    flex-direction: column;
    margin-bottom: 48px;
    gap: 24px;
  }

  .treino-header__title {
    font-size: 36px;
  }

  .treino-grid {
    grid-template-columns: 1fr;
  }

  .treino-empty {
    padding: 60px 16px;
  }
}

@media (max-width: 480px) {
  .treino-page {
    padding: 24px 8px;
  }

  .treino-header__title {
    font-size: 28px;
  }

  .treino-header__button {
    font-size: 12px;
    padding: 10px 16px;
  }
}
</style>