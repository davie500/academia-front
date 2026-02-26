<template>
    <div class="fundo"></div>
    <div class="container">
        <h1 class="titulo">Transforme Seu Corpo</h1>
        <h1 class="titulo cores">Alcance Sem Limites</h1>
        <p class="descricao">Treinamento personalizado, equipamentos de última geração e uma comunidade dedicada ao seu sucesso. Comece sua jornada fitness hoje mesmo.</p>
    </div>
    <router-link color="primary" class="plans" :to="{ name: 'Planos'}">Ver Planos</router-link>
</template>


<style>
* {
    font-family: Arial, Helvetica, sans-serif;
}
.fundo {
    width: 100%;
    height: 100vh;
    background-image: url('/assets/fundo.png');
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    filter: brightness(0.5);
    backdrop-filter: blur(5px);
}

.fundo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2); 
  backdrop-filter: blur(5px);      
}


.titulo {
    color: white;
    text-align: center;
    font-size: clamp(1.9rem, 8vw, 5rem);
    position: static;
    transform: none;
    margin-top: 6vh;
    line-height: 1.1;
    display: block;
}
.cores {
    display: block;
    background-image: linear-gradient(to right, #ff7f00, #ff0000);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-top: 0.25rem;
}
.descricao {
    color: rgba(214, 209, 209, 0.89);
    text-align: center;
    font-size: clamp(0.95rem, 3vw, 1.5rem);
    margin: 0.8rem 0 0;
    padding: 0 0.6rem;
}
.plans {
    background-image: linear-gradient(to right, #ff7f00, #ff0000);
    color: white;
    text-decoration: none;
    display: block;
    width: calc(100% - 2rem);
    text-align: center;
    padding: clamp(12px, 4vw, 20px) clamp(6px, 3vw, 40px);
    border-radius: 10px;
    transition: all 0.3s ease;
    margin: 1.5rem auto 0;
}
.plans:hover {
    transform: scale(1.05);
}


@media (min-width: 600px) {
    .titulo,
    .cores,
    .descricao,
    .plans {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    .titulo {
        top: 25%;
        white-space: nowrap;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 500;
    }
    .cores {
        top: 38%;
        margin-top: 0;
    }
    .descricao {
        top: 63%;
        margin: 0;
        padding: 0;
    }
    .plans {
        top: 85%;
        margin: 0;
        width: auto;
        border-radius: 8px;
    }
    .plans:hover {
        transform: translate(-50%, -50%) scale(1.1);
    }
}

@media (min-width: 900px) {
    .titulo { font-size: 5em; }
    .descricao { font-size: 1.5em; }
    .plans { font-size: 1.2em; }
}
</style>