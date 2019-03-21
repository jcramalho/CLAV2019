<template>
    <div>
        <div class="subheading font-weight-medium">Participantes</div>
        <v-data-table
            :headers="headers"
            :items="myParticipantes"
            class="elevation-1"
            hide-actions
        >
            <template v-slot:headers="props">
                <tr>
                    <th v-for="h in props.headers" :key="h.text" class="body-2 font-weight-bold">
                        {{ h.text }}
                    </th>
                </tr>
            </template>

            <template v-slot:items="props">
                <tr>
                <td>{{ props.item.label }}</td>
                <td>
                    <ul>
                        <li v-for="p in props.item.participantes" :key="p.label">
                            <a @click="go(p.idParticipante)"> {{ p.sigla }} </a>
                                ({{ p.idTipo }}) - {{ p.designacao }} 
                        </li>
                    </ul>
                </td>
                </tr>
            </template>
            
        </v-data-table>
    </div>
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
