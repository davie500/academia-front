<template>
  <div class="planos-page">
    <!-- Header -->
    <div class="planos-header">
      <h1 class="planos-header__title">
        <span class="planos-header__text-white">Escolha o Plano </span>
        <span class="planos-header__text-highlight">Ideal</span>
        <span class="planos-header__text-white"> Para Você</span>
      </h1>
      <p class="planos-header__subtitle">
        Planos flexíveis para alcançar seus objetivos
      </p>
    </div>

    <!-- Pricing Cards Grid -->
    <div class="planos-container">
      <div class="planos-grid">
        <PricingCard
          v-for="plan in planos"
          :key="plan.id"
          :plan="plan"
          :isPremium="plan.id === 'premium'"
        />
      </div>
    </div>

    <!-- Footer Info -->
    <div class="planos-footer">
      <div class="planos-footer__content">
        <p class="planos-footer__text">
          ✓ Todos os planos incluem: WiFi gratuito, estacionamento e sem fidelidade
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import PricingCard from '../components/PricingCard.vue';
import api from '../controller/api'

const planos = ref<Plano[]>([
]);

interface Plano {
  nome: string;
  preco: string;
  periodo: string;
  benefits: string[];
}

onMounted(async() => {
   const response = await api.get('/api/planos')
   planos.value = response.data
   console.log(planos.value)
});

</script>

<style scoped>
.planos-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #0f1419 0%, #000000 50%, #0f1419 100%);
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
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  align-items: center;
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

/* Responsive */
@media (max-width: 1024px) {
  .planos-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .planos-header__title {
    font-size: 40px;
  }
}

@media (max-width: 768px) {
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