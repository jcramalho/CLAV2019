<template>
    <v-layout wrap row>
    <!-- Notas de Exclusão -->
        <v-flex xs2>
            <v-subheader>Notas de Exclusão</v-subheader>
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
