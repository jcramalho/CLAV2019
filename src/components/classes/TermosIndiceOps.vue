<template>
    <v-layout wrap row>
    <!-- TERMOS DE ÍNDICE -->
        <v-flex xs2>
            <v-subheader>Termos de Índice</v-subheader>
            <v-btn color="green darken-2" dark round @click="insereNovoTI(c.termosInd)">
                Novo termo
                <v-icon dark right>add_circle_outline</v-icon>
            </v-btn>
        </v-flex>
        <v-flex>
            <v-layout fluid row v-for="(ti, index) in c.termosInd" :key="index">
                <v-flex xs9>
                    <v-textarea
                        v-model="ti.termo"
                        auto-grow
                        solo
                        label="Termo de Índice"
                        rows="1"
                    ></v-textarea>
                </v-flex>
                <v-flex>
                    <v-btn color="red darken-2" dark round @click="c.termosInd.splice(index,1)">
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
        insereNovoTI: function(termos){
            var n = {id: 'ti_' + nanoid(), termo: '', existe: false};
            termos.push(n);
        }
    }
}
</script>
