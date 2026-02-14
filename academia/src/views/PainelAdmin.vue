<template>
  <div class="admin-page">
    <section class="admin-hero">
      <div>
        <p class="eyebrow">Painel Administrativo</p>
        <h1>Controle da academia em tempo real</h1>
        <p class="hero-subtitle">
          Visao geral de assinaturas, alunos e operacao em um unico lugar.
        </p>
      </div>
      <div class="hero-actions">
        <button type="button" class="btn btn-primary">Novo Plano</button>
        <button type="button" class="btn btn-ghost">Exportar Relatorio</button>
      </div>
    </section>

    <section class="kpi-grid">
      <article class="kpi-card">
        <p class="kpi-label">Alunos Ativos</p>
        <strong class="kpi-value">284</strong>
        <span class="kpi-trend up">+8.4% este mes</span>
      </article>
      <article class="kpi-card">
        <p class="kpi-label">Receita Mensal</p>
        <strong class="kpi-value">R$ 32.480</strong>
        <span class="kpi-trend up">+4.1% vs mes anterior</span>
      </article>
      <article class="kpi-card">
        <p class="kpi-label">Planos Pendentes</p>
        <strong class="kpi-value">17</strong>
        <span class="kpi-trend">5 vencem hoje</span>
      </article>
      <article class="kpi-card">
        <p class="kpi-label">Tickets de Suporte</p>
        <strong class="kpi-value">6</strong>
        <span class="kpi-trend down">2 urgentes</span>
      </article>
    </section>

    <section class="panel-grid">
      <article class="panel-card">
        <div class="panel-head">
          <h2>Ações Rápidas</h2>
        </div>
        <div class="quick-actions">
          <button class="quick-item" type="button">
            <span class="quick-title">Cadastrar aluno</span>
            <span class="quick-desc">Criar acesso e vincular plano.</span>
          </button>
          <button class="quick-item" type="button">
            <span class="quick-title">Registrar pagamento</span>
            <span class="quick-desc">Atualizar status financeiro.</span>
          </button>
          <button class="quick-item" type="button">
            <span class="quick-title">Publicar aviso</span>
            <span class="quick-desc">Enviar comunicacao para alunos.</span>
          </button>
          <button class="quick-item" type="button">
            <span class="quick-title">Criar treino</span>
            <span class="quick-desc">Novo bloco para turma ou aluno.</span>
          </button>
        </div>
      </article>

      <article class="panel-card">
        <div class="panel-head">
          <h2>Últimas Atividades</h2>
        </div>
        <ul class="activity-list">
          <li>
            <span class="dot"></span>
            <div>
              <strong>Assinatura renovada</strong>
              <p>Ana Paula renovou plano Premium.</p>
            </div>
            <time>09:42</time>
          </li>
          <li>
            <span class="dot"></span>
            <div>
              <strong>Pagamento aprovado</strong>
              <p>R$ 129,90 confirmado via Pix.</p>
            </div>
            <time>08:17</time>
          </li>
          <li>
            <span class="dot"></span>
            <div>
              <strong>Novo aluno</strong>
              <p>Leonardo Souza criado no sistema.</p>
            </div>
            <time>Ontem</time>
          </li>
        </ul>
      </article>
    </section>

    <section class="panel-card table-card">
      <div class="panel-head">
        <h2>Usuários Recentes</h2>
        <button type="button" class="btn btn-ghost small">Ver todos</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Plano</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Maria Costa</td>
              <td>maria.costa@email.com</td>
              <td>Mensal</td>
              <td><span class="status active">Ativo</span></td>
            </tr>
            <tr>
              <td>Lucas Almeida</td>
              <td>lucas.almeida@email.com</td>
              <td>Trimestral</td>
              <td><span class="status pending">Pendente</span></td>
            </tr>
            <tr>
              <td>Camila Rocha</td>
              <td>camila.rocha@email.com</td>
              <td>Anual</td>
              <td><span class="status active">Ativo</span></td>
            </tr>
            <tr>
              <td>Pedro Nunes</td>
              <td>pedro.nunes@email.com</td>
              <td>Mensal</td>
              <td><span class="status blocked">Bloqueado</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at top right, rgba(255, 107, 53, 0.14), transparent 45%),
    radial-gradient(circle at bottom left, rgba(255, 87, 34, 0.08), transparent 35%),
    linear-gradient(180deg, var(--color-bg-dark), var(--color-bg-darker));
  color: var(--color-text-white);
}

.admin-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.admin-hero h1 {
  margin: 0;
  font-size: clamp(24px, 4vw, 34px);
  line-height: 1.15;
}

.hero-subtitle {
  margin: 10px 0 0;
  color: var(--color-text-primary);
  max-width: 58ch;
}

.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-primary {
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-dark));
  color: #121212;
}

.btn-primary:hover {
  filter: brightness(1.06);
  transform: translateY(-1px);
}

.btn-ghost {
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-text-primary);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.btn-ghost:hover {
  border-color: rgba(255, 107, 53, 0.35);
  color: var(--color-text-white);
}

.btn.small {
  padding: 8px 12px;
  font-size: 13px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.kpi-card {
  background: linear-gradient(180deg, rgba(26, 31, 46, 0.85), rgba(10, 13, 19, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 16px;
}

.kpi-label {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.kpi-value {
  display: block;
  margin-top: 8px;
  font-size: clamp(22px, 3vw, 28px);
  color: var(--color-text-white);
}

.kpi-trend {
  display: inline-block;
  margin-top: 8px;
  font-size: 12px;
  color: var(--color-text-primary);
}

.kpi-trend.up {
  color: #34d399;
}

.kpi-trend.down {
  color: #f87171;
}

.panel-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}

.panel-card {
  background: linear-gradient(180deg, rgba(20, 25, 38, 0.95), rgba(11, 14, 21, 0.96));
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 16px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.panel-head h2 {
  margin: 0;
  font-size: 17px;
  color: var(--color-text-white);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.quick-item {
  width: 100%;
  text-align: left;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 12px;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: 0.2s ease;
}

.quick-item:hover {
  border-color: rgba(255, 107, 53, 0.4);
  background: rgba(255, 107, 53, 0.08);
}

.quick-title {
  display: block;
  color: var(--color-text-white);
  font-weight: 700;
  margin-bottom: 4px;
}

.quick-desc {
  font-size: 13px;
}

.activity-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-list li {
  display: grid;
  grid-template-columns: 10px 1fr auto;
  align-items: start;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.activity-list li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  margin-top: 7px;
  background: var(--color-primary);
  box-shadow: 0 0 12px rgba(255, 107, 53, 0.6);
}

.activity-list strong {
  color: var(--color-text-white);
}

.activity-list p {
  margin: 3px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.activity-list time {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.table-card {
  padding: 0;
  overflow: hidden;
}

.table-card .panel-head {
  padding: 16px 16px 12px;
  margin: 0;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 680px;
}

thead th {
  text-align: left;
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

tbody td {
  color: var(--color-text-primary);
  padding: 13px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

tbody tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

.status {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 999px;
}

.status.active {
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
}

.status.pending {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.15);
}

.status.blocked {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.14);
}

@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .panel-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .admin-page {
    padding: 16px;
  }

  .admin-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
