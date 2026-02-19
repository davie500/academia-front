<template>
  <div class="page">
    <div class="container" v-if="!loading && usuario">

      <!-- CARD PERFIL -->
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

          <h2 class="name">{{ usuario.nome }}</h2>
          <p class="email">{{ usuario.email }}</p>

          <div class="badges" v-if="usuario.nivel_treino || usuario.objetivo || usuario.genero">
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
            <input
              type="text"
              :value="usuario.altura_cm ? usuario.altura_cm + ' cm' : 'Você ainda não colocou este valor'"
              readonly
              :class="{ placeholder: !usuario.altura_cm }"
            />
          </div>

          <div class="form-group">
            <label>Peso</label>
            <input
              type="text"
              :value="usuario.peso_kg ? usuario.peso_kg + ' kg' : 'Você ainda não colocou este valor'"
              readonly
              :class="{ placeholder: !usuario.peso_kg }"
            />
          </div>

          <div class="form-group">
            <label>Data de Nascimento</label>
            <input
              type="text"
              :value="usuario.data_nascimento ? formatarData(usuario.data_nascimento) : 'Você ainda não colocou este valor'"
              readonly
              :class="{ placeholder: !usuario.data_nascimento }"
            />
          </div>

          <div class="form-group">
            <label>Objetivo</label>
            <input
              type="text"
              :value="usuario.objetivo || 'Você ainda não colocou este valor'"
              readonly
              :class="{ placeholder: !usuario.objetivo }"
            />
          </div>

          <div class="form-group">
            <label>Observações</label>
            <textarea readonly :class="{ placeholder: !usuario.observacoes }">
{{ usuario.observacoes || 'Você ainda não colocou este valor' }}
            </textarea>
          </div>
        </div>
      </div>

      <!-- CARD PLANO -->
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
              <router-link to="/planos" class="btn-primary">Gerenciar Plano</router-link>
              <router-link :to="{ path: '/pagamento', query: { plano: planoQuery }}" class="btn-outline">Pagar próximo mês</router-link>
            </div>
          </template>

          <template v-else>
            <div class="plan-left">
              <h2>Plano {{ usuario.assinatura.plano?.nome || '—' }}</h2>
              <div>
                <span class="status orange">Plano Inativo</span>
              </div>
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

      <!-- BOTÕES -->
      <div class="bottom-buttons">
        <button class="btn-primary large" @click="openEdit">
          Editar Perfil
        </button>

        
      </div>

    </div>

    <!-- Edit Modal -->
    <div v-if="isEditOpen" class="modal-backdrop" @click.self="closeEdit">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header class="modal-header">
          <h4 id="modal-title">Editar Perfil</h4>
          <button class="close" @click="closeEdit" aria-label="Fechar">×</button>
        </header>

        <form class="modal-body" @submit.prevent="saveEdit">
          <div class="form-grid">
            <label>Nome
              <input v-model="edit.nome" type="text" />
            </label>

            <label>Email
              <input v-model="edit.email" type="email" />
            </label>

            <label>Gênero
              <select v-model="edit.genero">
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </label>

            <label>Nível de Treino
              <select v-model="edit.nivel_treino">
                <option value="Iniciante">iniciante</option>
                <option value="Intermediário">intermediario</option>
                <option value="Profissional">avancado</option>
              </select>
            </label>

            <label>Altura (cm)
              <input v-model="edit.altura_cm" type="text" />
            </label>

            <label>Peso (kg)
              <input v-model="edit.peso_kg" type="text" />
            </label>

            <label>Data de Nascimento
              <input v-model="edit.data_nascimento" type="date" />
            </label>

            <label>Objetivo
              <select v-model="edit.objetivo">
                <option value="Emagrecimento">emagrecimento</option>
                <option value="Hipertrofia">hipertrofia</option>
                <option value="Condicionamento">condicionamento</option>
              </select>
            </label>

            <label class="full">Foto de Perfil
              <input type="file" @change="handleFileUpload" accept="image/*" />
              <small v-if="edit.foto_perfil" style="color: #00d26a; margin-top: 4px; display: block;">✓ Arquivo selecionado</small>
            </label>

            <label class="full">Observações
              <textarea v-model="edit.observacoes" rows="4"></textarea>
            </label>
          </div>

          <footer class="modal-actions">
            <button type="submit" class="btn-primary" :disabled="isSaving">
              <span v-if="isSaving">Salvando...</span>
              <span v-else>Salvar</span>
            </button>
          </footer>
        </form>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      Carregando perfil...
    </div>
  </div>
</template>

<script setup>
import api from "@/controller/api"
import { ref, onMounted, reactive, computed } from "vue"
import { useToast } from 'vue-toastification'

const toast = useToast()

const usuario = ref(null)
const loading = ref(true)
const isEditOpen = ref(false)
const isSaving = ref(false)
const edit = reactive({})

const planoQuery = computed(() => {
  const nome = String(usuario.value?.assinatura?.plano?.nome || '').toLowerCase()
  return nome.includes('plus') ? 'plus' : 'basico'
})


function formatarData(data) {
  if (!data) return ""

  const [ano, mes, dia] = data.split('T')[0].split('-')
  return `${dia}/${mes}/${ano}`
}

onMounted(async () => {
  try {
    const response = await api.get("/auth/me")
    usuario.value = response.data
    console.log("Usuário carregado:", usuario.value)
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
  } finally {
    loading.value = false
  }
})

