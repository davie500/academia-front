<template>
  <div v-if="show" class="loading-overlay" role="status" aria-live="polite">
    <div class="panel">
      <div class="spinner" aria-hidden="true"></div>
      <div class="message">{{ message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  message: { type: String, default: 'Carregando...' }
})
</script>

<style scoped>
@import "../assets/styles/variables.css";

.loading-overlay{
  position:fixed;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  background: rgba(0,0,0,1);
  z-index:1200;
}
.panel{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:12px;
  padding:18px 26px;
  min-width:220px;
}
.spinner{
  width:56px;
  height:56px;
  border-radius:50%;
  border:6px solid rgba(255,255,255,0.08);
  border-top-color: var(--color-primary);
  animation: spin 1s linear infinite;
}
.message{
  color:var(--color-text-primary);
  font-weight:700;
  font-size:14px;
  text-align:center;
}

@keyframes spin{
  to{ transform: rotate(360deg); }
}
</style>
