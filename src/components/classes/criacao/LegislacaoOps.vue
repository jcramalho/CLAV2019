<template>
    <v-layout row wrap color="teal lighten-5" ma-2>
        <v-flex xs2>
            <div class="info-label">Legislação: diplomas jurídico-normativos</div>
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