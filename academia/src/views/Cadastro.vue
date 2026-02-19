<template>
  <div class="login-container">
    <router-link to="/" class="back-home" aria-label="Voltar para Home">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>Voltar para Home</span>
    </router-link>
    <header class="header">
      <div class="brand-row">
        <p class="welcome">Bem-vindo ao</p>
        <h1 class="brand">Treos</h1>
      </div>
      <p class="lead">Crie sua conta</p>
    </header>
    <div class="login-box">
      <h2 class="card-title">Cadastro</h2>
      <form @submit.prevent="handleRegister">
        <div class="field">
          <label for="name">Nome</label>
          <div class="input-with-icon">
            <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="#ff7a3a" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 21c0-3.866 3.582-7 9-7s9 3.134 9 7" stroke="#ff7a3a" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <input id="name" v-model="name" type="text" placeholder="Seu nome completo" required />
          </div>
        </div>
        <div class="field">
          <label for="email">E-mail</label>
          <div class="input-with-icon">
            <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6.5L12 11L20 6.5" stroke="#ff7a3a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="5" width="18" height="14" rx="3" stroke="#0b151a" stroke-width="1.5"/></svg>
            <input id="email" v-model="email" type="email" placeholder="seu@email.com" required />
          </div>
        </div>
        <div class="field">
          <label for="password">Senha</label>
          <div class="input-with-icon">
            <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 10V8a6 6 0 0112 0v2" stroke="#ff7a3a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="4" y="10" width="16" height="10" rx="2" stroke="#0b151a" stroke-width="1.5"/></svg>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              @input="onPasswordInput"
              @focus="onPasswordFocus"
              @blur="onPasswordBlur"
              :aria-invalid="!isPasswordValid"
              aria-describedby="password-requirements"
              required
            />
            <button type="button" class="eye" aria-label="Mostrar senha">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" opacity="0.15"/></svg>
            </button>
          </div>
          <ul
            id="password-requirements"
            class="password-requirements"
            role="status"
            aria-live="polite"
            v-show="showUnmetRequirements"
          >
            <li v-if="!validations.minLength" class="unmet">Mínimo de 8 caracteres</li>
            <li v-if="!validations.specialChar" class="unmet">Pelo menos 1 caractere especial</li>
            <li v-if="!validations.number" class="unmet">Pelo menos 1 número</li>
            <li v-if="!validations.upper" class="unmet">Pelo menos 1 letra maiúscula</li>
            <li v-if="!validations.lower" class="unmet">Pelo menos 1 letra minúscula</li>
          </ul>
        </div>
        <div class="field">
          <label for="confirmPassword">Confirmar Senha</label>
          <div class="input-with-icon">
            <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 10V8a6 6 0 0112 0v2" stroke="#ff7a3a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="4" y="10" width="16" height="10" rx="2" stroke="#0b151a" stroke-width="1.5"/></svg>
            <input id="confirmPassword" v-model="confirmPassword" @input="onConfirmInput" type="password" placeholder="Repita a senha" required aria-describedby="confirm-status" />
          </div>
          <div id="confirm-status" class="confirm-status" aria-live="polite" v-if="touchedConfirm && !passwordsMatch">
            Senhas não coincidem
          </div>
        </div>
        <div class="terms-row">
          <label class="checkbox">
            <input type="checkbox" id="terms" v-model="acceptedTerms" @change="onTermsToggle" />
            <span class="checkbox-box" :class="{checked: acceptedTerms}"></span>
            <span class="terms-text">Li e aceito os <a class="link" href="#" @click.prevent="openTerms">Termos de Uso</a></span>
          </label>
        </div>
        <div v-show="showTermsModal" class="modal" role="dialog" aria-modal="true">
          <div class="modal-content">
            <h2>Termos de Uso</h2>
            <p>
              Ao acessar e utilizar este site, você concorda com os termos e condições descritos abaixo.
              Caso não concorde com qualquer parte destes termos, recomendamos que não utilize nossos serviços.
            </p>
            <h3>1. Uso do site</h3>
            <p>
              O usuário compromete-se a utilizar o site de forma lícita, respeitando as leis vigentes,
              a moral e os bons costumes. É proibido o uso do site para fins ilegais, fraudulentos
              ou que possam causar prejuízo a terceiros.
            </p>
            <h3>2. Cadastro e segurança</h3>
            <p>
              O usuário é responsável por manter a confidencialidade de seus dados de acesso,
              incluindo login e senha. Qualquer atividade realizada com sua conta será de sua responsabilidade.
            </p>
            <h3>3. Privacidade</h3>
            <p>
              As informações fornecidas pelo usuário serão utilizadas apenas para fins de funcionamento
              do sistema, respeitando a privacidade e a proteção de dados conforme a legislação vigente.
            </p>
            <h3>4. Modificações</h3>
            <p>
              Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento,
              sem aviso prévio. Recomenda-se a verificação periódica deste conteúdo.
            </p>
            <h3>5. Aceitação</h3>
            <p>
              Ao marcar a opção "Li e aceito os Termos de Uso", o usuário declara que leu,
              compreendeu e concorda com todas as condições aqui apresentadas.
            </p>
            <div style="display:flex;gap:10px;margin-top:18px;">
              <button type="button" class="btn-voltar" @click="closeTerms">Fechar</button>
              <button type="button" class="btn-voltar" style="background:linear-gradient(90deg,var(--color-primary),var(--color-primary-dark));" @click="acceptTerms">Entendi</button>
            </div>
          </div>
        </div>
        <button type="submit" class="login-button" :disabled="isLoading || !acceptedTerms || !isPasswordValid" :aria-busy="isLoading">
          <span v-if="isLoading" class="btn-content"><span class="spinner" aria-hidden="true"></span>Cadastrando...</span>
          <span v-else class="btn-content">CADASTRAR</span>
        </button>
      </form>
      <div class="login-footer">
        <p>
          Já tem uma conta?
          <router-link :to="{ name: 'Login' }">Entrar</router-link>
        </p>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/controller/api';
