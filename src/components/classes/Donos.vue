<template>
    <v-layout wrap ma-2>
    <!-- DONOS DO PROCESSO -->
        <v-flex xs2>
            <div class="info-label">Donos do processo</div>
        </v-flex>
        <v-flex xs10>
            <div class="info-content">
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
                    </tr>
                </template>

                <template v-slot:items="props">
                    <tr>
                        <td>{{ props.item.sigla }}</td>
                        <td> {{ props.item.designacao }} </td>
                        <td> {{ props.item.tipo.split('#')[1] }} </td>
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
</style>