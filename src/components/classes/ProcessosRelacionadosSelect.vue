<template>
    <v-layout row wrap>
        <v-flex xs2>
            <v-subheader>Selecione o(s) processo(s) relacionado(s):</v-subheader>
        </v-flex>
        <v-flex xs9 v-if="procReady">
            <v-card>
                <v-card-title>
                    <v-text-field v-model="searchProcessos"
                        append-icon="search"
                        label="Procura filtra processos"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                    :headers="processosRelacionadosHeaders"
                    :items="processos"
                    :search="searchProcessos"
                    item-key="id"
                    class="elevation-1"
                    :pagination.sync="paginationProcessos"
                >
                    <template v-slot:items="props">
                        <tr>
                            <td>
                                <v-select
                                    item-text="label"
                                    item-value="value"
                                    v-model="props.item.idRel"
                                    :items="tiposRelacao"
                                    label="Selecione o tipo de relação:"
                                    solo small-chips
                                    dense
                                    @change="selectProcesso(props.item.id)"
                                />
                            </td>
                            <td @click="selectProcesso(props.item.id)">{{ props.item.codigo }}</td>
                            <td @click="selectProcesso(props.item.id)"> {{ props.item.titulo }} </td>
                        </tr>
                    </template>

                    <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                        A procura por "{{ search }}" não deu resultados.
                    </v-alert>
                </v-data-table>
            </v-card>
        </v-flex>
        <v-flex xs9 v-else>
            <v-subheader>A carregar entidades e tipologias...</v-subheader>
        </v-flex>
    </v-layout>
</template>

<script>

export default {
    props: ["procReady","processos"],

    data: function() {
      return {
        searchProcessos: "",
        paginationProcessos: { sortBy: 'codigo'},

        processosRelacionadosHeaders: [
            { text: 'Relação', align: 'left', value: 'relacao'},
            { text: 'Processo', align: 'left', value: 'codigo', sortable: true},
            { text: 'Título', value: 'titulo' }
        ],

        tiposRelacao: [
                {label: 'Por selecionar', value: 'Indefinido'},
                {label: 'Antecessor de', value: 'eAntecessorDe'},
                {label: 'Sucessor de', value: 'eSucessorDe'},
                {label: 'Complementar de', value: 'eComplementarDe'},
                {label: 'Cruzado com', value: 'eCruzadoCom'},
                {label: 'Sintese de', value: 'eSinteseDe'},
                {label: 'Sintetizado por', value: 'eSintetizadoPor'},
                {label: 'Suplemento de', value: 'eSuplementoDe'},
                {label: 'Suplemento para', value: 'eSuplementoPara'}
            ],
          
        labels: {
            eAntecessorDe: "É Antecessor de",
            eComplementarDe: "É Complementar de",
            eCruzadoCom: "É Cruzado com",
            eSinteseDe: "É Síntese de",
            eSintetizadoPor: "É Sintetizado por",
            eSucessorDe: "É Sucessor de",
            eSuplementoDe: "É Suplemento de",
            eSuplementoPara: "É Suplemento para"
        }
      }
    },

    methods: {
        go: function(id){
            this.$router.push('/classes/consultar/c'+id);
            this.$router.go();
        },
        selectProcesso: function(id){
            // Comunica ao pai que houve uma seleção
            this.$emit('selectProcesso', id)
        }
    }
}
</script>
