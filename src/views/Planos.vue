<template>

  <LoadingOverlay
    :show="loading"
    message="Carregando dados dos planos..."
  />

  <div v-if="!loading" class="planos-page">
    <div class="planos-header">
      <h1 class="planos-header__title">
        <span class="planos-header__text-white">
          Escolha o Plano
        </span>

        <span class="planos-header__text-highlight">
          Ideal
        </span>

        <span class="planos-header__text-white">
          Para Você
        </span>
      </h1>

      <p class="planos-header__subtitle">
        Planos flexíveis para alcançar seus objetivos
      </p>
    </div>

    <div class="planos-container">
      <div class="planos-grid">
        <PricingCard
          v-for="plan in planos"
          :key="plan.nome"
          :plan="plan"
          :isPremium="plan === planoPremium"
          :nivelUsuario="nivelUsuario"
          :planoAtualNome="planoAtualNome"
          :planoPlainsMap="planoNivelMap"
          @downgrade-requested="handleDowngrade"
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { computed } from 'vue'
import { useToast } from 'vue-toastification'
import PricingCard from '../components/PricingCard.vue';
import api from '../controller/api'
import LoadingOverlay from '../components/LoadingOverlay.vue';
// @ts-ignore
import { useAuth } from '@/stores/auth.js'

const auth = useAuth()

const planos = ref<PlanoAgrupado[]>([
]);

const loading = ref(false);
const nivelUsuario = ref<string>('');
const planoAtualNome = ref<string>('');
const planoAtualStatus = ref<string>('');
const planoNivelMap = ref<Record<string, number>>({});

interface Vantagem {
  id: number;
  nome: string;
  descricao: string;
}

interface ApiPlanoPeriodo {
  plano: {
    nome: string
    nivel?: {
      id: number
      nome: string | number
    }
    vantagens: Vantagem[]
  }
  periodo: {
    nome: 'Mensal' | 'Anual'
  }
  preco: {
    valor: string
  }
}

interface PlanoAgrupado {
  nome: string;
  mensal?: string;
  anual?: string;
  vantagens: Vantagem[];
  nivel?: number;
}


onMounted(async () => {
  loading.value = true

  try {
    if (auth.token) {
      await carregarDadosUsuario()
    }
    
    const response = await api.get('/planoPeriodo')

  const mapa: Record<string, PlanoAgrupado> = {}

  response.data.forEach((item: ApiPlanoPeriodo) => {
    const nomePlano = item.plano.nome

    if (!mapa[nomePlano]) {
      mapa[nomePlano] = {
        nome: nomePlano,
        mensal: undefined,
        anual: undefined,
        vantagens: [],
        nivel: item.plano.nivel ? Number(item.plano.nivel.id) : undefined
      }
    }

    const planoAtual = mapa[nomePlano]!

    if (item.periodo.nome === 'Mensal') {
      planoAtual.mensal = item.preco.valor
    }

    if (item.periodo.nome === 'Anual') {
      planoAtual.anual = item.preco.valor
    }

    item.plano.vantagens.forEach(vantagem => {
      const existe = planoAtual.vantagens.some(
        v => v.id === vantagem.id
      )

      if (!existe) {
        planoAtual.vantagens.push(vantagem)
      }
    })
  })

  planos.value = Object.values(mapa)
  
  planos.value.forEach((plano, index) => {
    if (plano.nivel) {
      planoNivelMap.value[plano.nome] = plano.nivel
    } else {
      planoNivelMap.value[plano.nome] = index + 1
    }
  })
  } catch (error) {
    console.error('Erro ao carregar planos', error)
  } finally {
    loading.value = false
  }
})

async function carregarDadosUsuario() {
  try {
    const response = await api.get('/auth/me')
    const assinatura = response.data.assinatura
    planoAtualStatus.value = assinatura?.status || ''
    if (assinatura && assinatura.status === 'active' && assinatura.plano?.nivel?.nome) {
      nivelUsuario.value = assinatura.plano.nivel.nome
      planoAtualNome.value = assinatura.plano.nome
    } else {
      nivelUsuario.value = ''
      planoAtualNome.value = ''
    }
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error)
  }
}

function getValorMaximo(plano: PlanoAgrupado): number {
  if (plano.anual) return Number(plano.anual)
  if (plano.mensal) return Number(plano.mensal)
  return 0
}

const planoPremium = computed(() => {
  if (planos.value.length === 0) return null

  return planos.value.reduce((maisCaro, atual) => {
    return getValorMaximo(atual) > getValorMaximo(maisCaro)
      ? atual
      : maisCaro
  })
})

const toast = useToast()

function handleDowngrade(planoNome: string) {
  toast.info(`Solicitação de alteração para o plano "${planoNome}" confirmada.`)
}

</script>

<style scoped>
.planos-page {
  min-height: 100vh;
  background-image: url('https://img.freepik.com/fotos-gratis/estilo-de-vida-de-equipamentos-de-escritorio-recreacao-de-fitness_1203-5058.jpg?semt=ais_hybrid&w=740&q=80');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: rgba(0, 0, 0, 0.75);
  background-blend-mode: overlay;
  padding: 48px 16px;
}

.planos-header {
  max-width: 1200px;
  margin: 0 auto 64px;
  text-align: center;
}

.planos-header__title {
  font-size: 56px;
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.1;
  letter-spacing: -1px;
}

.planos-header__text-white {
  color: white;
}

.planos-header__text-highlight {
  color: #ff6b35;
}

.planos-header__subtitle {
  font-size: 18px;
  color: #94a3b8;
  margin: 0;
  font-weight: 400;
}

.planos-container {
  max-width: 1200px;
  margin: 0 auto 48px;
}

.planos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 360px));
  gap: 32px;
  justify-content: center;
}

.planos-footer {
  max-width: 1200px;
  margin: 0 auto;
}

.planos-footer__content {
  border: 1px solid #4b5563;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  padding: 24px;
  text-align: center;
}

.planos-footer__text {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

@media (max-width: 1024px) {
  .planos-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .planos-header__title {
    font-size: 40px;
  }
}

@media (max-width: 768px) {
  .planos-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .planos-page {
    padding: 32px 12px;
  }

  .planos-header {
    margin-bottom: 48px;
  }

  .planos-header__title {
    font-size: 32px;
  }

  .planos-header__subtitle {
    font-size: 16px;
  }

  .planos-container {
    margin-bottom: 32px;
  }
}

@media (max-width: 480px) {
  .planos-page {
    padding: 24px 8px;
  }

  .planos-header__title {
    font-size: 28px;
  }

  .planos-header__subtitle {
    font-size: 14px;
  }
}
</style>