<template>
    <v-layout wrap ma-2>
    <!-- LEGISLAÇÂO -->
        <v-flex xs2>
            <div class="info-label">Legislação</div>
        </v-flex>
        <v-flex xs10>
            <div class="info-content">
                <v-data-table
                    :headers="headers"
                    :items="legs"
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
                            <td><a :href="'/legislacao/' + props.item.idLeg">{{ props.item.tipo }}</a></td>
                            <td><a :href="'/legislacao/' + props.item.idLeg"> {{ props.item.numero }} </a></td>
                            <td><a :href="'/legislacao/' + props.item.idLeg"> {{ props.item.sumario }} </a></td>
                        </tr>
                    </template>
                </v-data-table>
            </div>
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
            { text: 'Sumário', value: 'sumario' }
          ]
      }
    },

    methods: {
        go: function(idClasse){
            this.$router.push('/entidades/'+idClasse);
            this.$router.go();
        }
    }
}
</script>

<style>
a:link {
  color: #1A237E;
  background-color: transparent;
}

a:hover {
  color: white ;
  background-color: #1A237E ;
}

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