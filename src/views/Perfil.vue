<template>
  <div class="fundo"></div>
  <div class="page">
    <div class="container" v-if="!loading && usuario">

      <div class="card profile-card">
        <div class="profile-left">
          <div class="avatar-wrapper">
              <img
              v-if="usuario.foto_perfil"
              :src="`data:image/webp;base64,${usuario.foto_perfil}`"
              class="avatar"
            />
            <img
              v-else
              src="https://i.pravatar.cc/150?img=12"
              class="avatar"
            />
          </div>

          

          <div class="avatar-actions">
            <label class="file-label">
              <input type="file" @change="handleFileUpload" accept="image/*" />
              <span class="file-text">Escolher foto</span>
            </label>
            <div class="file-info" v-if="edit.foto_perfil">
              <span class="file-ok">✓</span>
              <span class="file-name">{{ edit.foto_perfil.name }}</span>
            </div>
          </div>

          <div class="left-selects">
            <div class="left-select">
              <label>Gênero</label>
                <select v-model="edit.genero" :class="{ changed: isFieldChanged('genero') }">
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div class="left-select">
              <label>Nível de Treino</label>
                <select v-model="edit.nivel_treino" :class="{ changed: isFieldChanged('nivel_treino') }">
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
            </div>
          </div>

          <div class="left-field">
            <label>Nome</label>
            <input class="name-edit" v-model="edit.nome" type="text" />
          </div>

          <div class="left-field">
            <label>Email</label>
            <input class="email-edit" v-model="edit.email" type="email" />
          </div>

          <div class="badges" v-if="(usuario.nivel_treino || usuario.objetivo || usuario.genero)">
            <span v-if="usuario.nivel_treino" class="badge filled">
              {{ usuario.nivel_treino }}
            </span>

            <span v-if="usuario.objetivo" class="badge outlined">
              {{ usuario.objetivo }}
            </span>

            <span v-if="usuario.genero" class="badge outlined">
              {{ usuario.genero }}
            </span>
          </div>
        </div>

        <div class="profile-right">
          <h3>Informações Pessoais</h3>

          <div class="form-group">
            <label>Altura</label>
            <input v-model="edit.altura_cm" type="text" :placeholder="usuario.altura_cm ? '' : 'Você ainda não colocou este valor'" :class="{ changed: isFieldChanged('altura_cm') }" />
          </div>

          <div class="form-group">
            <label>Peso</label>
            <input v-model="edit.peso_kg" type="text" :placeholder="usuario.peso_kg ? '' : 'Você ainda não colocou este valor'" :class="{ changed: isFieldChanged('peso_kg') }" />
          </div>

          <div class="form-group">
            <label>Data de Nascimento</label>
            <input v-model="edit.data_nascimento" type="date" :placeholder="usuario.data_nascimento ? '' : 'Você ainda não colocou este valor'" :class="{ changed: isFieldChanged('data_nascimento') }" />
          </div>

          <div class="form-group">
            <label>Objetivo</label>
            <select v-model="edit.objetivo" :class="{ changed: isFieldChanged('objetivo') }">
              <option disabled value="">{{ usuario.objetivo || '—' }}</option>
              <option value="Emagrecimento">Emagrecimento</option>
              <option value="Hipertrofia">Hipertrofia</option>
              <option value="Condicionamento">Condicionamento</option>
            </select>
          </div>

          <div class="form-group">
            <label>Observações</label>
            <textarea v-model="edit.observacoes" :placeholder="usuario.observacoes ? '' : 'Você ainda não colocou este valor'" :class="{ changed: isFieldChanged('observacoes') }"></textarea>
          </div>

          <div class="profile-actions">
            <template v-if="hasChanges">
              <button class="btn-outline" @click="cancelInlineEdit">Cancelar</button>
              <button class="btn-primary" :disabled="!hasChanges || isSaving" @click="saveInlineEdit">
                <span v-if="isSaving">Salvando...</span>
                <span v-else>Salvar mudanças</span>
              </button>
            </template>
          </div>

        </div>
      </div>

      <div class="card plan-card">
        <template v-if="usuario?.assinatura">
          <template v-if="usuario.assinatura.status === 'active'">
            <div class="plan-left">
              <h2>Plano {{ usuario.assinatura.plano?.nome }}</h2>

              <div>
                <span class="status active">✓ Plano Ativo</span>
              </div>

              <p class="validity" v-if="usuario.assinatura.data_fim">Válido até: {{ formatarData(usuario.assinatura.data_fim) }}</p>
            </div>

            <div class="plan-right">
                <button class="btn-primary" @click="showPlanModal = true">Gerenciar Plano</button>
                <router-link :to="{ path: '/pagamento', query: { plano: planoQuery }}" class="btn-outline">Pagar próximo mês</router-link>
                <button class="btn-cancel" @click="cancelSubscription" :disabled="cancelling">Cancelar</button>
            </div>
          </template>

          <template v-else>
              <div class="plan-left">
                <h2>Plano {{ usuario.assinatura.plano?.nome || '—' }}</h2>
                <div>
                  <span class="status orange">Plano Cancelado</span>
                </div>
                <p class="validity" v-if="usuario.assinatura.data_fim">Válido até: {{ formatarData(usuario.assinatura.data_fim) }}</p>
              </div>

              <div class="plan-right">
                <router-link to="/planos" class="btn-primary">Assinar</router-link>
              </div>
            </template>
        </template>

        <template v-else>
          <div class="plan-left">
            <h2>Sem plano</h2>
          </div>

          <div class="plan-right">
            <router-link to="/planos" class="btn-primary">Assinar</router-link>
          </div>
        </template>
      </div>

      <ModalPlanos
        v-if="showPlanModal"
        :planos="planos"
        :loading="planosLoading"
        :planoNivelMap="planoNivelMap"
        :planoAtualNome="planoAtualNome"
        :nivelUsuario="nivelUsuario"
        @close="showPlanModal = false"
      />

      <div v-if="showCancelModal" class="cancel-modal-backdrop" @click.self="closeCancelModal">
        <div class="cancel-modal">
          <h3 class="cancel-modal__title">Tem certeza?</h3>
          <p class="cancel-modal__message">Ao cancelar você perderá acesso ao sistema assim que a validade do plano acabar</p>

          <div class="cancel-modal__actions">
            <button class="btn-outline" @click="closeCancelModal">Voltar</button>
            <button class="btn-cancel" @click="confirmCancelSubscription" :disabled="cancelling">Confirmar</button>
          </div>
        </div>
      </div>

      

    </div>

    <div v-if="loading" class="loading">
      Carregando perfil...
    </div>
  </div>
