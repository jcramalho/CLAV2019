<template>
    <!-- BLOCO DESCRITIVO -->
    <v-expansion-panel-content>
        <template v-slot:header>
            <v-toolbar color="teal darken-4 body-2 font-weight-bold" dark>
                <v-toolbar-title>Descritivo da Classe</v-toolbar-title>
            </v-toolbar>
        </template>
        <v-layout wrap>
            <!-- DESCRIÇÂO -->
            <v-flex xs2>
                <v-subheader >Descrição</v-subheader>
            </v-flex>
            <v-flex xs9>
                <v-text-field
                    v-model="c.descricao"
                    label="Descrição"
                    solo clearable
                ></v-text-field>
            </v-flex>
        </v-layout>

        <hr/>
        <BlocoDescritivoNotasAp :c="c"/>
        <hr/>
        <BlocoDescritivoExemplosNotasAp :c="c"/>
        <hr/>
        <BlocoDescritivoNotasEx :c="c"/>
        <hr/>
        <TermosIndiceOps :c="c" v-if="(c.nivel == 3) && (!c.temSubclasses4Nivel)"/>

    </v-expansion-panel-content>
</template>

<script>
const nanoid = require('nanoid')

import BlocoDescritivoNotasAp from '@/components/classes/BlocoDescritivoNotasAp.vue'
import BlocoDescritivoExemplosNotasAp from '@/components/classes/BlocoDescritivoExemplosNotasAp.vue'
import BlocoDescritivoNotasEx from '@/components/classes/BlocoDescritivoNotasEx.vue'
import TermosIndiceOps from '@/components/classes/TermosIndiceOps.vue'

export default {
    props: ["c"],

    components: {
        BlocoDescritivoNotasAp, BlocoDescritivoExemplosNotasAp, BlocoDescritivoNotasEx,
        TermosIndiceOps
    }
}
</script>

