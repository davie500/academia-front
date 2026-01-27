<template>
    <div class="login-container">
        <div class="login-box">
            <h1 class="login-title">Bem-vindo de volta</h1>
            <p class="login-write">Faça login para acessar sua conta</p>
            
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="email">Email</label>
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

                <button type="submit" class="login-button">Entrar</button>
            </form>

            <div class="login-footer">
                <p>Não tem uma conta? <a href="#signup">Cadastre-se</a></p>
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
* {
    font-family: Arial, Helvetica, sans-serif;
}

.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #000;
}

.login-write {
    color: #cccccc7d;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    margin-bottom: 30px;
    font-size: 14px;
}

.login-box {
    width: 100%;
    max-width: 400px;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(255, 107, 53, 0.2);
    border: 1px solid #ff6b35;
}

.login-title {
    color: #fff;
    text-align: center;
    margin-bottom: 30px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 2px;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    color: #fff;
    margin-bottom: 8px;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

input {
    width: 100%;
    padding: 12px 15px;
    background: #111;
    border: 2px solid #333;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

input:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 10px rgba(255, 107, 53, 0.3);
}

.login-button {
    width: 100%;
    padding: 12px;
    margin-top: 20px;
    background: linear-gradient(135deg, #e36b09, #e30808);
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.login-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.login-footer {
    text-align: center;
    margin-top: 20px;
    color: #999;
    font-size: 13px;
}

.login-footer a {
    color: #ff6b35;
    text-decoration: none;
    transition: color 0.3s ease;
}

.login-footer a:hover {
    color: #ff8c42;
}
</style>

<script lang="ts" setup>
</script>