<template>
  <div :class="['pricing-card', { 'pricing-card--premium': isPremium }]">
    <div v-if="isPremium" class="pricing-card__badge">
      Opção Popular
    </div>

    <div class="pricing-card__content">
      <h3 class="pricing-card__title">{{ plan.nome }}</h3>

      <div class="pricing-card__price">
        <div v-if="plan.mensal">
          <span class="pricing-card__amount">
            R$ {{ plan.mensal }}
          </span>
          <span class="pricing-card__period">/ mensal</span>
        </div>

        <div v-if="plan.anual" style="margin-top: 12px;">
          <span class="pricing-card__amount">
            R$ {{ plan.anual }}
          </span>
          <span class="pricing-card__period">/ anual</span>
        </div>
      </div>

      <ul class="pricing-card__benefits">
        <li
          v-for="vantagem in plan.vantagens"
          :key="vantagem.id"
          class="pricing-card__benefit"
        >
          <svg
            class="pricing-card__checkmark"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>

          <span class="pricing-card__benefit-text">
            {{ vantagem.nome }}
          </span>

          
        </li>

        <li
          v-if="plan.vantagens.length === 0"
          class="pricing-card__benefit"
        >
          <span class="pricing-card__benefit-text">
            Nenhuma vantagem inclusa
          </span>
        </li>
      </ul>
    </div>

    <button
      :class="[
        'pricing-card__button',
        { 
          'pricing-card__button--orange': isPremium,
          'pricing-card__button--atual': planoStatus.tipo === 'atual',
          'pricing-card__button--incluido': planoStatus.tipo === 'incluido',
          'pricing-card__button--upgrade': planoStatus.tipo === 'upgrade'
        }
      ]"
      @click="handleButtonClick"
      :disabled="planoStatus.tipo === 'atual'"
    >
      {{ planoStatus.label }}
    </button>

    <div v-if="showConfirmModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal__icon-warning">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v.01" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <div class="modal__content">
          <h2 class="modal__title">Confirmar alteração de plano</h2>
          <p class="modal__message">Você deseja mesmo atualizar seu plano para a versão inferior? Algumas de suas funcionalidades podem parar de funcionar.</p>
        </div>

        <div class="modal__footer">
          <button class="botao botao--secundario" @click="closeModal">Cancelar</button>
          <button class="botao botao--danger" @click="confirmDowngrade">Ok</button>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">

import { useRouter } from 'vue-router'
import { computed } from 'vue'

interface Vantagem {
  id: number;
  nome: string;
  descricao: string;
}

interface PlanoAgrupado {
  nome: string;
  mensal?: string;
  anual?: string;
  vantagens: Vantagem[];
}

const props = withDefaults(
  defineProps<{
    plan: PlanoAgrupado;
    isPremium?: boolean;
    buttonText?: string;
    nivelUsuario?: string;
    planoAtualNome?: string;
    planoPlainsMap?: Record<string, number>;
  }>(),
  {
    buttonText: 'Assinar Agora'
  }
)

const router = useRouter()
const emit = defineEmits<{
  (e: 'downgrade-requested', planoNome: string): void
}>()

import { ref } from 'vue'
const showConfirmModal = ref(false)

const planoStatus = computed(() => {
  if (!props.planoAtualNome) {
    return {
      tipo: 'assinar',
      label: 'Assinar Agora',
      descricao: ''
    }
  }

  if (props.planoAtualNome === props.plan.nome) {
    return {
      tipo: 'atual',
      label: 'Plano Atual',
      descricao: 'Você está usando este plano'
    }
  }

  const nivelAtual = props.planoPlainsMap?.[props.planoAtualNome] || 0
  const nivelNovo = props.planoPlainsMap?.[props.plan.nome] || 0

  if (nivelNovo > nivelAtual) {
    return {
      tipo: 'upgrade',
      label: 'Atualizar Plano',
      descricao: 'Upgrade disponível'
    }
  }

  if (nivelNovo < nivelAtual) {
    return {
      tipo: 'incluido',
      label: 'Incluído no Plano Atual',
      descricao: 'Já incluso na sua assinatura'
    }
  }

  return {
    tipo: 'assinar',
    label: 'Assinar Agora',
    descricao: ''
  }
})

