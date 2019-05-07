<template>
    <v-layout wrap row ma-2>
    <!-- Notas de Exclusão -->
        <v-flex xs2>
            <div class="info-label">Notas de Exclusão</div>
            <v-tooltip top color="info">
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" color="green darken-2" dark round @click="insereNovaNota(c.notasEx, 'ne')">
                        Nota Exclusão
                        <v-icon dark right>add_circle_outline</v-icon>
                    </v-btn>
                </template>
                <span>Nota de exclusão</span>
            </v-tooltip>
        </v-flex>
        <v-flex>
            <v-layout fluid row v-for="(nota, index) in c.notasEx" :key="index">
                <v-flex xs9>
                    <v-textarea
                        v-model="nota.nota"
                        auto-grow
                        solo
                        label="Nota de Exclusão:"
                        rows="1"
                    ></v-textarea>
                </v-flex>
                <v-flex>
                    <v-btn color="red darken-2" dark round @click="c.notasEx.splice(index,1)">
                        Remover
                        <v-icon dark right>clear</v-icon>
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
const nanoid = require('nanoid')

export default {
    props: ["c"],

    methods: {
        insereNovaNota: function(notas, tipo){
            var n = {id: tipo + '_' + nanoid(), conteudo: ''};
            notas.push(n);
        }
    }
}
</script>
<style>

.info-label {
    color: #00695C;
    padding: 5px; 
    font-weight: 400;
    width: 100%;
    background-color: #E0F2F1;
    font-weight: bold;
}

.info-content {
    padding: 5px; 
    width: 100%;
    border: 1px solid #1A237E ;
}

.is-collapsed li:nth-child(n+5) {
    display: none;
}
</style>