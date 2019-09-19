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

          <template v-slot:item="props">
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
          <div v-if="!selectedUser.name">
          <p>Selecione o utilizador a quem deve ser atribuída a análise do pedido 
            (basta clicar na linha correspondente):</p>

          <v-data-table
            :headers="usersHeaders"
            :items="usersRecords"
            class="elevation-1"
            hide-default-footer
          >
            <template v-slot:item="props">
              <tr @click="selectedUser=props.item">
                <td class="subheading">{{ props.item.name }}</td>
                <td class="subheading">{{ props.item.entidade }}</td>
              </tr>
            </template>
          </v-data-table>
          </div>

          <div v-else>
            <p>Tarefa atribuída a: <b>{{ selectedUser.name }} ({{ selectedUser.entidade }})</b>.</p>
            <div class="info-label">Despacho</div>
            <v-textarea
              v-model="despacho"
              auto-grow
              solo
              label="Introduza o texto para o despacho (opcional)..."
              rows="1"
            ></v-textarea>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="indigo darken-4"
            round dark
            @click="guardarDistribuicao"
          >
            Guardar
          </v-btn>

          <v-btn
            color="red darken-4"
            round dark
            @click="cancelarDistribuicao"
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
    pedidoParaDistribuir: {},
    distribuir: false,
    despacho: "",
    usersHeaders: [
      {text: "Nome", value: "name", class:"title"},
      {text: "Entidade", value: "entidade", class:"title"}
    ],
    usersRecords: [],
    selectedUser: {},
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
        sortable: true,
        value: "estado",
        class: "title"
      },
      { text: "Código", value: "codigo", sortable: false, class: "title" },
      {
        text: "Responsável",
        value: "responsavel",
        sortable: true,
        class: "title"
      },
      { text: "Tipo", value: "tipo", sortable: true, class: "title" },
      { text: "Objeto", value: "objeto", sortable: false, class: "title" },
      { text: "Tarefa", sortable: true, class: "title" }
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
        this.pedidoParaDistribuir = pedido
        var response = await axios.get(lhost + "/api/users");
        this.usersRecords = response.data;
        this.distribuir = true
      } catch (e) {
        return e;
      }
    },

    cancelarDistribuicao: function(){
      this.distribuir = false
      this.selectedUser = {}
      this.despacho = ""
    },

    guardarDistribuicao: async function(){
      try{
        var novaDistribuicao = {
          estado: 'Distribuído',
          responsavel: this.selectedUser.email,
          data: new Date(),
          despacho: this.despacho
        }
        this.pedidoParaDistribuir.estado = "Distribuído"
        this.pedidoParaDistribuir.user = {token: this.$store.state.token}
        var response = await axios.put(lhost + '/api/pedidos', { pedido: this.pedidoParaDistribuir, distribuicao: novaDistribuicao})
        
        this.distribuir = false
        this.selectedUser = {}
        this.despacho = ""

        return this.pedidoParaDistribuir
      }
      catch(e){
        return e
      }
    }
  }
};
</script>

<style>
.info-label {
  color: #00695c;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e0f2f1;
  font-weight: bold;
}

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
