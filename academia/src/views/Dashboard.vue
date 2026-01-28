<script>

</script>

<template>
    <img src="../assets/fundo.png" alt="Fundo Academia" class="fundo" />
    <div class="container">
        <h1 class="titulo">Transforme Seu Corpo</h1>
        <h1 class="titulo cores">Alcance Sem Limites</h1>
        <p class="descricao">Treinamento personalizado, equipamentos de última geração e uma comunidade dedicada ao seu sucesso. Comece sua jornada fitness hoje mesmo.</p>
    </div>
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
    filter: brightness(0.7);
    backdrop-filter: blur(5px);
}
.titulo {
    color: white;
    text-align: center;
    font-size: 3em;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.cores {
    background-image: linear-gradient(to right, #ff7f00, #ff0000);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-top: 80px;
}
.descricao {
    color: rgba(214, 209, 209, 0.89);
    text-align: center;
    font-size: 1.5em;
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>