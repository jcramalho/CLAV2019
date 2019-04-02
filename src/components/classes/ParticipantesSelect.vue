<template>
    <v-layout row wrap>
        <v-flex xs2>
            <v-subheader>Selecione o(s) participante(s) no processo:</v-subheader>
        </v-flex>
        <v-flex xs9 v-if="entidadesReady">
            <v-card>
                <v-card-title>
                    <v-text-field v-model="searchEntidades"
                        append-icon="search"
                        label="Procura filtra entidades"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                    :headers="participantesHeaders"
                    :items="entidades"
                    :search="searchEntidades"
                    item-key="id"
                    class="elevation-1"
                    :pagination.sync="paginationParticipantes"
                >
                    <template v-slot:items="props">
                        <tr v-if="!props.item.selected">
                            <td>
                                <v-select
                                    item-text="label"
                                    item-value="value"
                                    v-model="props.item.intervencao"
                                    :items="tiposIntervencao"
                                    label="Selecione o tipo de intervenção:"
                                    solo small-chips
                                    dense
                                    @change="props.item.selected=true; selectParticipante(props.item.id)"
                                />
                            </td>
                            <td @click="selectParticipante(props.item.id)">{{ props.item.sigla }}</td>
                            <td @click="selectParticipante(props.item.id)"> {{ props.item.designacao }} </td>
                            <td @click="selectParticipante(props.item.id)"> {{ props.item.tipo }} </td>
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
    props: ["entidades","entidadesReady"],

    data: function() {
      return {
        searchEntidades: "",
        paginationParticipantes: { sortBy: 'sigla'},

        participantesHeaders: [
            { text: 'Intervenção', align: 'left', value: 'intervencao'},
            { text: 'Sigla', align: 'left', value: 'sigla', sortable: true},
            { text: 'Designação', value: 'designacao' },
            { text: 'Tipo', value: 'tipo' }
        ],

        tiposIntervencao: [
            {label: 'Por selecionar', value: 'Indefinido'},
            {label: 'Apreciar', value: 'Apreciar'},
            {label: 'Assessorar', value: 'Assessorar'},
            {label: 'Comunicar', value: 'Comunicar'},
            {label: 'Decidir', value: 'Decidir'},
            {label: 'Executar', value: 'Executar'},
            {label: 'Iniciar', value: 'Iniciar'}
        ]
      }
    },

    methods: {
        go: function(idClasse){
            this.$router.push('/entidades/'+idClasse);
            this.$router.go();
        },
        selectParticipante: function(id){
            this.$emit('selectParticipante', id);
        }
    }
}
</script>
