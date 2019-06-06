<template>
  <v-container fluid>
    <v-layout row wrap ma-2>
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="pedidos"
          class="elevation-1"
          rows-per-page-text="Pedidos por página"
        >
          <template v-slot:no-data>
            <v-alert :value="true" color="error" icon="warning">
              Não foi possível apresentar uma lista dos pedidos...
            </v-alert>
          </template>

          <template slot="headerCell" slot-scope="props">
            <span style="color: blue;">
              {{ props.header.text }}
            </span>
          </template>

          <template v-slot:items="props">
            <tr>
              <td class="subheading">{{ props.item.data.split("T")[0] }}</td>
              <td class="subheading">{{ props.item.estado }}</td>
              <td class="subheading">{{ props.item.codigo }}</td>
              <td class="subheading">{{ props.item.criadoPor }}</td>
              <td class="subheading">
                {{ props.item.objeto.acao }} - {{ props.item.objeto.tipo }}
              </td>
              <td class="subheading">
                <v-btn color="blue" dark round @click="showPedido(props.item)">
                  {{ props.item.objeto.codigo }}
                </v-btn>
              </td>
              <td>
                <v-btn
                  v-if="props.item.estado == 'Submetido'"
                  color="blue"
                  dark
                  round
                  @click="distribuirPedido(props.item)"
                >
                  Distribuir
                </v-btn>
              </td>
            </tr>
          </template>

          <template v-slot:pageText="props">
            Pedidos {{ props.pageStart }} - {{ props.pageStop }} de
            {{ props.itemsLength }}
          </template>
        </v-data-table>
      </v-flex>

      <v-dialog v-model="distribuir" width="60%" >
      <v-card>
        <v-card-title class="headline">Distribuição do pedido</v-card-title>

        <v-card-text>
          Selecione o utilizador a quem deve ser atribuída a análise do pedido (basta clicar na linha correspondente):

          <v-data-table
            :headers="usersHeaders"
            :items="usersRecords"
            class="elevation-1"
            hide-actions
          >
            <template v-slot:items="props">
              <tr>
                <td class="subheading">{{ props.item.name }}</td>
                <td class="subheading">{{ props.item.entidade }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="red darken-4"
            flat="flat"
            @click="distribuir = false"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    distribuir: false,
    usersHeaders: [
      {text: "Nome", value: "name", class:"title"},
      {text: "Entidade", value: "entidade", class:"title"}
    ],
    usersRecords: [],
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
      { text: "Objeto", value: "objeto", sortable: false, class: "title" },
      { text: "Tarefa", sortable: false, class: "title" }
    ],
    pedidos: []
  }),
  created: async function() {
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
    },

    showPedido: function(item) {
      this.$emit("pedidoSelected", item);
    },

    distribuirPedido: async function(pedido){
      try {
        var response = await axios.get(lhost + "/api/users");
        this.usersRecords = response.data;
        this.distribuir = true
      } catch (e) {
        return e;
      }
    }
  }
};
</script>

<style></style>
