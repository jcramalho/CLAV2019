<template>
    <v-layout wrap ma-2>
    <!-- PARTICIPANTES NO PROCESSO -->
        <v-flex xs2>
            <div class="info-label">Participantes no processo</div>
        </v-flex>
        <v-flex xs10>
            <div class="info-content">
                <v-data-table
                    :headers="headers"
                    :items="myParticipantes"
                    class="elevation-1"
                    hide-actions
                >
                    <template v-slot:headers="props">
                        <tr>
                            <th v-for="h in props.headers" :key="h.text" class="table-header body-2 font-weight-bold">
                                {{ h.text }}
                            </th>
                        </tr>
                    </template>

                    <template v-slot:items="props">
                        <tr>
                            <td style="color: #1A237E;">{{ props.item.label }}</td>
                            <td>
                                <ul>
                                    <li v-for="p in props.item.participantes" :key="p.label">
                                        <a v-if="p.idTipo == 'Entidade'" :href="'/entidades/' + p.idParticipante">
                                            {{ p.sigla }} 
                                            ({{ p.idTipo }}) - {{ p.designacao }} 
                                        </a>
                                        <a v-else :href="'/tipologias/' + p.idParticipante">
                                            {{ p.sigla }} 
                                            ({{ p.idTipo }}) - {{ p.designacao }} 
                                        </a>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    props: ["entidades"],

    data: function() {
      return {
          headers: [
            { text: 'Tipo de Intervenção', align: 'left', sortable: false, value: 'label'},
            { text: 'Participantes', value: 'participantes' }
          ],
          participPorTipo: {
            Apreciador: [],
            Assessor: [],
            Comunicador: [],
            Decisor: [],
            Executor: [],
            Iniciador: []
        },
        myParticipantes: []
      }
    },

    methods: {
        go: function(idClasse){
            this.$router.push('/entidades/'+idClasse);
            this.$router.go();
        }
    },

    mounted: function () {
        var tipo;
        for(var i=0; i < this.entidades.length; i++){
            tipo = this.entidades[i].participLabel;
            this.participPorTipo[tipo].push(this.entidades[i])
        }
        for(var j=0; j < Object.keys(this.participPorTipo).length; j++){
            tipo = Object.keys(this.participPorTipo)[j]
            if(this.participPorTipo[tipo].length > 0){
                this.myParticipantes.push({label: tipo, participantes: this.participPorTipo[tipo]})
            }
        }
    }
}
</script>

<style>
.info-label {
    color: #1A237E;
    padding: 5px; 
    font-weight: 400;
    width: 100%;
    background-color: #dee2f8;
    font-weight: bold;
}

.info-content {
    padding: 5px; 
    width: 100%;
    border: 1px solid #1A237E ;
}

.table-header {
    color: #1A237E;
    font-weight: 400;
    background-color: #dee2f8;
    font-weight: bold;
}
</style>