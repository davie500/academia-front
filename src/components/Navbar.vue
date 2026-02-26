<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <h1 class="brand-title">Treos</h1>
    </div>

    <button class="side-toggle" @click="togglePanel" :aria-expanded="isOpen" aria-label="Abrir menu" role="button" tabindex="0" @keydown.enter="togglePanel">
      <span class="hamburger" aria-hidden="true"><span></span><span></span><span></span></span>
    </button>

    <div class="navbar-menu">
      <div class="navbar-end">
        <div class="login-wrap">
          <template v-if="isAuthenticated">
            <button class="auth-btn auth-btn--logout" @click="logout">
              <svg class="auth-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sair
            </button>
          </template>
          <template v-else>
            <router-link class="auth-btn auth-btn--login" to="/login">
              <svg class="auth-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              Login
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>

  <div class="backdrop" v-if="isOpen" @click="closePanel" :style="{ background: `rgba(0,0,0,${backdropOpacity})` }"></div>
  <aside class="side-panel" :class="{ open: isOpen }" @click.self="closePanel">
    <div class="side-panel-inner">
      <nav class="side-nav">
        <template v-for="(item, i) in navItems" :key="i">
          <router-link v-if="showItem(item) && !isLocked(item)" class="side-link" :to="item.path" @click="closePanel">{{ item.label }}</router-link>

          <div v-else-if="showItem(item) && isLocked(item)" class="side-link locked" role="button" tabindex="0" @click="handleLockedClick(item)" @keydown.enter="handleLockedClick(item)" :aria-disabled="true" :title="item.lockTitle || 'Bloqueado'">
            <span>{{ item.label }}</span>
            <svg class="lock-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="currentColor"/>
              <path d="M17 8h-1V6a4 4 0 10-8 0v2H7a1 1 0 00-1 1v9a1 1 0 001 1h10a1 1 0 001-1V9a1 1 0 00-1-1zm-7-2a2 2 0 114 0v2h-4V6z" fill="currentColor"/>
            </svg>
          </div>
        </template>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const isOpen = ref(false)

const auth = useAuth()
const toast = useToast()

const isAuthenticated = computed(() => auth.isAuthenticated)
const userLevel = computed(() => Number(auth.nivel || 0))

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/planos', label: 'Planos' },
  { path: '/exercicios', label: 'Exercícios', requiredLevel: 1, requiresAuth: true },
  { path: '/treinos', label: 'Treinos', requiredLevel: 1, requiresAuth: true },
  { path: '/notas', label: 'Anotações', requiredLevel: 1, requiresAuth: true },
  { path: '/perfil', label: 'Perfil', requiresAuth: true },
  { path: '/admin', label: 'Admin',  },
]

function logout() {
  auth.logout()
  router.push('/login')
}

function isLocked(item) {
  if (typeof item.requiredLevel === 'number') {
    return userLevel.value < item.requiredLevel
  }
  return false
}

function showItem(item) {
  if (item.requiresAuth && !isAuthenticated.value) return false
  return true
}

function handleLockedClick() {
  toast.info('Para acessar esta página você deve atualizar seu plano')
  closePanel()
  router.push('/planos')
}

const backdropOpacity = computed(() =>
  route.path === '/' ? 0.6 : 0.45
)

function togglePanel() {
  isOpen.value = !isOpen.value
}

function closePanel() {
  isOpen.value = false
}

