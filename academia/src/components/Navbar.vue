<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <button class="navbar-burger" aria-label="menu" aria-expanded="false" @click="toggle">
        <span class="burger-line"></span>
        <span class="burger-line"></span>
        <span class="burger-line"></span>
      </button>
      <router-link :to="{ name: 'Dashboard'}" class="brand-title">FITFORCE</router-link>
    </div>

    <div class="navbar-menu" :class="{ 'is-active': open }">
      <div class="navbar-start">
        <router-link class="navbar-item" :to="{ name: 'Notas'}">ANOTAÇÕES</router-link>
        <router-link class="navbar-item" :to="{ name: 'Treinos'}">TREINOS</router-link>
        <router-link class="navbar-item" :to="{ name: 'Perfil'}">PERFIL</router-link>
      </div>

      <div class="navbar-end">
        <div class="buttons">
            <router-link class="button is-primary" :to="{ name: 'Login'}">
              LOGIN
            </router-link>
        </div>
      </div>
    </div>
    <div v-if="open" class="backdrop" @click="toggle"></div>
  </nav>
</template>

<script setup lang="ts">
import type router from '@/router/Index';
import { ref } from 'vue'
const open = ref(false)
function toggle() {
  open.value = !open.value
}
</script>

<style>
.navbar {
  background-image: linear-gradient(to right, #dd0909, #e18e12);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.navbar-brand {
  font-weight: bold;
}
.brand-title {
  margin: 0;
  font-size: 1.5rem;
  color: white;
  text-decoration: none;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.navbar-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  gap: 2rem;
  flex-wrap: wrap;
}
.navbar-start {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}
.navbar-end {
  display: flex;
  align-items: center;
}
.navbar-item {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}
.navbar-item:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
.buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}
.is-primary {
  background-color: #000000;
  color: white;
}
.is-primary:hover {
  background-color: #333333;
}
.is-light {
  background-color: #ffffff;
  color: #000000;
}
.is-light:hover {
  background-color: #e8e8e8;
}

.navbar-burger {
  display: none;
  background: transparent;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
}
.burger-line {
  display: block;
  width: 22px;
  height: 2px;
  background: white;
  margin: 4px 0;
}

@media (max-width: 768px) {
  .navbar {
    padding: 0.5rem 0.75rem;
    position: relative;
  }
  .navbar-burger {
    display: inline-block;
    margin-left: 0.75rem;
  }
  .navbar-menu {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 260px;
    max-width: 80%;
    background-image: linear-gradient(to right, #dd0909, #e18e12);
    color: white;
    padding: 1.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transform: translateX(-110%);
    transition: transform 0.25s ease;
    z-index: 1001;
  }
  .navbar-menu.is-active {
    transform: translateX(0);
  }

  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 1000;
  }

  .navbar-start,
  .navbar-end {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
    width: 100%;
  }
  .navbar-item,
  .button {
    width: 100%;
    text-align: left;
    padding: 0.75rem 0.5rem;
    border-radius: 6px;
  }
  .buttons {
    justify-content: flex-start;
    gap: 0.5rem;
    flex-direction: column;
  }
}

.is-secondary {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.85);
  color: white;
  display: none;
}
.is-secondary:hover {
  background: rgba(255,255,255,0.06);
}

@media (max-width: 768px) {
  .is-secondary { display: inline-block; }
}
</style>