<template>
    <div class="container">
        <h1 class="titulo">Transforme Seu Corpo</h1>
        <h1 class="titulo cores">Alcance Sem Limites</h1>
        <p class="descricao">Treinamento personalizado, equipamentos de última geração e uma comunidade dedicada ao seu sucesso. Comece sua jornada fitness hoje mesmo.</p>
    </div>
    <router-link color="primary" class="plans" to="/planos">Ver Planos</router-link>
</template>

<style>
* {
    font-family: Arial, Helvetica, sans-serif;
}
.fundo {
    width: 100%;
    height: 100vh;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    filter: brightness(0.5);
    backdrop-filter: blur(5px);
}
.titulo {
    color: white;
    text-align: center;
    font-size: 5em;
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 500;
}
.cores {
    background-image: linear-gradient(to right, #ff7f00, #ff0000);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    top: 38%;
}
.descricao {
    color: rgba(214, 209, 209, 0.89);
    text-align: center;
    font-size: 1.5em;
    position: absolute;
    top: 63%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.plans {
    background-image: linear-gradient(to right, #ff7f00, #ff0000);
    color: white;
    position: absolute;
    text-decoration: none;
    top: 85%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.2em;
    padding: 20px 40px;
    border-radius: 8px;
    transition: all 0.3s ease;
}
.plans:hover {
    text-decoration: none;
    color: white;
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 8px 20px rgba(255, 127, 0, 0.4);
}
</style>