import { useToast } from 'vue-toastification'

export default {
  name: 'Cadastro',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      validations: {
        minLength: false,
        specialChar: false,
        number: false,
        upper: false,
        lower: false
      },
      isPasswordValid: false,
      isFocusedPassword: false,
      touchedPassword: false,
      touchedConfirm: false,
      showTermsModal: false,
      acceptedTerms: false,
      isLoading: false,
    }
  },
  computed: {
    showUnmetRequirements() {
      return (this.isFocusedPassword || this.touchedPassword || (this.password && this.password.length > 0)) && !this.isPasswordValid
    },
    showPasswordError() {
      return (!this.isPasswordValid) && (this.touchedPassword || this.isFocusedPassword)
    }
    ,
    passwordsMatch() {
      return this.password && this.confirmPassword === this.password
    }
  },
  methods: {

    handleRegister() {
      const toast = this.$toast || useToast()
      if (!this.name || !this.email || !this.password || !this.confirmPassword) {
        toast.error('Todos os campos são obrigatórios')
        return
      }
      if (this.password !== this.confirmPassword) {
        toast.error('As senhas não coincidem')
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        toast.error('E-mail inválido')
        return
      }

      if (!this.acceptedTerms) {
        toast.error('Você precisa aceitar os Termos de Uso')
        this.openTerms()
        return
      }

      if (!this.isPasswordValid) {
        toast.error('A senha não atende aos requisitos de segurança')
        return
      }

      const body = {
        nome: this.name,
        email: this.email,
        password: this.password
      }

      async function registerUser() {
        try {
          const response = await api.post('/usuarios', body)
          toast.success('Cadastro realizado com sucesso!')
          console.log('Resposta da API:', response.data)
          
          this.name = ''
          this.email = ''
          this.password = ''
          this.confirmPassword = ''
          this.acceptedTerms = false

          this.$nextTick(() => {
            this.$router.push({ name: 'Login' })
          })
        } catch (error) {
          const errorMsg = error.response?.data?.message || 'Erro ao registrar usuário'
          toast.error(errorMsg)
          console.error('Erro ao registrar usuário:', error)
        } finally {
          this.isLoading = false
        }
      }

      this.isLoading = true
      registerUser.call(this)
    },

    openTerms() {
      this.showTermsModal = true
    },
    closeTerms() {
      this.showTermsModal = false
    },
    onTermsToggle() {
      if (this.acceptedTerms) {
        this.acceptedTerms = false
        this.openTerms()
      }
    },
    acceptTerms() {
      this.acceptedTerms = true
      this.showTermsModal = false
    }
    ,
    onPasswordInput() {
      this.touchedPassword = true
      this.validatePassword(this.password)
    },
    onPasswordFocus() {
      this.isFocusedPassword = true
      this.validatePassword(this.password)
    },
    onPasswordBlur() {
      this.isFocusedPassword = false
      this.touchedPassword = true
      this.validatePassword(this.password)
    },
    onConfirmInput() {
      this.touchedConfirm = true
    },
    validatePassword(value) {
      const v = value || ''
      this.validations.minLength = v.length >= 8
      this.validations.specialChar = /[^A-Za-z0-9]/.test(v)
      this.validations.number = /\d/.test(v)
      this.validations.upper = /[A-Z]/.test(v)
      this.validations.lower = /[a-z]/.test(v)
      this.isPasswordValid = this.validations.minLength && this.validations.specialChar && this.validations.number && this.validations.upper && this.validations.lower
    },
    
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  padding: 14px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
  min-width: 300px;
}

