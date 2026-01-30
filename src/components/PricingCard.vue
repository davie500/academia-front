<template>
  <div :class="['pricing-card', { 'pricing-card--premium': isPremium }]">
    <!-- Badge Popular -->
    <div v-if="isPremium" class="pricing-card__badge">
      MAIS POPULAR
    </div>

    <!-- Card Content -->
    <div class="pricing-card__content">
      <!-- Title and Price -->
      <h3 class="pricing-card__title">{{ plan.title }}</h3>
      <div class="pricing-card__price">
        <span class="pricing-card__amount">{{ plan.price }}</span>
        <span class="pricing-card__period">/{{ plan.period }}</span>
      </div>

      <!-- Benefits List -->
      <ul class="pricing-card__benefits">
        <li v-for="(benefit, index) in plan.benefits" :key="index" class="pricing-card__benefit">
          <svg class="pricing-card__checkmark" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="pricing-card__benefit-text">{{ benefit }}</span>
        </li>
      </ul>
    </div>

    <!-- Button -->
    <button :class="['pricing-card__button', { 'pricing-card__button--orange': isPremium }]">
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Plan {
  title: string;
  price: string;
  period: string;
  benefits: string[];
}

withDefaults(
  defineProps<{
    plan: Plan;
    isPremium?: boolean;
    buttonText?: string;
  }>(),
  {
    buttonText: 'Assinar Agora'
  }
);
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

/* Responsive */
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