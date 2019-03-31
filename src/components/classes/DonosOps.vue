<template>
    <v-data-table
            :headers="headers"
            :items="entidades"
            class="elevation-1"
            hide-actions
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
                    <td>{{ props.item.sigla }}</td>
                    <td> {{ props.item.designacao }} </td>
                    <td> {{ props.item.tipo }} </td>
                    <td>
                        <v-btn small color="red darken-2" dark round @click="unselectEntidade(props.item)">
                            <v-icon dark>remove_circle</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
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
        },
        unselectEntidade: function(entidade){
            this.$emit('unselectEntidade', entidade)
        }
    }
}
</script>