.toast.error {
  background: #dc2626;
  color: #fff;
  border-left: 4px solid #991b1b;
}

.toast.success {
  background: #10b981;
  color: #fff;
  border-left: 4px solid #047857;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.back-button {
  display: inline-block;
  color: #ff6a00;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.back-button:hover {
  color: #ff7a00;
  text-decoration: underline;
}

.btn-voltar {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  background: linear-gradient(90deg, #050505, #050505);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
}

.btn-voltar:hover {
  opacity: 0.9;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.14);
  border-top-color: #ffffff;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.9s linear infinite;
  vertical-align: middle;
  margin-right: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.modal {
  display: flex;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 999;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #111;
  color: #fff;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  padding: 25px;
  border-radius: 12px;
  overflow-y: auto;
  border: 1px solid rgba(255, 122, 58, 0.04);
  position: relative;
}

.modal-content h2 {
  margin-bottom: 15px;
  color: #ff7a00;
}

.modal-content h3 {
  margin-top: 20px;
  color: #ff7a00;
}

.modal-content p {
  font-size: 14px;
  line-height: 1.6;
  margin-top: 8px;
}


.field {
  margin-bottom: 22px;
}

.input-with-icon {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  width: 92%;
  max-width: 440px;
  margin: 0 auto;
  padding: 10px 12px;
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(8, 17, 26, 0.85), rgba(8, 17, 26, 0.75));
  border: 1px solid rgba(255, 255, 255, 0.03);
  box-shadow: 0 6px 18px rgba(2, 8, 12, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.02);
}

.input-with-icon .icon {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  margin-right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 122, 58, 0.06);
  border-radius: 8px;
  padding: 6px;
  color: var(--color-primary, #ff7a3a);
  border: 1px solid rgba(255, 122, 58, 0.10);
}

.input-with-icon input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text-white, #e6eef6);
  font-size: 15px;
  flex: 1 1 auto;
  padding: 6px 8px;
  height: 36px;
}

.input-with-icon .eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--color-text-secondary, #9fb7c3);
  cursor: pointer;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}

label {
  padding-left: 54px;
}

.close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 22px;
  cursor: pointer;
  color: #ff7a00;
}

.terms {
  display: flex;
  gap: 8px;
  margin: 10px 0;
  font-size: 14px;
}

.terms input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin: 0px;
}

.terms-link {
  color: #ff7a00;
  cursor: pointer;
  text-decoration: underline;
}

.login-container {
  position: relative;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.5)), url('/assets/login.png');
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 20px;
  font-family: Arial, Helvetica, sans-serif;
  flex-direction: column;
}

.login-container::before {
  position: absolute;
  left: 80px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 200px;
  font-weight: 800;
  letter-spacing: 4px;
  z-index: 0;
  pointer-events: none;
  display: none;
}

@media (min-width: 1024px) {
  .login-container {
    min-height: 100vh;
  }

  .login-container::before {
    display: block;
  }
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
}

.logo-area {
  position: absolute;
  top: 40px;
  text-align: center;
  z-index: 2;
  color: #fff;
}

.logo {
  font-size: 36px;
  font-weight: bold;
  letter-spacing: 2px;
}

.logo-line {
  width: 70px;
  height: 4px;
  margin: 8px auto 0;
  background: linear-gradient(90deg, red, orange);
}

.login-box {
  position: relative;
  width: 100%;
  max-width: 460px;
  padding: 36px 32px;
  background: linear-gradient(180deg, rgba(6, 18, 28, 0.95), rgba(7, 12, 18, 0.85));
  border-radius: 14px;
  border: 1px solid rgba(255, 122, 58, 0.04);
}

.welcome {
  font-size: 22px;
  margin-bottom: 2px;
  display: flex;
  justify-content: center;
}

.subtitle {
  color: var(--color-primary);
  margin: 12px;
  text-align: center;
  font-size: 12px;
}

.form-group {
  margin-bottom: 0;
}

label {
  display: block;
  font-size: 13px;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #333;
  background: transparent;
  color: #fff;
}

input::placeholder {
  color: #777;
}

.input:focus,
input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.login-button {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
  color: #08111a;
  font-weight: 800;
  cursor: pointer;
  margin-bottom: 16px;
  transition: opacity 0.3s;
}

.login-button:hover {
  opacity: 0.85;
}

.login-footer {
  text-align: center;
  font-size: 14px;
}

