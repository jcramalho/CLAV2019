<template>
    <v-layout wrap ma-2>
    <!-- EXEMPLOS DE NOTAS DE APLICAÇÂO -->
        <v-flex xs2>
            <div class="info-label">Exemplos de Notas de Aplicação</div>
        </v-flex>
        <v-flex xs10>
            <div class="info-content">
                <ul>
                    <li v-for="e in exemplos" :key="e.idExemplo">
                        {{ e.exemplo }}
                    </li>
                </ul>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    props: ["exemplos"]
}
</script>

<style>
.info-label {
    color: #1A237E;
    padding: 5px; 
    font-weight: 400;
    width: 100%;
    background-color: #dee2f8;
    font-weight: bold;
}

.info-content {
    padding: 5px; 
    width: 100%;
    border: 1px solid #1A237E ;
}
</style>