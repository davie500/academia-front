<template>
  <div class="login-container">
    <div class="overlay"></div>

    <!-- Logo -->
    <div class="logo-area">
      <h1 class="logo">FITFORCE</h1>
      <div class="logo-line"></div>
    </div>

    <!-- Card -->
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
          <label class="remember">
            <input type="checkbox">
            Lembrar-me
          </label>

          <a href="#" class="forgot">Esqueceu a senha?</a>
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

    <footer class="footer-text">
      Transforme Seu Corpo, <span>Alcance Seus Limites</span>
    </footer>
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
/* Fundo */
.login-container {
  position: relative;
  min-height: 100vh;
  background-image: url('/gym-bg.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
}

/* Logo */
.logo-area {
  position: absolute;
  top: 40px;
  text-align: center;
  z-index: 2;
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

/* Card */
.login-box {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 380px;
  padding: 32px;
  background: rgba(15, 15, 15, 0.95);
  border-radius: 14px;
  box-shadow: 0 0 30px rgba(255, 80, 0, 0.25);
}

/* Textos */
.welcome {
  font-size: 28px;
  margin-bottom: 4px;
}

.subtitle {
  color: #ff6a00;
  margin-bottom: 24px;
}

/* Form */
.form-group {
  margin-bottom: 18px;
}

label {
  display: block;
  font-size: 14px;
  margin-bottom: 6px;
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

/* Opções */
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

/* Botão */
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

/* Footer do card */
.login-footer {
  text-align: center;
  font-size: 14px;
}

.login-footer a {
  color: #ff6a00;
  font-weight: bold;
  text-decoration: none;
}

/* Rodapé */
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