.login-footer a,
.login-footer .router-link {
  color: var(--color-primary);
  font-weight: bold;
  text-decoration: none;
}

.footer-text {
  position: absolute;
  bottom: 20px;
  font-size: 13px;
  color: #aaa;
  z-index: 2;
}

.footer-text span {
  color: var(--color-primary);
}

.login-box {
  padding: 36px 32px;
  background: linear-gradient(180deg, rgba(6, 18, 28, 1), rgba(7, 12, 18, 1));
  border: 1px solid rgba(255, 122, 58, 0.04);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
}

.card-title {
  text-align: center;
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin: 0 0 18px 0;
}

.field {
  margin-bottom: 18px;
}

.field label {
  display: block;
  font-size: 13px;
  color: #b7c6d1;
  margin-bottom: 8px;
  width: 92%;
  max-width: 440px;
  text-align: left;
  padding-left: 21px;
}

/* Header (match Login.vue) */
.header {
  text-align: center;
  margin-bottom: 18px;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.welcome {
  font-size: var(--font-size-3xl);
  margin: 0;
  color: var(--color-text-primary);
  font-weight: 700;
  display: inline-block;
}

.brand {
  color: var(--color-primary);
  font-size: var(--font-size-3xl);
  margin: 0;
  font-weight: 800;
  letter-spacing: 1px;
  text-shadow: 0 8px 30px rgba(255, 122, 58, 0.08);
  display: inline-block;
}

.lead {
  margin-top: 8px;
  color: var(--color-text-primary);
}

.input-with-icon {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  width: 92%;
  max-width: 440px;
  margin: 0 auto;
  padding: 10px 12px;
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(18, 23, 29, 0.85), rgba(12, 16, 20, 0.75));
  border: 0.5px solid rgba(255, 255, 255, 0.03);
}

.input-with-icon .icon {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  margin-right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 122, 58, 0.06);
  border-radius: 8px;
  padding: 6px;
  color: var(--color-primary, #ff7a3a);
  border: 1px solid rgba(255, 122, 58, 0.10);
}

.input-with-icon input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text-white, #e6eef6);
  font-size: 15px;
  flex: 1 1 auto;
  padding: 6px 8px;
  height: 36px;
}

.input-with-icon .eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--color-text-secondary, #9fb7c3);
  cursor: pointer;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.terms-row {
  margin: 10px 0 20px 0;
}

.checkbox {
  display: flex;
  gap: 10px;
  align-items: center;
  color: #b7c6d1;
  font-size: 14px;
  position: relative;
}

.checkbox input[type="checkbox"] {
  position: absolute;
  left: -9999px;
}

.checkbox .link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
}

.checkbox .checkbox-box {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  margin-right: 8px;
  transition: all .2s ease;
}

.checkbox .checkbox-box.checked {
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
  border-color: transparent;
}

.checkbox .checkbox-box.checked::after {
  content: '';
  width: 6px;
  height: 10px;
  border-left: 2px solid #08111a;
  border-bottom: 2px solid #08111a;
  transform: rotate(-45deg);
  display: block;
}

.terms-text {
  display: inline-block;
}

.terms {
  width: 92%;
  max-width: 440px;
  margin: 16px auto 26px;
}

.login-button {
  margin-top: 6px;
  width: 100%;
  max-width: 440px;
  padding: 14px;
  border-radius: var(--radius-md, 8px);
  border: none;
  background: linear-gradient(90deg, var(--color-primary, #ff7a3a), var(--color-primary-dark, #ff6622));
  color: #08111a;
  font-weight: 800;
  font-size: 16px;
  box-shadow: 0 10px 30px rgba(255, 122, 58, 0.14);
  cursor: pointer;
}

.login-button:hover {
  transform: translateY(-1px);
  filter: brightness(1.02);
}

.login-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.login-footer {
  margin-top: 16px;
  text-align: center;
  color: #9fb7c3;
}

.back-home {
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 1200;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--color-text-white, #e6eef6);
  text-decoration: none;
  font-size: 14px;
}

.back-home svg {
  color: var(--color-text-white, #e6eef6);
}

.back-home:hover {
  background: rgba(255, 122, 58, 0.06);
  color: var(--color-primary, #ff7a3a);
}

.password-requirements {
  margin: 10px auto 0;
  padding-left: 54px;
  max-width: 440px;
  color: #b7c6d1;
  font-size: 13px;
  list-style: none;
}

.password-requirements li {
  margin-bottom: 6px;
  color: #b7c6d1;
}

.confirm-status {
  margin-top: 8px;
  padding-left: 54px;
  color: #b7c6d1;
  font-size: 13px;
}
</style>