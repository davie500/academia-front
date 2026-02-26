<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal">
      <header class="modal-header">
        <h2 class="modal-title">Gerencie seus planos</h2>
      </header>

      <div class="modal-body">
        <div v-if="loading" class="loading">Carregando planos...</div>

        <div v-else>
          <div v-if="planos.length === 0">Nenhum plano encontrado.</div>

          <div class="plan-grid">
            <PricingCard
              v-for="plano in planos"
              :key="plano.nome"
              :plan="plano"
              :isPremium="plano === planoPremium"
              :nivelUsuario="nivelUsuario"
              :planoAtualNome="planoAtualNome"
              :planoPlainsMap="planoNivelMap"
              @downgrade-requested="handleDowngrade"
            />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import PricingCard from './PricingCard.vue'

const props = defineProps({
  planos: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  planoNivelMap: { type: Object, default: () => ({}) },
  planoAtualNome: { type: String, default: '' },
  nivelUsuario: { type: String, default: '' }
})

const planos = computed(() => props.planos)
const loading = computed(() => props.loading)
const planoNivelMap = computed(() => props.planoNivelMap)
const planoAtualNome = computed(() => props.planoAtualNome)
const nivelUsuario = computed(() => props.nivelUsuario)

function formatPrice(val) {
  if (!val) return ''
  return (Number(val)).toFixed(2)
}

const planoPremium = computed(() => {
  if (!planos.value || !planos.value.length) return null
  function getValorMaximo(plano) {
    if (plano.anual) return Number(plano.anual)
    if (plano.mensal) return Number(plano.mensal)
    return 0
  }
  return planos.value.reduce((maisCaro, atual) => getValorMaximo(atual) > getValorMaximo(maisCaro) ? atual : maisCaro)
})

const emit = defineEmits(['close','downgrade-requested'])

function handleDowngrade(planoNome) {
  emit('downgrade-requested', planoNome)
}

function close() { emit('close') }

onMounted(() => {
  try { document.body.style.overflow = 'hidden' } catch (e) {  }
})

onUnmounted(() => {
  try { document.body.style.overflow = '' } catch (e) {  }
})
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 60000;
}

.modal {
    width: 55%;
    max-width: 1200px;
    background: linear-gradient(145deg, var(--color-bg-card), rgba(26, 31, 46, 0.95));
    border-radius: 12px;
    padding: 20px 20px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.65);
    max-height: 95vh;
    min-height: 600px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    box-sizing: border-box;
}

.modal-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
}

.modal-title {
    margin: 0;
    color: var(--color-text-white);
    font-size: 20px;
    font-weight: 700;
}

.modal-body {
    flex: 1 1 auto;
    overflow: visible;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.plan-grid {
    display: flex;
    gap: 18px;
    align-items: flex-start;
    width: auto;
    align-content: center;
    justify-content: center;
    flex-wrap: wrap;
    padding: 6px 0;
}

.plan-grid>* {
    flex: 0 0 480px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 0;
}

.plan-info h4 {
    margin: 0 0 6px 0
}

.prices {
    font-size: 13px;
    color: var(--color-text-primary);
    display: flex;
    gap: 8px
}

.vantagens {
    margin: 8px 0 0 16px;
    padding: 0
}

.plan-actions {
    display: flex;
    align-items: center
}

.close {
    background: transparent;
    border: none;
    color: var(--color-text-white);
    font-size: 18px;
    cursor: pointer
}

.loading {
    color: var(--color-text-white);
    padding: 18px
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px
}

::v-deep .pricing-card {
    max-width: 320px !important;
    width: 100% !important;
    margin: 0 auto !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    aspect-ratio: 4 / 3;
    min-height: 420px;
    padding: 18px;
}

@media (max-width: 900px) {
    .plan-grid {
        flex-direction: column;
    }

    .modal-body {
        justify-content: flex-start;
    }
}

@media (max-width: 600px) {
    .modal {
        width: 95%;
        max-width: none;
        padding: 14px;
        max-height: 98vh;
    }

    .modal-backdrop {
        padding: 12px;
    }

    .modal-body {
        justify-content: flex-start;
    }
}
</style>
