<template>
    <v-layout row wrap color="teal lighten-5" ma-2>
        <v-flex xs2>
            <div class="info-label">Processos Relacionados</div>
        </v-flex>
        <v-flex xs9 v-if="processos.length > 0">
            <v-data-table
                :headers="headers"
                :items="processos"
                class="elevation-1"
                hide-actions
            >
                <template v-slot:headers="props">
                    <tr>
                        <th v-for="h in props.headers" :key="h.text" class="body-2 font-weight-bold">
                            {{ h.text }}
                        </th>
                        <th style="color: green;"> {{ mylabels.remover }} </th>
                    </tr>
                </template>

                <template v-slot:items="props">
                    <tr>
                        <td>{{ props.item.relacao }}</td>
                        <td>{{ props.item.codigo }}</td>
                        <td> {{ props.item.titulo }} </td>
                        <td>
                            <v-btn small color="red darken-2" dark round @click="unselectProcRel(props.item)">
                                <v-icon dark>remove_circle</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>                 
        </v-flex>
        <v-flex xs9 v-else>
            <v-alert :value="true" type="warning">
                Não tem processos relacionados...
            </v-alert>
        </v-flex>
    </v-layout>
</template>

<script>

const labels = require('@/config/labels').classeCriacaoProcessosRelacionadosOps

export default {
    props: ["processos"],

    data: function() {
      return {
        mylabels: labels,
        headers: [
            { text: 'Relação', align: 'left', sortable: true, value: 'idRel'},
            { text: 'Processo', align: 'left', sortable: false, value: 'codigo' },
            { text: 'Título', align: 'left', sortable: false, value: 'titulo'}
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
        unselectProcRel: function(proc){
            this.$emit('unselectProcRel', proc)
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