function assinarPlano() {
  const plano = props.plan.nome.toLowerCase()

  router.push({
    path: '/pagamento',
    query: {
      plano
    }
  })
}

function handleButtonClick() {
  const tipo = planoStatus.value.tipo

  if (tipo === 'incluido') {
    showConfirmModal.value = true
    return
  }

  if (tipo === 'atual') {
    return
  }

  assinarPlano()
}

function closeModal() {
  showConfirmModal.value = false
}

function confirmDowngrade() {
  emit('downgrade-requested', props.plan.nome)
  showConfirmModal.value = false
}

</script>



<style scoped>
.pricing-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #4b5563;
  border-radius: 12px;
  padding: 32px;
  background: linear-gradient(135deg, #1a1f2e 0%, #0f1419 100%);
  transition: all 0.3s ease;
}

.pricing-card--premium {
  border: 2px solid #ff6b35;
  transform: scale(1.05);
  box-shadow: 0 20px 60px rgba(255, 107, 53, 0.2);
  background: linear-gradient(135deg, #1a2332 0%, #0f1419 100%);
}

.pricing-card__badge {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff6b35;
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 18px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.pricing-card__content {
  flex: 1;
  margin-bottom: 24px;
}

.pricing-card__title {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
  text-align: center;
}

.pricing-card__price {
  margin-bottom: 32px;
}

.pricing-card__amount {
  font-size: 40px;
  font-weight: 700;
  color: #ff6b35;
  line-height: 1;
}

.pricing-card__period {
  color: #94a3b8;
  font-size: 14px;
  margin-left: 4px;
}

.pricing-card__benefits {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pricing-card__benefit {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.pricing-card__checkmark {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #ff6b35;
  margin-top: 2px;
}

.pricing-card__benefit-text {
  font-size: 14px;
  color: #cbd5e1;
  line-height: 1.4;
}

.pricing-card__button {
  width: 100%;
  padding: 14px 16px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 700;
  background: #e63946;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
}

.pricing-card__button:hover {
  background: #d62828;
}

.pricing-card__button:active {
  transform: scale(0.98);
}

.pricing-card__button--orange {
  background: #ff6b35;
}

.pricing-card__button--orange:hover {
  background: #ff5722;
}

.pricing-card__button--atual {
  background: #64748b;
  cursor: default;
}

.pricing-card__button--atual:hover {
  background: #64748b;
}

.pricing-card__button--incluido {
  background: #10b981;
  cursor: default;
}

.pricing-card__button--incluido:hover {
  background: #10b981;
}

.pricing-card__button--upgrade {
  background: #ff6b35;
}

.pricing-card__button--upgrade:hover {
  background: #ff5722;
}

.pricing-card__button:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

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
  animation: fadeIn 0.18s ease-in-out;
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
  max-width: 480px;
  width: 100%;
  padding: 28px 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: slideUp 0.26s ease-out;
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

.modal__icon-warning {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 107, 53, 0.08);
  border-radius: 50%;
  color: var(--color-primary);
  margin-bottom: 18px;
}

.modal__icon-warning svg {
  width: 32px;
  height: 32px;
}

.modal__content {
  margin-bottom: 20px;
}

.modal__title {
  font-size: var(--font-size-lg);
  color: var(--color-text-white);
  margin: 0 0 8px 0;
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
  margin-top: 8px;
}

.botao {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: var(--transition-base);
  display: inline-flex;
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
  background: rgba(255, 107, 53, 0.04);
}

.botao--danger {
  background: var(--color-primary);
  color: #071129;
}

.botao--danger:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .pricing-card {
    padding: 24px;
  }

  .pricing-card--premium {
    transform: scale(1);
  }

  .pricing-card__title {
    font-size: 20px;
  }

  .pricing-card__amount {
    font-size: 32px;
  }
}
</style>