<template>
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
                <select v-model="edit.genero">
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div class="left-select">
                <label>Nível de Treino</label>
                <select v-model="edit.nivel_treino">
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>
            </div>

            <input class="name-edit" v-model="edit.nome" type="text" />
            <input class="email-edit" v-model="edit.email" type="email" />

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
            <input v-model="edit.altura_cm" type="text" :placeholder="usuario.altura_cm ? '' : 'Você ainda não colocou este valor'" />
          </div>

          <div class="form-group">
            <label>Peso</label>
            <input v-model="edit.peso_kg" type="text" :placeholder="usuario.peso_kg ? '' : 'Você ainda não colocou este valor'" />
          </div>

          <div class="form-group">
            <label>Data de Nascimento</label>
            <input v-model="edit.data_nascimento" type="date" :placeholder="usuario.data_nascimento ? '' : 'Você ainda não colocou este valor'" />
          </div>

          <div class="form-group">
            <label>Objetivo</label>
            <select v-model="edit.objetivo">
              <option disabled value="">{{ usuario.objetivo || '—' }}</option>
              <option value="Emagrecimento">Emagrecimento</option>
              <option value="Hipertrofia">Hipertrofia</option>
              <option value="Condicionamento">Condicionamento</option>
            </select>
          </div>

          <div class="form-group">
            <label>Observações</label>
            <textarea v-model="edit.observacoes" :placeholder="usuario.observacoes ? '' : 'Você ainda não colocou este valor'"></textarea>
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

      <div class="bottom-buttons">
        <template v-if="hasChanges">
          <button class="btn-outline large" @click="cancelInlineEdit">Cancelar</button>
          <button class="btn-primary large" :disabled="!hasChanges || isSaving" @click="saveInlineEdit">
            <span v-if="isSaving">Salvando...</span>
            <span v-else>Salvar mudanças</span>
          </button>
        </template>
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

const toast = useToast()

const usuario = ref(null)
const loading = ref(true)
const isSaving = ref(false)
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
    syncEditFromUsuario()
    console.log("Usuário carregado:", usuario.value)
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
  } finally {
    loading.value = false
  }
})

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
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  font-family: 'Segoe UI', sans-serif;
  color: var(--color-text-white);
  background: linear-gradient(180deg, var(--color-bg-dark), var(--color-bg-darker));
}

.container {
  width: 100%;
  max-width: 1100px
}

.card {
  background: linear-gradient(145deg, var(--color-bg-card), rgba(26, 31, 46, 0.95));
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

.profile-card {
  display: flex;
  gap: 24px;
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
  width: 120px;
  height: 120px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(45deg, var(--color-primary), var(--color-primary-dark));
  margin-bottom: 16px
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

.left-selects {
  width: 100%;
  margin-top: 12px;
  display: flex;
  gap: 12px;
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
  background-image: linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.03) 50%), linear-gradient(135deg, rgba(0,0,0,0.02) 50%, transparent 50%);
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

.name-edit,
.email-edit,
input[type="text"],
input[type="email"],
input[type="date"],
select,
textarea {
  width: 100%;
  height: 44px;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  color: var(--color-text-white);
  font-size: 14px;
  transition: box-shadow .15s ease, transform .12s ease
}

.name-edit,
.email-edit {
  max-width: 280px;
  margin-top: 12px
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
  height: 110px;
  padding-top: 12px
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

.large {
  width: 100%;
  padding: 12px;
  font-size: 15px;
  border-radius: 28px
}

.bottom-buttons {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 8px
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
    text-align: center;
    
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

  .plan-card[data-v-d8791ea3] {
        padding: 18px 8px;
    }

}
</style>