<template>
    <v-layout wrap row>
        <!-- Notas de Aplicação -->
        <v-flex xs2>
            <v-subheader>Notas de Aplicação</v-subheader>
            <v-tooltip top color="info">
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" color="green darken-2" dark round @click="insereNovaNota(c.notasAp, 'na')">
                        Nota aplicação
                        <v-icon dark right>add_circle_outline</v-icon>
                    </v-btn>
                </template>
                <span>Nota de aplicação</span>
            </v-tooltip>
        </v-flex>
        <v-flex>
            <v-layout fluid row v-for="(nota, index) in c.notasAp" :key="index">
                <v-flex xs9>
                    <v-textarea
                        v-model="nota.nota"
                        auto-grow
                        solo
                        label="Nota de Aplicação:"
                        rows="1"
                    ></v-textarea>
                </v-flex>
                <v-flex>
                    <v-btn color="red darken-2" dark round @click="c.notasAp.splice(index,1)">
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
