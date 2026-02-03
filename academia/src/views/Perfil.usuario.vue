<template>
  <div class="profile-container">
  
    <div class="header">
      <div>
        <h2>Meu Perfil</h2>
        <span class="subtitle">Área do usuário</span>
      </div>

      <div class="icons">
        <button>⚙️</button>
        <button>🚪</button>
      </div>
    </div>


    <div class="user-info">
      <div class="avatar">
        <span>👤</span>
        <div class="status"></div>
      </div>

      <div class="user-data">
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>

        <div class="badges">
          <span class="badge">Membro desde {{ user.memberSince }}</span>
          <span class="badge advanced">{{ user.level }}</span>
        </div>
      </div>
    </div>

    <div class="stats">
      <div class="card">
        <h4>🏆 Treinos</h4>
        <strong>{{ stats.workouts }}</strong>
      </div>

      <div class="card active">
        <h4>🎯 Meta Mensal</h4>
        <strong>{{ stats.goal }}%</strong>
      </div>

      <div class="card">
        <h4>🔥 Sequência</h4>
        <strong>{{ stats.streak }} dias</strong>
      </div>
    </div>

 
    <h3 class="section-title">Informações Pessoais</h3>

    <div class="info-grid">
      <div class="info-card">
        <span>Altura</span>
        <strong>{{ info.height }}</strong>
      </div>

      <div class="info-card">
        <span>Peso</span>
        <strong>{{ info.weight }}</strong>
      </div>

      <div class="info-card">
        <span>Objetivo</span>
        <strong>{{ info.goal }}</strong>
      </div>

      <div class="info-card">
        <span>Frequência</span>
        <strong>{{ info.frequency }}</strong>
      </div>
    </div>


    <div class="actions">
      <button class="btn primary">Editar Perfil</button>
      <button class="btn">Meus Treinos</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'


const user = reactive({
  name: 'Carlos Silva',
  email: 'carlos.silva@email.com',
  memberSince: 'Janeiro 2024',
  level: 'Avançado'
})


const stats = reactive({
  workouts: 127,
  goal: 85,
  streak: 15
})


const info = reactive({
  height: '1.78 m',
  weight: '82 kg',
  goal: 'Ganho de massa',
  frequency: '5x por semana'
})
</script>

<style scoped>
.profile-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px;
  background: linear-gradient(145deg, #151515, #1f1f1f);
  border-radius: 20px;
  color: #fff;
  font-family: Arial, sans-serif;
}


.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subtitle {
  color: #ff7a00;
  font-size: 14px;
}

.icons button {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
}


.user-info {
  display: flex;
  align-items: center;
  margin: 25px 0;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #ff7a00;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  position: relative;
}

.status {
  width: 12px;
  height: 12px;
  background: #00ff00;
  border-radius: 50%;
  position: absolute;
  bottom: 3px;
  right: 3px;
}

.user-data {
  margin-left: 15px;
}

.badges {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.badge {
  background: #2a2a2a;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
}

.advanced {
  border: 1px solid #ff7a00;
}


.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.card {
  background: #202020;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
}

.card.active {
  border: 1px solid #ff7a00;
}

.card strong {
  font-size: 22px;
}


.section-title {
  margin: 30px 0 15px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.info-card {
  background: #202020;
  padding: 15px;
  border-radius: 12px;
  display: flex;
 gap: 5px;
align-items: center;
}

.info-card span {
  color: #aaa;
  font-size: 13px;
}


.actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.btn {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #2a2a2a;
  color: white;
  cursor: pointer;
}

.primary {
  background: linear-gradient(to right, #ff7a00, #ff3d00);
}
</style>