function openEdit() {
  if (!usuario.value) return
  edit.nome = usuario.value.nome
  edit.email = usuario.value.email
  edit.altura_cm = usuario.value.altura_cm
  edit.peso_kg = usuario.value.peso_kg
  edit.data_nascimento = usuario.value.data_nascimento ? usuario.value.data_nascimento.split('T')[0] : ''
  edit.objetivo = usuario.value.objetivo
  edit.observacoes = usuario.value.observacoes
  edit.nivel_treino = usuario.value.nivel_treino
  edit.genero = usuario.value.genero
  isEditOpen.value = true
}

function closeEdit() {
  isEditOpen.value = false
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    edit.foto_perfil = file
  }
}

async function saveEdit() {
  isSaving.value = true
  try {
    const formData = new FormData()

    formData.append('_method', 'PUT')
    formData.append('nome', edit.nome)
    formData.append('email', edit.email)
    formData.append('altura_cm', edit.altura_cm)
    formData.append('peso_kg', edit.peso_kg)
    formData.append('data_nascimento', edit.data_nascimento)
    formData.append('objetivo', edit.objetivo)
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
    isEditOpen.value = false

  } catch (err) {
    console.error('Erro ao salvar perfil', err)
    toast.error('Erro ao salvar perfil')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 30%, #0f1a2e, #05070f 70%);
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  font-family: 'Segoe UI', sans-serif;
  color: #fff;
}

.container {
  width: 100%;
  max-width: 1100px;
}

.card {
  background: linear-gradient(145deg, #0e1220, #0a0f1c);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 40px;
  border: 1px solid #ff5a1f55;
  box-shadow: 0 0 25px rgba(255, 90, 31, 0.15);
}

.profile-card {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.profile-left {
  width: 35%;
}

.profile-right {
  width: 65%;
}

.avatar-wrapper {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(45deg, #ff5a1f, #ff8a3d);
  margin-bottom: 20px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.name {
  font-size: 20px;
  margin-bottom: 5px;
}

.email {
  color: #aaa;
  font-size: 14px;
  margin-bottom: 20px;
}

.badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
}

.badge.filled {
  background: #ff5a1f;
  color: white;
}

.badge.outlined {
  border: 1px solid #ff5a1f;
  color: #ff5a1f;
}

.profile-right h3 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
}

label {
  font-size: 13px;
  color: #aaa;
  margin-bottom: 6px;
}

input,
textarea {
  background: #111627;
  border: 1px solid #333a50;
  border-radius: 10px;
  padding: 10px;
  color: white;
  font-size: 14px;
}

input.placeholder,
textarea.placeholder {
  color: #888;
  font-style: italic;
}

textarea {
  resize: none;
  height: 70px;
}

.plan-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.plan-left {
  flex: 1 1 auto
}

.plan-right {
  display: flex;
  gap: 12px;
  align-items: center
}

.plan-right .btn-primary {
  margin: 0
}

.plan-right .btn-outline {
  background: transparent
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
}

.status.active {
  background: #1f3b2b;
  color: #00d26a;
  margin-top: 8px;
  display: inline-block;
}

.status.orange {
  background: #ff5a1f;
  color: white;
}

.validity {
  color: #aaa;
  margin-top: 8px;
}

.btn-primary {
  background: linear-gradient(45deg, #ff5a1f, #ff8a3d);
  border: none;
  color: white;
  padding: 10px 25px;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 20px;
  transition: 0.3s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline {
  background: transparent;
  border: 1px solid #ff5a1f;
  color: #ff5a1f;
  padding: 10px 25px;
  border-radius: 30px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-outline:hover {
  background: #ff5a1f;
  color: white;
}

.large {
  width: 100%;
  padding: 14px;
  font-size: 15px;
}

.bottom-buttons {
  display: flex;
  gap: 20px;
}

.loading {
  color: white;
  font-size: 18px;
  text-align: center;
  margin-top: 100px;
}

@media (max-width: 900px) {
  .profile-card {
    flex-direction: column;
  }

  .profile-left,
  .profile-right {
    width: 100%;
  }

  .bottom-buttons {
    flex-direction: column;
  }
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 6, 10, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999
}

.modal {
  width: 920px;
  max-width: 96%;
  background: linear-gradient(145deg, #0e1220, #0a0f1c);
  border-radius: 14px;
  padding: 18px;
  border: 1px solid rgba(255, 107, 53, 0.08);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px
}

.modal-header h4 {
  margin: 0;
  color: var(--color-text-white)
}

.close {
  background: transparent;
  border: 0;
  color: var(--color-text-secondary);
  font-size: 20px;
  cursor: pointer
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  max-height: calc(90vh - 120px);
  padding-right: 8px;
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #ff5a1f;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #ff8a3d;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px
}

.form-grid label {
  display: flex;
  flex-direction: column;
  color: var(--color-text-secondary);
  font-size: 13px
}

.form-grid input,
.form-grid textarea,
.form-grid select {
  margin-top: 6px;
  background: #111627;
  border: 1px solid #333a50;
  padding: 10px;
  border-radius: 10px;
  color: white;
  font-size: 14px
}

.form-grid input[type="file"] {
  cursor: pointer;
}

.form-grid select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding-right: 44px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%23ff5a1f' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  cursor: pointer;
}

.form-grid select:focus {
  outline: none;
  border-color: #ff8a3d;
  box-shadow: 0 0 0 4px rgba(255, 138, 61, 0.06);
}

.form-grid textarea {
  resize: vertical
}

.form-grid .full {
  grid-column: 1/-1
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 8px
}

@media (max-width:900px) {
  .form-grid {
    grid-template-columns: 1fr
  }

  .modal {
    width: 92%
  }
}
</style>