</template>

<script setup>
import api from "@/controller/api"
import { ref, onMounted, reactive, computed } from "vue"
import { useToast } from 'vue-toastification'
import ModalPlanos from '@/components/ModalPlanos.vue'

const toast = useToast()

const usuario = ref(null)
const loading = ref(true)
const isSaving = ref(false)
const planos = ref([])
const planosLoading = ref(false)
const planoNivelMap = ref({})
const edit = reactive({
  nome: '',
  email: '',
  altura_cm: '',
  peso_kg: '',
  data_nascimento: '',
  objetivo: '',
  observacoes: '',
  nivel_treino: '',
  genero: '',
  foto_perfil: null
})

const hasChanges = computed(() => {
  if (!usuario.value) return false
  const fields = ['nome','email','altura_cm','peso_kg','data_nascimento','objetivo','observacoes','nivel_treino','genero']
  for (const f of fields) {
    const a = (usuario.value[f] ?? '') || ''
    const b = (edit[f] ?? '') || ''
    if (f === 'objetivo') {
      if (b !== '' && String(a) !== String(b)) return true
      continue
    }
    if (String(a) !== String(b)) return true
  }
  if (edit.foto_perfil) return true
  return false
})

function isFieldChanged(f) {
  if (!usuario.value) return false
  const a = (usuario.value[f] ?? '') || ''
  const b = (edit[f] ?? '') || ''
  if (f === 'objetivo') {
    if (b !== '' && String(a) !== String(b)) return true
    return false
  }
  return String(a) !== String(b)
}

const planoQuery = computed(() => {
  const nome = String(usuario.value?.assinatura?.plano?.nome || '').toLowerCase()
  return nome.includes('plus') ? 'plus' : 'basico'
})

const showPlanModal = ref(false)
const cancelling = ref(false)
const showCancelModal = ref(false)


function formatarData(data) {
  if (!data) return ""

  const [ano, mes, dia] = data.split('T')[0].split('-')
  return `${dia}/${mes}/${ano}`
}

onMounted(async () => {
  try {
    const response = await api.get("/auth/me")
    usuario.value = response.data
    syncEditFromUsuario()
    await loadPlanos()
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
  } finally {
    loading.value = false
  }
})

