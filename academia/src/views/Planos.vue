<template>
    <div class="planos-container">
        <h1 class="planos-titulo">Nossos Planos</h1>
        <div class="planos-lista">
            <div class="plano-card" v-for="plano in planos" :key="plano.id">
                <h2 class="plano-nome">{{ plano.nome }}</h2>
                <p class="plano-descricao">{{ plano.descricao }}</p>
                <p class="plano-preco">R$ {{ plano.preco.toFixed(2) }}</p>
                <a href="#" class="plano-assinar">Assinar</a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.planos-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}

.planos-titulo {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 40px;
    color: #333;
}

.planos-lista {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.plano-card {
    border: 2px solid #ddd;
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
}

.plano-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.plano-nome {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #333;
}

.plano-descricao {
    color: #666;
    margin-bottom: 20px;
    line-height: 1.6;
}

.plano-preco {
    font-size: 2rem;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 25px;
}

.plano-assinar {
    display: inline-block;
    padding: 12px 30px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.plano-assinar:hover {
    background-color: #0056b3;
}
</style>

<script lang="ts" setup>
import { ref } from 'vue';
interface Plano {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
}
const planos = ref<Plano[]>([
    { id: 1, nome: 'Básico', descricao: 'Acesso à academia durante o horário comercial.', preco: 99 },
    { id: 2, nome: 'Premium', descricao: 'Acesso 24/7, aulas em grupo e avaliação física mensal.', preco: 199 },
    { id: 3, nome: 'VIP', descricao: 'Todos os benefícios do Premium + personal trainer e nutrição personalizada.', preco: 299 },
]);
</script>