<template>
    <v-layout row wrap color="teal lighten-5">
        <v-flex xs2>
            <v-subheader>Legislação: diplomas jurídico-normativos</v-subheader>
        </v-flex>
        <v-flex xs9 v-if="legs.length > 0">
            <v-data-table
                :headers="headers"
                :items="legs"
                class="elevation-1"
                hide-actions
                rows-per-page-text="Linhas por página"
            >
                <template v-slot:headers="props">
                    <tr>
                        <th v-for="h in props.headers" :key="h.text" class="body-2 font-weight-bold" style="color: green;">
                            {{ h.text }}
                        </th>
                        <th style="color: green;"> Desselecionar </th>
                    </tr>
                </template>

                <template v-slot:items="props">
                    <tr>
                        <td>{{ props.item.tipo }}</td>
                        <td> {{ props.item.numero }} </td>
                        <td> {{ props.item.sumario }} </td>
                        <td> {{ props.item.data }} </td>
                        <td>
                            <v-btn small color="red darken-2" dark round @click="unselectDiploma(props.item)">
                                <v-icon dark>remove_circle</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </template>

                <template v-slot:pageText="props">
                    Diplomas {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                </template>
            </v-data-table>        
        </v-flex>
        <v-flex xs9 v-else>
            <v-alert :value="true" type="warning">
                Não tem legislação selecionada...
            </v-alert>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    props: ["legs"],

     data: function() {
      return {
          headers: [
            { text: 'Tipo', align: 'left', value: 'tipo'},
            { text: 'Número', value: 'numero' },
            { text: 'Sumário', value: 'sumario' },
            { text: 'Data', value: 'data' }
          ]
      }
    },

    methods: {
        unselectDiploma: function(diploma){
            this.$emit('unselectDiploma', diploma)
        }
    }
}
</script>
