<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="welcome">Bem-vindo</h2>
      <p class="subtitle">Entre na sua conta</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            required
          >
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
          >
        </div>

        <div class="options">
          <a href="#" class="forgot">Esqueceu a senha?</a>
        </div>
        <br>
<div class="terms">
  <input type="checkbox" id="terms" required />
  <label for="terms">
    Li e aceito os 
    <span class="terms-link" onclick="openTerms()">Termos de Uso</span>
  </label>
</div>

<!-- MODAL -->
<div id="termsModal" class="modal">
  <div class="modal-content">
    <span class="close" onclick="closeTerms()">×</span>

    <!-- COLE AQUI O TEXTO DO TERMO -->
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
Ao marcar a opção “Li e aceito os Termos de Uso”, o usuário declara que leu,
compreendeu e concorda com todas as condições aqui apresentadas.
</p>
<button type="button" class="btn-voltar" onclick="closeTerms()">Voltar</button>

</div>
</div>
        <button type="submit" class="login-button">
          ENTRAR
        </button>
      </form>

      <div class="login-footer">
        <p>
          Não tem uma conta?
          <a href="#signup">CADASTRE-SE</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    handleLogin() {
      console.log('Login:', this.email, this.password);
    }
  }
};
</script>

<style scoped>
.btn-voltar {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  background: linear-gradient(90deg, #ff0000, #ff7a00);
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
/* Fundo escuro */
.modal {
  display: none;
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
  box-shadow: 0 0 20px rgba(255, 122, 0, 0.4);
}

/* Títulos */
.modal-content h2 {
  margin-bottom: 15px;
  color: #ff7a00;
}

.modal-content h3 {
  margin-top: 20px;
  color: #ff7a00;
}

/* Texto */
.modal-content p {
  font-size: 14px;
  line-height: 1.6;
  margin-top: 8px;
}

/* Botão fechar */
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
  margin: 15px 0;
  font-size: 14px;
}

.terms input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  display: flex;
  margin: 0px;
}

.terms a {
  color: #ff7a00;
  text-decoration: none;
}

.terms a:hover {
  text-decoration: underline;
}
.login-container {
  position: relative;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
}

.login-container {
  position: relative;

}

.login-container::before {
  content: "FITFORCE";
  position: absolute;
  left: 80px;
  top: 50%;
  transform: translateY(-50%);
  
  font-size: 245px;
  font-weight: 800;
  letter-spacing: 4px;
  z-index: 0;
  pointer-events: none;
}


.overlay{
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
  max-width: 380px;
  padding: 32px;
  background: rgba(15, 15, 15, 0.95);
  border-radius: 14px;
  box-shadow: 0 0 30px rgba(255, 80, 0, 0.25);
}

.welcome {
  font-size: 40px;
  margin-bottom: 4px;
  display: flex;
  justify-content: center;
}

.subtitle {
  color: #ff6a00;
  margin-bottom: 24px;
}


.form-group {
  margin-bottom: 18px;
}

label {
  display: flex;
  font-size: 14px;
  margin-bottom: 6px;
  gap: 4px;
  flex-direction: row;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #333;
  background: #0f0f0f;
  color: #fff;
}

input::placeholder {
  color: #777;
}

input:focus {
  outline: none;
  border-color: #ff6a00;
}


.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  margin-bottom: 20px;
}

.remember {
  display: flex;
  gap: 6px;
  align-items: center;
}

.forgot {
  color: #ff6a00;
  text-decoration: none;
}


.login-button {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(90deg, #ff0000, #ff6a00);
  color: #fff;
  font-weight: bold;
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

.login-footer a {
  color: #ff6a00;
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
  color: #ff6a00;
}
</style>
