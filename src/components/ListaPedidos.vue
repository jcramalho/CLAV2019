<template>
    <v-container>
      <v-data-table
        :headers="headers"
        :items="pedidos"
        class="elevation-1"
      >
        <template v-slot:no-data>
          <v-alert :value="true" color="error" icon="warning">
            Não foi possível apresentar uma lista dos pedidos...
          </v-alert>
        </template>

        <template v-slot:items="props">
          <tr @click="rowClicked(props.item)">
              <td class="subheading">{{ props.item.estado }}</td>
              <td class="subheading">{{ props.item.codigo }}</td>
              <td class="subheading">{{ props.item.criadoPor }}</td>
              <td class="subheading">{{ props.item.objeto.acao }} - {{ props.item.objeto.tipo }}</td>
              <td class="subheading">{{ props.item.objeto.codigo }} </td>
          </tr>
        </template>
      </v-data-table>  
    </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    data: () => ({
      headers: [
          { text: 'Estado', align: 'left', sortable: false, value: 'estado', class: 'title'},
          { text: 'Código', value: 'codigo', sortable: false, class: 'title'},
          { text: 'Responsável', value: 'responsavel', sortable: false, class: 'title'},
          { text: 'Tipo', value: 'tipo', sortable: false, class: 'title'},
          { text: 'Objeto', value: 'objeto', sortable: false, class: 'title'}
        ],
      pedidos: []
    }),
    mounted: function (){
        axios
            .get('http://localhost:7778/api/pedidos')
            .then(response => {
                this.pedidos = response.data;
            })
            .catch(error => { return(error)})
    },
    methods: {
        rowClicked: function (item){
            this.$emit('pedidoSelected', item)
        }
    }
  }
</script>

<style>

</style>
