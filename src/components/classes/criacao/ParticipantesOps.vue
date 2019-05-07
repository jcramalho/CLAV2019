<template>
    <v-layout row wrap color="teal lighten-5" ma-2>
        <v-flex xs2>
            <div class="info-label">Participantes no processo e respetivas intervenções</div>
        </v-flex>
        <v-flex xs9 v-if="entidades.length > 0">
            <v-data-table
                :headers="headers"
                :items="entidades"
                class="elevation-1"
                hide-actions
            >
                <template v-slot:headers="props">
                    <tr>
                        <th v-for="h in props.headers" :key="h.text" class="body-2 font-weight-bold">
                            {{ h.text }}
                        </th>
                        <th style="color: green;"> Desselecionar </th>
                    </tr>
                </template>

                <template v-slot:items="props">
                    <tr>
                        <td>{{ props.item.intervencao }}</td>
                        <td>{{ props.item.sigla }}</td>
                        <td> {{ props.item.designacao }} </td>
                        <td> {{ props.item.tipo }} </td>
                        <td>
                            <v-btn small color="red darken-2" dark round @click="unselectParticipante(props.item)">
                                <v-icon dark>remove_circle</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>    
        </v-flex>
        <v-flex xs9 v-else>
            <v-alert :value="true" type="warning">
                Não tem participantes selecionados...
            </v-alert>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    props: ["entidades"],

    data: function() {
      return {
          headers: [
            { text: 'Tipo de Intervenção', align: 'left', sortable: false, value: 'intervencao'},
            { text: 'Sigla', align: 'left', value: 'sigla'},
            { text: 'Designação', value: 'designacao' },
            { text: 'Tipo', value: 'tipo' }
          ]
      }
    },

    methods: {
        go: function(idClasse){
            this.$router.push('/entidades/'+idClasse);
            this.$router.go();
        },
        unselectParticipante: function(entidade){
            this.$emit('unselectParticipante', entidade)
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