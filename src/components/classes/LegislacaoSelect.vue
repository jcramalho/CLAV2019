<template>
    <v-layout row wrap>
        <v-flex xs2>
            <v-subheader>Selecione os diplomas:</v-subheader>
        </v-flex>
        <v-flex xs9 v-if="legislacaoReady">
            <v-card>
                <v-card-title>
                    <v-text-field v-model="searchDiplomas"
                        append-icon="search"
                        label="Procura filtra os diplomas"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="legs"
                    :search="searchDiplomas"
                    item-key="id"
                    class="elevation-1"
                    rows-per-page-text="Linhas por página"
                >
                    <template v-slot:items="props">
                        <tr @click="selectDiploma(props.item)">
                            <td>{{ props.item.tipo }}</td>
                            <td> {{ props.item.numero }} </td>
                            <td> {{ props.item.sumario }} </td>
                            <td> {{ props.item.data }} </td>
                        </tr>
                    </template>

                    <template v-slot:pageText="props">
                        Diplomas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                    </template>

                    <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                        A procura por "{{ search }}" não deu resultados.
                    </v-alert>
                </v-data-table>
            </v-card>   
        </v-flex>
        <v-flex xs9 v-else>
            <v-subheader>A carregar entidades...</v-subheader>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    props: ["legs", "legislacaoReady"],

     data: function() {
      return {
          searchDiplomas: "",

          headers: [
            { text: 'Tipo', align: 'left', value: 'tipo', sortable: false},
            { text: 'Número', value: 'numero', sortable: false },
            { text: 'Sumário', value: 'sumario', sortable: false },
            { text: 'Data', value: 'data' }
          ]
      }
    },

    methods: {
        selectDiploma: function(diploma){
            this.$emit('selectDiploma', diploma)
        }
    }
}
</script>