async function loadPlanos() {
  planosLoading.value = true
  try {
    const response = await api.get('/planoPeriodo')
    const mapa = {}

    response.data.forEach(item => {
      const nome = item.plano.nome
      if (!mapa[nome]) {
        mapa[nome] = { nome, mensal: undefined, anual: undefined, vantagens: [], nivel: item.plano.nivel ? Number(item.plano.nivel.id) : undefined }
      }

      const p = mapa[nome]
      if (item.periodo?.nome === 'Mensal') p.mensal = item.preco.valor
      if (item.periodo?.nome === 'Anual') p.anual = item.preco.valor

      item.plano.vantagens.forEach(v => {
        if (!p.vantagens.some(x => x.id === v.id)) p.vantagens.push(v)
      })
    })

    planos.value = Object.values(mapa)

    planos.value.forEach((plano, index) => {
      if (plano.nivel) planoNivelMap.value[plano.nome] = plano.nivel
      else planoNivelMap.value[plano.nome] = index + 1
    })

  } catch (err) {
    console.error('Erro ao carregar planos no perfil', err)
  } finally {
    planosLoading.value = false
  }
}

const planoAtualNome = computed(() => usuario.value?.assinatura?.plano?.nome || '')
const nivelUsuario = computed(() => usuario.value?.assinatura?.plano?.nivel?.nome || '')

function syncEditFromUsuario() {
  if (!usuario.value) return
  edit.nome = usuario.value.nome || ''
  edit.email = usuario.value.email || ''
  edit.altura_cm = usuario.value.altura_cm || ''
  edit.peso_kg = usuario.value.peso_kg || ''
  edit.data_nascimento = usuario.value.data_nascimento ? usuario.value.data_nascimento.split('T')[0] : ''
  edit.objetivo = ''
  edit.observacoes = usuario.value.observacoes || ''
  edit.nivel_treino = usuario.value.nivel_treino || ''
  edit.genero = usuario.value.genero || ''
  edit.foto_perfil = null
}

function cancelInlineEdit() {
  syncEditFromUsuario()
  edit.foto_perfil = null
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    edit.foto_perfil = file
  }
}

async function saveInlineEdit() {
  isSaving.value = true
  try {
    const formData = new FormData()

    formData.append('_method', 'PUT')
    formData.append('nome', edit.nome)
    formData.append('email', edit.email)
    formData.append('altura_cm', edit.altura_cm)
    formData.append('peso_kg', edit.peso_kg)
    formData.append('data_nascimento', edit.data_nascimento)
    formData.append('objetivo', edit.objetivo || usuario.value.objetivo || '')
    formData.append('nivel_treino', edit.nivel_treino || '')
    formData.append('genero', edit.genero || '')
    formData.append('observacoes', edit.observacoes)

    if (edit.foto_perfil) {
      formData.append('foto_perfil', edit.foto_perfil)
    }

    await api.post('/usuarios/' + usuario.value.id, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    const response = await api.get("/auth/me")
    usuario.value = response.data

    toast.success('Perfil atualizado com sucesso')
    syncEditFromUsuario()
    edit.foto_perfil = null

  } catch (err) {
    console.error('Erro ao salvar perfil', err)
    toast.error('Erro ao salvar perfil')
  } finally {
    isSaving.value = false
  }
}

function cancelSubscription() {
  showCancelModal.value = true
}

function closeCancelModal() {
  showCancelModal.value = false
}

async function confirmCancelSubscription() {
  if (!usuario.value || !usuario.value.assinatura || !usuario.value.assinatura.id) {
    toast.error('ID da assinatura não encontrado')
    return
  }

  cancelling.value = true
  try {
    await api.put(`/assinaturas/${usuario.value.assinatura.id}`)

    const resp = await api.get('/auth/me')
    usuario.value = resp.data

    toast.success('Assinatura cancelada com sucesso')
    showPlanModal.value = false
    showCancelModal.value = false
  } catch (err) {
    console.error('Erro ao cancelar assinatura', err)
    toast.error('Erro ao cancelar assinatura')
  } finally {
    cancelling.value = false
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  font-family: 'Segoe UI', sans-serif;
  color: var(--color-text-white);
}

.fundo {
  width: 100%;
  height: 100vh;
  background-image: url('/assets/fundo.png');
  object-fit: cover;
  position: fixed;
  inset: 0;
  top: 0;
  left: 0;
  z-index: -1;
  filter: brightness(0.5);
  backdrop-filter: blur(5px);
}

.fundo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
}

.container {
  width: 100%;
  max-width: 1100px
}

.card {
  background: linear-gradient(145deg, var(--color-bg-card), rgba(26, 31, 46, 1));
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(75, 85, 99, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  transition: transform .18s ease, box-shadow .18s ease
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.7)
}

.profile-card:hover,
.plan-card:hover {
  transform: none !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6) !important;
}

