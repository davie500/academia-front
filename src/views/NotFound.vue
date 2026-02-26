<template>
  <div class="notfound-page">
    <div class="notfound-card">
      <h1 class="notfound-code">404</h1>
      <p class="notfound-text">Página não encontrada</p>
      <router-link to="/" class="notfound-button">Voltar para Home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
@import '../assets/styles/variables.css';

.notfound-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.notfound-card {
  width: 100%;
  max-width: 720px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 36px 28px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
  text-align: center;
}

.notfound-code {
  font-size: clamp(48px, 12vw, 120px);
  margin: 0;
  color: var(--color-text-white);
  font-weight: var(--font-weight-bold);
  letter-spacing: -2px;
}

.notfound-text {
  margin: 12px 0 20px 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.notfound-button {
  display: inline-block;
  padding: 12px 24px;
  background: var(--color-primary);
  color: var(--color-text-white);
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: var(--font-weight-bold);
  transition: var(--transition-base);
}

.notfound-button:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .notfound-card {
    padding: 24px 18px;
  }

  .notfound-text {
    font-size: 1rem;
  }
}
</style>