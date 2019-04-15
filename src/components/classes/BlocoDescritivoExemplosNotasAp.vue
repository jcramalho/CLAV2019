<template>
    <v-layout wrap row>
        <!-- Exemplos de notas de Aplicação -->
        <v-flex xs2>
            <v-subheader>Exemplo(s) de Nota(s) de Aplicação:</v-subheader>
            <v-btn color="green darken-2" dark round @click="insereNovaNota(c.exemplosNotasAp, 'exna')">
                Novo exemplo
                <v-icon dark right>add_circle_outline</v-icon>
            </v-btn>
        </v-flex>
        <v-flex>
            <v-layout fluid row v-for="(ex, index) in c.exemplosNotasAp" :key="index">
                <v-flex xs9>
                    <v-textarea
                        v-model="ex.exemplo"
                        auto-grow
                        solo
                        label="Exemplo de Nota de Aplicação"
                        rows="1"
                    ></v-textarea>
                </v-flex>
                <v-flex>
                    <v-btn color="red darken-2" dark round @click="c.exemplosNotasAp.splice(index,1)">
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