.profile-card {
  display: flex;
  gap: 12px;
  align-items: flex-start
}

.profile-left {
  width: 34%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 12px 6px
}

.profile-right {
  width: 66%
}

.avatar-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(45deg, var(--color-primary), var(--color-primary-dark));
  margin-bottom: 12px
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block
}

.avatar-actions {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px
}

.file-label input {
  display: none
}

.file-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
  color: var(--color-text-white);
  cursor: pointer;
  font-size: 14px;
  transition: all .18s ease
}

.file-label:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(255, 107, 53, 0.08)
}

.file-info {
  font-size: 13px;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 8px
}

.file-ok {
  color: #00d26a;
  font-weight: 600
}

.file-name {
  color: rgba(255, 255, 255, 0.88);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap
}

.btn-cancel {
  padding: 10px 16px;
  margin-left: 10px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(90deg, #ff5a4a, #e63946);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: all .18s ease;
}

.btn-cancel:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(230, 57, 70, 0.12);
}

.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.plan-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.plan-right .btn-primary,
.plan-right .btn-outline,
.plan-right .btn-cancel {
  height: 44px;
  min-width: 140px;
  padding: 0 18px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.22s cubic-bezier(.2, .9, .2, 1);
  box-shadow: none;
}

.plan-right .btn-primary {
  background: linear-gradient(90deg, #ff7a48, #ff5a1f);
  color: #071129;
  border: none;
  box-shadow: none;
}

.plan-right .btn-primary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: none;
}

.plan-right .btn-outline {
  background: transparent;
  color: #ffb089;
  border: 1.5px solid rgba(255, 107, 53, 0.18);
}

.plan-right .btn-outline:hover:not(:disabled) {
  background: rgba(255, 107, 53, 0.06);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: none;
}

.plan-right .btn-cancel {
  background: linear-gradient(90deg, #ff6b6b, #e63946);
  color: #fff;
  border: none;
  box-shadow: none;
}

.plan-right .btn-cancel:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: none;
}

.cancel-modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  z-index: 12000;
  padding: 20px;
}

.cancel-modal {
  width: 460px;
  max-width: calc(100% - 40px);
  background: linear-gradient(160deg, rgba(13, 18, 28, 0.98), rgba(22, 28, 40, 0.98));
  border-radius: 12px;
  padding: 20px 22px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  color: var(--color-text-white);
  text-align: center;
}

.cancel-modal__title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700
}

.cancel-modal__message {
  margin: 0 0 18px 0;
  color: var(--color-text-secondary);
  line-height: 1.4
}

.cancel-modal__actions {
  display: flex;
  gap: 12px;
  justify-content: center
}

.cancel-modal .btn-outline {
  min-width: 120px
}

.cancel-modal .btn-cancel {
  min-width: 120px
}

@media (max-width: 720px) {
  .plan-right {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .plan-right .btn-primary,
  .plan-right .btn-outline,
  .plan-right .btn-cancel {
    width: 100%;
    min-width: 0;
  }
}

.left-selects {
  width: 100%;
  margin-top: 12px;
  display: flex;
  gap: 4px;
  flex-direction: column;
  align-items: flex-start
}

.left-select {
  width: 100%;
  max-width: 280px
}

.left-select label {
  color: var(--color-text-secondary);
  font-size: 13px;
  margin-bottom: 6px;
  display: block
}

.left-select select {
  width: 100%;
  padding: 10px 12px;
  height: 44px;
  border-radius: 10px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  color: var(--color-text-white);
  transition: box-shadow .18s ease, border-color .12s ease;
  -webkit-appearance: none;
  appearance: none;
  color-scheme: dark;
  background-image: linear-gradient(45deg, transparent 50%, rgba(255, 255, 255, 0.03) 50%), linear-gradient(135deg, rgba(0, 0, 0, 0.02) 50%, transparent 50%);
  background-position: calc(100% - 18px) calc(1em + 2px), calc(100% - 13px) calc(1em + 2px);
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;
  padding-right: 40px;
}

.left-select select:hover {
  box-shadow: 0 6px 18px rgba(255, 107, 53, 0.03)
}

.left-select select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 6px 22px rgba(255, 107, 53, 0.12)
}

