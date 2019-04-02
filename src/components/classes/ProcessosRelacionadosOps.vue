<template>
    <v-layout row wrap color="teal lighten-5">
        <v-flex xs2>
            <v-subheader>Processos Relacionados:</v-subheader>
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
                        <th style="color: green;"> Desselecionar </th>
                    </tr>
                </template>

                <template v-slot:items="props">
                    <tr>
                        <td>{{ props.item.idRel }}</td>
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

export default {
    props: ["processos"],

    data: function() {
      return {
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
