<template>
  <v-container>
    <v-data-table :headers="headers" :items="pedidos" class="elevation-1">
      <template v-slot:no-data>
        <v-alert :value="true" color="error" icon="warning">
          Não foi possível apresentar uma lista dos pedidos...
        </v-alert>
      </template>

      <template v-slot:items="props">
        <tr @click="rowClicked(props.item)">
          <td class="subheading">{{ props.item.data.split('T')[0] }}</td>
          <td class="subheading">{{ props.item.estado }}</td>
          <td class="subheading">{{ props.item.codigo }}</td>
          <td class="subheading">{{ props.item.criadoPor }}</td>
          <td class="subheading">
            {{ props.item.objeto.acao }} - {{ props.item.objeto.tipo }}
          </td>
          <td class="subheading">{{ props.item.objeto.codigo }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    headers: [
      {
        text: "Data",
        align: "left",
        sortable: true,
        value: "data",
        class: "title"
      },
      {
        text: "Estado",
        align: "left",
        sortable: false,
        value: "estado",
        class: "title"
      },
      { text: "Código", value: "codigo", sortable: false, class: "title" },
      {
        text: "Responsável",
        value: "responsavel",
        sortable: false,
        class: "title"
      },
      { text: "Tipo", value: "tipo", sortable: false, class: "title" },
      { text: "Objeto", value: "objeto", sortable: false, class: "title" }
    ],
    pedidos: []
  }),
  mounted: async function() {
    try {
      var response = await axios.get(lhost + "/api/pedidos");
      this.pedidos = response.data;
    } catch (e) {
      return e;
    }
  },
  methods: {
    rowClicked: function(item) {
      this.$emit("pedidoSelected", item);
    }
  }
};
</script>

<style></style>