.changed {
  border-color: var(--color-primary) !important;
  box-shadow: 0 8px 26px rgba(255, 107, 53, 0.12);
}

.name-edit,
.email-edit,
input[type="text"],
input[type="email"],
input[type="date"],
select,
textarea {
  width: 100%;
  height: 40px;
  padding: 8px 10px;
  border-radius: 10px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  color: var(--color-text-white);
  font-size: 13px;
  transition: box-shadow .15s ease, transform .12s ease
}

.name-edit,
.email-edit {
  max-width: 280px;
  margin-top: 8px
}

.left-field {
  width: 100%;
  max-width: 280px;
  margin-top: 12px;
}

.name-edit:focus,
.email-edit:focus,
input:focus,
select:focus,
textarea:focus {
  outline: none;
  box-shadow: 0 6px 22px rgba(255, 107, 53, 0.15);
  border-color: var(--color-primary);
  transform: translateY(-1px)
}

.badges {
  display: none;
}

.profile-right h3 {
  margin-bottom: 18px;
  font-size: 18px;
  color: var(--color-text-white)
}

.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column
}

label {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 8px
}

input,
textarea {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 10px 12px;
  color: var(--color-text-white);
  font-size: 14px;
  box-sizing: border-box
}

textarea {
  resize: vertical;
  height: 100px;
  padding-top: 10px
}

.plan-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px;
  border-radius: 14px;
  background: linear-gradient(145deg, var(--color-bg-card), rgba(26, 31, 46, 0.95));
  border: 1px solid rgba(255, 107, 53, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  transition: transform .18s ease, box-shadow .18s ease
}

.plan-left h2 {
  font-size: 20px;
  margin: 0 0 6px 0;
  color: var(--color-text-white)
}

.plan-right {
  display: flex;
  gap: 12px;
  align-items: center
}

.status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px
}

.status.active {
  background: rgba(0, 210, 106, 0.08);
  color: #00d26a;
  display: inline-block
}

.status.orange {
  background: var(--color-primary);
  color: white
}

.validity {
  color: var(--color-text-primary);
  margin-top: 8px
}

.btn-primary {
  background: linear-gradient(45deg, var(--color-primary), var(--color-primary-dark));
  border: none;
  color: var(--color-text-white);
  padding: 10px 22px;
  border-radius: 28px;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 107, 53, 0.12)
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none
}

.btn-outline {
  background: transparent;
  border: 1px solid rgba(255, 107, 53, 0.9);
  color: var(--color-primary);
  padding: 10px 22px;
  border-radius: 28px;
  cursor: pointer;
  transition: background .12s ease, color .12s ease
}

.btn-outline:hover {
  background: var(--color-primary);
  color: var(--color-text-white)
}

.btn-primary,
.btn-outline {
  text-decoration: none;
  display: inline-block;
}

.btn-primary:focus,
.btn-outline:focus {
  text-decoration: none;
  outline: none;
}

.large {
  width: 100%;
  padding: 12px;
  font-size: 15px;
  border-radius: 28px
}

.profile-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
  margin-top: 12px
}

.profile-actions .btn-primary,
.profile-actions .btn-outline {
  padding: 8px 18px;
  border-radius: 22px;
}

.badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px
}

.badge.filled {
  background: var(--color-primary);
  color: var(--color-text-white);
  border: 1px solid rgba(255, 107, 53, 0.1)
}

.badge.outlined {
  border: 1px solid rgba(255, 107, 53, 0.14);
  color: var(--color-text-primary);
  background: transparent
}

.loading {
  color: var(--color-text-white);
  font-size: 18px;
  text-align: center;
  margin-top: 100px
}

select,
option {
  background: var(--color-bg-card);
  color: var(--color-text-white)
}

select::-ms-expand {
  display: none
}

select:focus,
select:hover {
  color: var(--color-text-white)
}

select option {
  background: var(--color-bg-card);
  color: var(--color-text-white);
}

@media (max-width:900px) {
  .profile-card {
    flex-direction: column
  }

  .profile-left,
  .profile-right {
    width: 100%
  }

  .profile-left {
    align-items: center;
    text-align: center
  }

  .left-selects {
    align-items: center
  }

  .name-edit,
  .email-edit {
    max-width: 100%
  }

  .bottom-buttons {
    flex-direction: column
  }

  .file-name {
    max-width: 220px
  }
}
</style>