watch(isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style>
* {
  font-family: Arial, Helvetica, sans-serif;
}

:root {
  --navbar-height: 72px;
}

.navbar {
  background-image: linear-gradient(90deg, #e53935 0%, #ff7a18 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72px;
  padding: 0 20px;
  flex-wrap: nowrap;
  gap: 0;
  position: relative;
  --navbar-height: 72px;
  z-index: 4000;
}

.navbar-brand {
  font-weight: bold;
}

.brand-title {
  margin: 0;
  font-size: 1.15rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 800;
  color: #fff;
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
  position: relative;
  z-index: 1000;
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

.side-toggle {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  padding: 4px;
  border: none;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3200;
  pointer-events: auto;
}

.hamburger {
  display: inline-block;
  width: 18px;
  height: 14px;
}

.hamburger span {
  display: block;
  height: 2px;
  background: #fff;
  margin: 3px 0;
  border-radius: 2px;
}



.side-panel {
  position: fixed;
  top: var(--navbar-height);
  left: 0;
  height: calc(100vh - var(--navbar-height));
  width: 360px;
  max-width: 92%;
  background: linear-gradient(180deg, #e53935 0%, #ff7a18 100%);
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  transform: translateX(-100%);
  opacity: 0;
  transition: transform 0.36s cubic-bezier(.2, .9, .3, 1), opacity 0.28s ease;
  z-index: 3500;
  box-shadow: 12px 0 48px rgba(0, 0, 0, 0.28);
  overflow: hidden;
}

.side-panel.open {
  transform: translateX(0);
  opacity: 1
}

.side-panel-inner {
  padding: 2.2rem 2rem;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  overflow-y: auto
}

.side-brand {
  color: #fff;
  font-size: 2.4rem;
  margin: 0 0 2rem 0;
  font-weight: 800;
  letter-spacing: 0.4px
}

.side-nav {
  margin-top: 2.2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.side-link {
  color: #fff;
  text-decoration: none;
  font-size: 1.25rem;
  padding: 0.6rem 0;
  transition: transform 0.34s ease, opacity 0.34s ease, color 0.28s ease;
  opacity: 0;
  display: flex;
  align-items: center;
  position: relative
}

.side-link.locked {
  opacity: 0.7;
  cursor: not-allowed;
  justify-content: space-between;
  gap: 12px;
  color: rgba(255, 255, 255, 0.95);
}

.lock-icon {
  color: rgba(255, 255, 255, 0.92);
  flex: 0 0 18px
}

.side-link::before {
  display: none
}

.side-link:not(.active):hover {
  transform: translateX(8px);
  opacity: 1
}

.side-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  height: 2px;
  width: 0;
  background: rgba(255, 255, 255, 0.95);
  transition: width 0.34s cubic-bezier(.2, .9, .3, 1)
}

.side-link:not(.active):hover::after {
  width: 48%
}


.side-link.active {
  opacity: 0.5;
  pointer-events: none
}

.side-link.active::before {
  background: rgba(255, 255, 255, 0.28);
  transform: scale(0.92)
}


.side-link.router-link-active,
.side-link.router-link-exact-active {
  opacity: 1;
  pointer-events: none;
}

.side-link.router-link-active::after,
.side-link.router-link-exact-active::after {
  width: 100%;
  background: #ffffff;
}


.side-panel-inner::-webkit-scrollbar {
  width: 10px
}

.side-panel-inner::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.18);
  border-radius: 8px
}

@media (max-width: 520px) {
  .side-toggle {
    left: 10px;
    top: 10px;
    width: 34px;
    height: 34px
  }

  .side-panel {
    width: 280px
  }

  .side-brand {
    font-size: 1.6rem
  }

  .side-link {
    font-size: 1.05rem
  }
}

.login-wrap {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1450;
}

.auth-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 8px;
  text-decoration: none;
  color: #ffffff;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 132, 132, 0.15);
  border: 1.5px solid #ff6b35;
}

.auth-btn__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.auth-btn--login {
  background: rgba(255, 255, 255, 0.12);
  border: none;
}

.auth-btn--login:hover {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
  transform: translateY(-2px);
}

.auth-btn--login:active {
  transform: translateY(0);
}

.auth-btn--logout {
  background: rgba(255, 255, 255, 0.12);
  border: 1.5px solid rgba(255, 107, 53, 0.6);
}

.auth-btn--logout:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: #ff6b35;
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.25);
  transform: translateY(-2px);
}

.auth-btn--logout:active {
  transform: translateY(0);
}

.login-btn {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 12px;
  text-decoration: none;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.95);
  background: black;
  font-weight: 600;
  font-size: 1rem;
}


.backdrop {
  position: fixed;
  left: 0;
  right: 0;
  top: var(--navbar-height);
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition: opacity 0.28s ease, background 0.28s ease;
  z-index: 3000;
}

.side-panel.open .side-link {
  opacity: 0;
  transform: translateX(-8px)
}

.side-panel.open .side-nav .side-link:nth-child(1) {
  transition-delay: 0.06s;
  opacity: 1;
  transform: translateX(0)
}

.side-panel.open .side-nav .side-link:nth-child(2) {
  transition-delay: 0.12s;
  opacity: 1;
  transform: translateX(0)
}

.side-panel.open .side-nav .side-link:nth-child(3) {
  transition-delay: 0.18s;
  opacity: 1;
  transform: translateX(0)
}

.side-panel.open .side-nav .side-link:nth-child(4) {
  transition-delay: 0.24s;
  opacity: 1;
  transform: translateX(0)
}

.side-panel.open .side-nav .side-link:nth-child(5) {
  transition-delay: 0.30s;
  opacity: 1;
  transform: translateX(0)
}

.side-panel.open .side-nav .side-link:nth-child(6) {
  transition-delay: 0.35s;
  opacity: 1;
  transform: translateX(0)
}

.side-panel.open .side-nav .side-link:nth-child(7) {
  transition-delay: 0.40s;
  opacity: 1;
  transform: translateX(0)
}

@media (max-width: 520px) {
  .side-toggle {
    left: 12px;
    width: 44px;
    height: 44px
  }

  .side-panel {
    width: 260px
  }

  .side-home {
    font-size: 1.6rem
  }
}
</style>