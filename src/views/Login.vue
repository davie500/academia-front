<template>
  <div class="page-bg">
    <router-link to="/" class="back-home" aria-label="Voltar para Home">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 19L5 12L12 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>Voltar para Home</span>
    </router-link>
    <div class="login-wrap">
      <header class="header">
          <div class="brand-row">
          <p class="welcome">Bem-vindo ao</p>
          <h1 class="brand">Treos</h1>
        </div>
        <p class="lead">Acesse sua conta</p>
      </header>

      <div class="card">
        <form @submit.prevent="handleLogin" class="form">
          <div class="field">
            <label for="email">Email</label>
            <div class="input-with-icon">
              <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6.5L12 11L20 6.5" stroke="#ff7a3a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="5" width="18" height="14" rx="3" stroke="#0b151a" stroke-width="1.5"/></svg>
              <input id="email" v-model="email" type="email" placeholder="seu@email.com" required />
            </div>
          </div>

          <div class="field">
            <label for="password">Senha</label>
            <div class="input-with-icon">
              <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 10V8a6 6 0 0112 0v2" stroke="#ff7a3a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="4" y="10" width="16" height="10" rx="2" stroke="#0b151a" stroke-width="1.5"/></svg>
              <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" required />
              <button type="button" class="eye" @click="togglePassword" :aria-pressed="showPassword" aria-label="Mostrar senha">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" opacity="0.15"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="terms-row">
            <label class="checkbox">
              <input type="checkbox" id="terms" v-model="acceptedTerms" @change="onTermsToggle"/>
              <span class="checkbox-box" :class="{checked: acceptedTerms}"></span>
              <span class="terms-text">Aceito os <a class="link" href="#" @click.prevent="openTerms">Termos e Condições</a> e a <a class="link" href="#" @click.prevent="openTerms">Política de Privacidade</a></span>
            </label>
          </div>

          <div v-show="showTermsModal" class="modal" role="dialog" aria-modal="true">
            <div class="modal-content">
                <h2>Termos e Condições de Uso</h2>

                <p>
                  Estes Termos e Condições regem o uso da plataforma Treos. Ao utilizar
                  os serviços oferecidos, o usuário declara ter lido, compreendido e aceitado
                  integralmente as disposições abaixo.
                </p>

                <h3>1. Aceite</h3>
                <p>
                  O acesso e utilização da plataforma implicam na aceitação destes Termos.
                  Caso não concorde com alguma cláusula, o usuário deve abster-se de utilizar
                  os serviços.
                </p>

                <h3>2. Cadastro e Segurança</h3>
                <p>
                  O usuário é responsável pela veracidade das informações fornecidas no
                  momento do cadastro, bem como pela guarda e confidencialidade de suas credenciais.
                  Notificações de uso não autorizado devem ser comunicadas imediatamente.
                </p>

                <h3>3. Uso do Serviço</h3>
                <p>
                  O usuário concorda em utilizar a plataforma de forma lícita e em conformidade
                  com a legislação aplicável. É vedado o uso da plataforma para atividades
                  ilícitas, violação de direitos de terceiros ou práticas que prejudiquem o
                  funcionamento dos serviços.
                </p>

                <h3>4. Pagamentos e Cancelamentos</h3>
                <p>
                  Quando aplicável, pagamentos por serviços serão cobrados conforme o plano
                  escolhido. Políticas de cancelamento e reembolso são detalhadas nos termos
                  específicos de cada plano e estão sujeitas às regras comerciais informadas.
                </p>

                <h3>5. Proteção de Dados</h3>
                <p>
                  As informações pessoais são tratadas conforme nossa Política de Privacidade.
                  Adotamos medidas técnicas e organizacionais adequadas para proteger os dados
                  dos usuários, observando a legislação vigente.
                </p>

                <h3>6. Limitação de Responsabilidade</h3>
                <p>
                  Na máxima extensão permitida pela lei, a plataforma não será responsável por
                  danos indiretos, lucros cessantes ou perdas decorrentes do uso ou incapacidade
                  de uso dos serviços, salvo disposição em contrário prevista na legislação.
                </p>

                <h3>7. Alterações</h3>
                <p>
                  Reservamo-nos o direito de modificar estes Termos a qualquer momento. Usuários
                  serão notificados sobre alterações relevantes e o uso continuado caracteriza
                  aceitação das novas condições.
                </p>

                <h3>8. Contato</h3>
                <p>
                  Para dúvidas ou solicitações relativas aos Termos e à Política de Privacidade,
                  entre em contato através dos canais oficiais disponíveis na plataforma.
                </p>

              <div class="modal-actions">
                <button type="button" class="btn-voltar" @click="closeTerms">Fechar</button>
                <button type="button" class="btn-aceitar" @click="acceptTerms">Entendi</button>
              </div>
            </div>
          </div>

          <button type="submit" class="primary" :disabled="!acceptedTerms" :aria-disabled="!acceptedTerms">ENTRAR</button>
        </form>

        <div class="card-footer">
          <p>Não tem uma conta? <router-link to="/cadastro" class="signup">Cadastre-se</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const showTermsModal = ref(false)
