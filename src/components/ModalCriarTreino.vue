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
        <div v-if="carregandoInicial" class="loading-inicial">
          <div class="loading-inicial__container">
            <div class="loading-inicial__spinner"></div>
            <h3 class="loading-inicial__title">Carregando dados</h3>
            <p class="loading-inicial__subtitle">Preparando para montar seu treino...</p>
            <div class="loading-inicial__items">
              <div class="loading-inicial__item" :class="{ 'loading-inicial__item--done': !carregandoTreinos }">
                <span class="loading-inicial__item-icon">{{ !carregandoTreinos ? '✓' : '' }}</span>
                <span class="loading-inicial__item-text">Treinos pré-montados</span>
              </div>
              <div class="loading-inicial__item" :class="{ 'loading-inicial__item--done': !carregandoExercicios }">
                <span class="loading-inicial__item-icon">{{ !carregandoExercicios ? '✓' : '' }}</span>
                <span class="loading-inicial__item-text">Exercícios disponíveis</span>
              </div>
            </div>
          </div>
        </div>

        <template v-else>
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
              :class="{ 
                'opcao-card--active': tipoSelecionado === 'personalizado',
                'opcao-card--bloqueado': nivelUsuario < 2
              }"
              @click="nivelUsuario >= 2 ? selecionarTipo('personalizado') : irParaPlanos()"
            >
              <div v-if="nivelUsuario < 2" class="opcao-card__overlay">
                <div class="opcao-card__lock">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L9 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4l-3-3zm0 5a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
                  </svg>
                </div>
                <p class="opcao-card__lock-text">Requer Plano Plus</p>
              </div>
              <h3 class="opcao-card__title">Treino Personalizado</h3>
              <p class="opcao-card__descricao">
                Monte seu treino do zero com exercícios customizados
              </p>
            </div>
          </div>

          <div v-if="tipoSelecionado === 'pre-montado' && !treinoSelecionado" class="treino-lista">
            <h3 class="treino-lista__title">Treinos Pré-montados</h3>
            <p class="treino-lista__subtitle">Selecione um treino profissional</p>

            <div v-if="carregandoTreinos" class="carregando">
              Carregando treinos...
            </div>

            <template v-else>
            <div class="treino-lista__pesquisa">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="treino-lista__pesquisa-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="pesquisaTreino"
                type="text"
                class="treino-lista__pesquisa-input"
                placeholder="Buscar treino por nome..."
              />
            </div>

            <div v-if="treinosFiltrados.length === 0" class="carregando">
              Nenhum treino encontrado
            </div>

            <div v-else class="treinos-opcoes">
              <div
                v-for="treino in treinosFiltrados"
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
              </div>
            </div>
          </template>
        </div>

        <div v-if="tipoSelecionado === 'pre-montado' && treinoSelecionado" class="detalhes-treino">
          <div class="detalhes-treino__header">
            <button class="detalhes-treino__voltar" @click="treinoSelecionado = null">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
          </div>

          <h3 class="detalhes-treino__titulo">{{ treinoSelecionado.nome }}</h3>
          
          <div class="detalhes-treino__tags">
            <span
              v-for="tag in treinoSelecionado.tags"
              :key="tag"
              class="detalhes-treino__tag"
            >
              {{ tag }}
            </span>
          </div>

          <div class="detalhes-treino__exercicios">
            <h4 class="detalhes-treino__exercicios-titulo">Exercícios</h4>
            <div v-if="carregandoDetalhes" class="carregando">
              Carregando detalhes do treino...
            </div>
            <div v-else-if="treinoSelecionado.exercicios.length === 0" class="sem-exercicios">
              Este treino não possui exercícios cadastrados.
            </div>
            <div v-else class="detalhes-treino__lista-exercicios">
              <div
                v-for="(exercicio, index) in treinoSelecionado.exercicios"
                :key="index"
                class="detalhes-exercicio"
              >
                <div class="detalhes-exercicio__numero">{{ index + 1 }}</div>
                <div class="detalhes-exercicio__info">
                  <p class="detalhes-exercicio__nome">{{ exercicio.nome }}</p>
                </div>
                <div class="detalhes-exercicio__stats">
                  <div class="detalhes-exercicio__stat">
                    <span class="detalhes-exercicio__stat-label">Séries</span>
                    <span class="detalhes-exercicio__stat-valor">{{ exercicio.pivot.series }}</span>
                  </div>
                  <div class="detalhes-exercicio__stat">
                    <span class="detalhes-exercicio__stat-label">Reps</span>
                    <span class="detalhes-exercicio__stat-valor">{{ exercicio.pivot.repeticoes }}</span>
                  </div>
                </div>
              </div>
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

          <div v-if="!carregandoExercicios" class="form-group">
            <label class="form-group__label">Filtrar por Grupo Muscular</label>
            <select v-model="grupoMuscularSelecionado" class="form-group__input">
              <option value="todos">Todos os grupos</option>
              <option v-for="grupo in gruposMusculares" :key="grupo" :value="grupo">
                {{ grupo }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-group__label">Selecionar Exercício</label>
            <div v-if="carregandoExercicios" class="carregando">
              Carregando exercícios...
            </div>
            <div v-else class="form-exercicio">
              <div class="form-exercicio__dropdown">
                <input
                  v-model="pesquisaExercicio"
                  type="text"
                  class="form-group__input form-exercicio__select"
                  placeholder="Buscar exercício..."
                  @focus="mostraDropdownExercicio = true"
                  @input="mostraDropdownExercicio = true"
                />
                <div v-if="mostraDropdownExercicio && exerciciosFiltrados.length > 0" class="form-exercicio__dropdown-menu">
                  <div
                    v-for="exercicio in exerciciosFiltrados"
                    :key="exercicio.id"
                    class="form-exercicio__dropdown-item"
                    @click="selecionarExercicioDropdown(exercicio)"
                  >
                    <div class="form-exercicio__dropdown-nome">{{ exercicio.nome }}</div>
                    <div class="form-exercicio__dropdown-grupo">{{ exercicio.grupo }} • {{ exercicio.membro_grupo }}</div>
                  </div>
                </div>
                <div v-else-if="mostraDropdownExercicio && pesquisaExercicio && exerciciosFiltrados.length === 0" class="form-exercicio__dropdown-vazio">
                  Nenhum exercício encontrado
                </div>
              </div>
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
        </template>
      </div>

      <div class="modal__footer">
        <button class="botao botao--secundario" @click="fechar" :disabled="isSalvando">Cancelar</button>
        <button
          v-if="tipoSelecionado === 'personalizado' && formularioTreino.exercicios.length > 0"
          class="botao botao--primario"
          @click="salvarTreinoPersonalizado"
          :disabled="isSalvando"
        >
          {{ isSalvando ? 'Salvando...' : 'Salvar Treino' }}
        </button>
        <button
          v-if="tipoSelecionado === 'pre-montado' && treinoSelecionado"
          class="botao botao--primario"
          @click="adicionarTreinoPremontado(treinoSelecionado)"
          :disabled="isSalvando"
        >
          {{ isSalvando ? 'Adicionando...' : 'Adicionar Treino' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import api from '../controller/api'

const toast = useToast()
const router = useRouter()

interface ExercicioBanco {
  id: number
  nome: string
  descricao?: string
  grupoMuscular?: string
}

interface PivotData {
  treino_id: number
  exercicio_id: number
  series: number
  repeticoes: number
  created_at: string
  updated_at: string
}

interface ExercicioTreino {
  id: number
  nome: string
  grupo: string
  membro_grupo: string
  descricao?: string
  media_url?: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
  pivot: PivotData
}

interface TreinoPremontado {
  id: number
  nome: string
  tipo?: string
  usuario_id?: number | null
  created_at?: string
  updated_at?: string
  exercicios: ExercicioTreino[]
  tags?: string[]
}

interface ExercicioPersonalizado {
  id: number
  nome: string
  series: number
  repeticoes: number
}

interface FormularioTreino {
  nome: string
  exercicios: ExercicioPersonalizado[]
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
const treinoSelecionado = ref<TreinoPremontado | null>(null)
const carregandoDetalhes = ref(false)
const carregandoTreinos = ref(true)
const carregandoExercicios = ref(true)
const isSalvando = ref(false)
const usuarioId = ref<number | null>(null)
const nivelUsuario = ref<number>(0)
const pesquisaTreino = ref('')
const exerciciosDisponiveis = ref<ExercicioBanco[]>([])
const grupoMuscularSelecionado = ref<string>('todos')
const pesquisaExercicio = ref('')
const mostraDropdownExercicio = ref(false)
const novoExercicio = ref<NovoExercicio>({
  id: '',
  series: 3,
  repeticoes: 12
})
const formularioTreino = ref<FormularioTreino>({
  nome: '',
  exercicios: []
})
interface ExercicioBanco {
  id: number
  nome: string
  grupo: string
  membro_grupo: string
  descricao?: string
  media_url?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}
const treinosFiltrados = computed(() => {
  if (!pesquisaTreino.value.trim()) {
    return treinosPremontados.value
  }
  
  const termo = pesquisaTreino.value.toLowerCase()
  return treinosPremontados.value.filter(treino =>
    treino.nome.toLowerCase().includes(termo)
  )
})

const gruposMusculares = computed(() => {
  const grupos = new Set(exerciciosDisponiveis.value.map(ex => ex.grupo))
  return Array.from(grupos).sort()
})

const exerciciosFiltrados = computed(() => {
  let filtrados = exerciciosDisponiveis.value
  
  // Filtro por grupo muscular
  if (grupoMuscularSelecionado.value !== 'todos') {
    filtrados = filtrados.filter(ex => ex.grupo === grupoMuscularSelecionado.value)
  }
  
  // Filtro por pesquisa
  if (pesquisaExercicio.value.trim()) {
    const termo = pesquisaExercicio.value.toLowerCase()
    filtrados = filtrados.filter(exercicio =>
      exercicio.nome.toLowerCase().includes(termo) ||
      exercicio.membro_grupo.toLowerCase().includes(termo)
    )
  }
  
  return filtrados
})

const carregandoInicial = computed(() => {
  return carregandoTreinos.value || carregandoExercicios.value
})

onMounted(async () => {
  await carregarUsuarioId()
  await carregarTreinosPremontados()
  await carregarExercicios()
  console.log(nivelUsuario.value)
})

async function carregarUsuarioId() {
  try {
    const response = await api.get('/auth/me')
    usuarioId.value = response.data.id
    nivelUsuario.value = response.data.assinatura.plano.nivel.nome || 1
    console.log(response.data)
  } catch (error) {
    console.error('Erro ao carregar ID do usuário:', error)
  }
}

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

function selecionarTipo(tipo: 'pre-montado' | 'personalizado') {
  tipoSelecionado.value = tipo
}

function selecionarExercicioDropdown(exercicio: ExercicioBanco) {
  novoExercicio.value.id = exercicio.id
  pesquisaExercicio.value = exercicio.nome
  mostraDropdownExercicio.value = false
}

function fecharDropdownExercicio() {
  mostraDropdownExercicio.value = false
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
  treinoSelecionado.value = treino
}

async function adicionarTreinoPremontado(treino: TreinoPremontado) {
  isSalvando.value = true
  try {
    const payload = {
      nome: treino.nome,
      tipo: 'Pré-montado',
      usuario_id: usuarioId.value,
      exercicios: treino.exercicios.map(exercicio => ({
        exercicio_id: exercicio.id,
        series: exercicio.pivot.series,
        repeticoes: exercicio.pivot.repeticoes
      }))
    }
    
    const response = await api.post('/treinos', payload)
    toast.success('Treino pré-montado adicionado com sucesso!')
    emit('treino-criado', response.data)
    resetarFormulario()
    fechar()
  } catch (error) {
    console.error('Erro ao adicionar treino:', error)
    toast.error('Erro ao adicionar treino pré-montado')
  } finally {
    isSalvando.value = false
  }
}

async function salvarTreinoPersonalizado() {
  if (!formularioTreino.value.nome.trim()) {
    toast.warning('Por favor, insira um nome para o treino')
    return
  }

  isSalvando.value = true
  try {
    const payload = {
      nome: formularioTreino.value.nome,
      tipo: 'Personalizado',
      usuario_id: usuarioId.value,
      exercicios: formularioTreino.value.exercicios.map(exercicio => ({
        exercicio_id: exercicio.id, 
        series: exercicio.series,
        repeticoes: exercicio.repeticoes
      }))
    }
    
    const response = await api.post('/treinos', payload)
    toast.success('Treino personalizado salvo com sucesso!')
    emit('treino-criado', response.data)
    resetarFormulario()
    fechar()
  } catch (error) {
    console.error('Erro ao salvar treino:', error)
    toast.error('Erro ao salvar treino personalizado')
  } finally {
    isSalvando.value = false
  }
}

function resetarFormulario() {
  tipoSelecionado.value = null
  treinoSelecionado.value = null
  formularioTreino.value = {
    nome: '',
    exercicios: []
  }
  pesquisaTreino.value = ''
  pesquisaExercicio.value = ''
  grupoMuscularSelecionado.value = 'todos'
  mostraDropdownExercicio.value = false
  novoExercicio.value = {
    id: '',
    series: 3,
    repeticoes: 12
  }
}

function irParaPlanos() {
  resetarFormulario()
  emit('fechar')
  router.push('/planos')
}

function fechar() {
  resetarFormulario()
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
  z-index: 100000;
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
  position: relative;
}

.opcao-card:hover {
  border-color: var(--color-primary);
  background: rgba(255, 107, 53, 0.1);
}

.opcao-card--active {
  border-color: var(--color-primary);
  background: rgba(255, 107, 53, 0.1);
}

.opcao-card--bloqueado {
  cursor: not-allowed;
}

.opcao-card--bloqueado:hover {
  border-color: var(--color-border);
  background: rgba(26, 31, 46, 0.5);
}

.opcao-card__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  border-radius: var(--radius-md);
  z-index: 10;
}

.opcao-card__lock {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.2);
  border-radius: 50%;
  margin-bottom: 12px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.opcao-card__lock svg {
  width: 32px;
  height: 32px;
  color: #ef4444;
}

.opcao-card__lock-text {
  font-size: var(--font-size-sm);
  color: #ef4444;
  margin: 0;
  font-weight: var(--font-weight-bold);
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

.treino-lista__pesquisa {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.treino-lista__pesquisa-icon {
  position: absolute;
  left: 12px;
  width: 18px;
  height: 18px;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.treino-lista__pesquisa-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-white);
  font-size: var(--font-size-sm);
  transition: var(--transition-base);
}

.treino-lista__pesquisa-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: rgba(255, 107, 53, 0.05);
}

.treino-lista__pesquisa-input::placeholder {
  color: var(--color-text-secondary);
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

.form-group__input[type="select"],
.form-group__input {
  font-family: inherit;
}

select.form-group__input {
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-white);
  font-size: var(--font-size-base);
  transition: var(--transition-base);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ff6b35' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

select.form-group__input:focus {
  outline: none;
  border-color: var(--color-primary);
  background-color: rgba(255, 107, 53, 0.05);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ff6b35' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

select.form-group__input option {
  background: var(--color-bg-darker);
  color: var(--color-text-white);
}

.form-exercicio {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.form-exercicio__dropdown {
  position: relative;
  flex: 1;
}

.form-exercicio__dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.form-exercicio__dropdown-item {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: var(--transition-base);
}

.form-exercicio__dropdown-item:hover {
  background: rgba(255, 107, 53, 0.1);
}

.form-exercicio__dropdown-item:last-child {
  border-bottom: none;
}

.form-exercicio__dropdown-nome {
  font-size: var(--font-size-sm);
  color: var(--color-text-white);
  font-weight: var(--font-weight-bold);
  margin-bottom: 4px;
}

.form-exercicio__dropdown-grupo {
  font-size: 11px;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-normal);
}

.form-exercicio__dropdown-vazio {
  padding: 16px 12px;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
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

.detalhes-treino {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detalhes-treino__header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.detalhes-treino__voltar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  transition: var(--transition-base);
}

.detalhes-treino__voltar:hover {
  color: var(--color-primary-dark);
}

.detalhes-treino__voltar svg {
  width: 20px;
  height: 20px;
}

.detalhes-treino__titulo {
  font-size: var(--font-size-xl);
  color: var(--color-text-white);
  margin: 0;
  font-weight: var(--font-weight-bold);
}

.detalhes-treino__tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.detalhes-treino__tag {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(255, 107, 53, 0.15);
  color: var(--color-primary);
  border-radius: 4px;
  font-size: 12px;
  font-weight: var(--font-weight-bold);
}

.detalhes-treino__exercicios {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detalhes-treino__exercicios-titulo {
  font-size: var(--font-size-lg);
  color: var(--color-text-white);
  margin: 0;
  font-weight: var(--font-weight-bold);
}

.detalhes-treino__lista-exercicios {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detalhes-exercicio {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: rgba(26, 31, 46, 0.5);
  transition: var(--transition-base);
}

.detalhes-exercicio:hover {
  border-color: var(--color-primary);
  background: rgba(255, 107, 53, 0.05);
}

.detalhes-exercicio__numero {
  width: 36px;
  height: 36px;
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

.detalhes-exercicio__info {
  flex: 1;
}

.detalhes-exercicio__nome {
  font-size: var(--font-size-sm);
  color: var(--color-text-white);
  margin: 0;
  font-weight: var(--font-weight-bold);
}

.detalhes-exercicio__stats {
  display: flex;
  gap: 16px;
  align-items: center;
}

.detalhes-exercicio__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(255, 107, 53, 0.2);
}

.detalhes-exercicio__stat-label {
  font-size: 11px;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detalhes-exercicio__stat-valor {
  font-size: 18px;
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
}

.detalhes-exercicio__series {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin: 4px 0 0 0;
}

.sem-exercicios {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 24px;
  font-size: var(--font-size-sm);
}

.loading-inicial {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 40px 24px;
}

.loading-inicial__container {
  text-align: center;
  max-width: 300px;
}

.loading-inicial__spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 24px;
  border: 4px solid rgba(255, 107, 53, 0.1);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-inicial__title {
  font-size: var(--font-size-lg);
  color: var(--color-text-white);
  margin: 0 0 8px 0;
  font-weight: var(--font-weight-bold);
}

.loading-inicial__subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0 0 24px 0;
}

.loading-inicial__items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading-inicial__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 107, 53, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(255, 107, 53, 0.1);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.loading-inicial__item--done {
  background: rgba(34, 197, 94, 0.05);
  border-color: rgba(34, 197, 94, 0.2);
}

.loading-inicial__item-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 50%;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.loading-inicial__item--done .loading-inicial__item-icon {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.loading-inicial__item-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: left;
}

.loading-inicial__item--done .loading-inicial__item-text {
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