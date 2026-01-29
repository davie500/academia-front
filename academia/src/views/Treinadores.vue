<template>
    <div>
        <h1>Treinadores</h1>
        <div class="trainers-list">
            <div class="trainer-card" v-for="trainer in trainers" :key="trainer.id">
                <h2 class="trainer-name">{{ trainer.name }}</h2>
                <p class="trainer-specialty">{{ trainer.specialty }}</p>
            </div>
        </div>
    </div>
</template>

<style>
.trainers-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.trainer-card {
    border: 1px solid #ccc;
    padding: 15px;
    border-radius: 8px;
    width: calc(33.333% - 20px);
}

.trainer-name {
    margin-bottom: 10px;
}

.trainer-specialty {
    color: #666;
}
</style>

<script lang="ts" setup>
import { ref } from 'vue';

interface Trainer {
    id: number;
    name: string;
    specialty: string;
}
const trainers = ref<Trainer[]>([
    { id: 1, name: 'João Silva', specialty: 'Musculação' },
    { id: 2, name: 'Maria Oliveira', specialty: 'Cardio' },
    { id: 3, name: 'Carlos Pereira', specialty: 'Crossfit' },
    { id: 4, name: 'Ana Costa', specialty: 'Yoga' },
    { id: 5, name: 'Pedro Santos', specialty: 'Pilates' },
    { id: 6, name: 'Luiza Fernandes', specialty: 'Treinamento Funcional' },
]);
</script>