const acceptedTerms = ref(false)

const router = useRouter()
const toast = useToast()

function togglePassword() {
  showPassword.value = !showPassword.value
}

function openTerms() {
  showTermsModal.value = true
}

function closeTerms() {
  showTermsModal.value = false
}

function acceptTerms() {
  acceptedTerms.value = true
  showTermsModal.value = false
}

function onTermsToggle() {
  if (acceptedTerms.value) {
    acceptedTerms.value = false
    openTerms()
  }
}

async function handleLogin() {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
      email: email.value,
      password: password.value,
    })

    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token)
      toast.success('Login realizado com sucesso')
      setTimeout(() => router.push('/'), 700)
    } else {
      toast.error('Credenciais inválidas')
    }
  } catch (err) {
    const msg = err?.response?.data?.message || 'Erro ao efetuar login'
    toast.error(msg)
    console.error(err)
  }
}
</script>

<style scoped>
/* Layout */
.page-bg{
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.5)), url('/assets/login.png');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  font-family: Inter, Arial, Helvetica, sans-serif;
  color: #e6eef6;
}
.login-wrap{
  width: 100%;
  max-width: 520px;
  padding: 36px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
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

.card{
  width: 100%;
  background: linear-gradient(180deg, rgba(6,18,28,1), rgba(7,12,18,1));
  border: 1px solid rgba(255,122,58,0.04);
  padding: 36px 32px;
  border-radius: calc(var(--radius-md) + 4px);
  box-shadow: 0 10px 40px rgba(0,0,0,0.6);
  min-height: 420px;
}

.form {
    display: flex;
    flex-direction: column;
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
  border: 0.5px solid rgba(255,255,255,0.03);
}

.input-with-icon .icon {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  margin-right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,122,58,0.06);
  border-radius: 8px;
  padding: 6px;
  color: var(--color-primary);
  border: 1px solid rgba(255,122,58,0.10);
}

.input-with-icon .icon svg{ display: block; }

.input-with-icon input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text-white);
  font-size: 15px;
  flex: 1 1 auto;
  padding: 6px 8px;
  height: 36px;
}

.input-with-icon input::placeholder {
  color: var(--color-text-secondary);
}

.input-with-icon input:focus {
  outline: none;
}

.input-with-icon .eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
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

.primary {
    margin-top: 6px;
    width: 100%;
    padding: 14px;
    border-radius: var(--radius-md);
    border: none;
    background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
    color: #08111a;
    font-weight: 800;
    font-size: 16px;
    box-shadow: 0 10px 30px rgba(255, 122, 58, 0.14);
    cursor: pointer;
}

.primary:hover {
    transform: translateY(-1px);
    filter: brightness(1.02);
}

.card-footer {
    margin-top: 16px;
    text-align: center;
    color: #9fb7c3;
}

.signup {
    color: #ff7a3a;
    font-weight: 700;
    text-decoration: none;
}
/* Modal (termos) */
.modal{
  display: flex;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  z-index: 999;
  align-items: center;
  justify-content: center;
}

.modal-content{
  background: var(--color-bg-darker);
  color: var(--color-text-white);
  width: 90%;
  max-width: 720px;
  max-height: 80vh;
  padding: 24px;
  border-radius: var(--radius-md);
  overflow: auto;
  box-shadow: 0 10px 40px rgba(0,0,0,0.6);
  border: 1px solid rgba(255,122,58,0.06);
}

.modal-content h2,
.modal-content h3{ color: var(--color-primary); }

.modal-content p{
  color: var(--color-text-primary);
  line-height: 1.6;
  font-size: 14px;
}

.btn-voltar{
  margin-top: 18px;
  padding: 12px 14px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  color: var(--color-text-primary);
  font-weight: 700;
  cursor: pointer;
}

.btn-aceitar{
  margin-top: 18px;
  margin-left: 12px;
  padding: 12px 18px;
  background: linear-gradient(90deg,var(--color-primary),var(--color-primary-dark));
  border: none;
  border-radius: 8px;
  color: #08111a;
  font-weight: 700;
  cursor: pointer;
}

.btn-aceitar[disabled]{ opacity: 0.6; cursor: not-allowed; filter: grayscale(0.05); }

.primary[disabled]{
  opacity: 0.6;
  cursor: not-allowed;
  filter: grayscale(0.05);
  box-shadow: none;
}

.back-home{
  position: absolute;
  top: 18px;
  left: 18px;
  z-index: 1200;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--color-text-white);
  text-decoration: none;
  font-size: 14px;
}
.back-home svg{ color: var(--color-text-white); }
.back-home:hover{ background: rgba(255,122,58,0.06); color: var(--color-primary); }

@media (max-width:520px){
  .brand{ font-size:40px; }
  .card{ padding:20px; }
}
</style>