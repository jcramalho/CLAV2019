<template>
  <v-container fluid>
    <v-layout row wrap ma-2>
      <v-flex xs12>
        <v-card>
          <v-toolbar color="indigo darken-4" dark>
            <v-toolbar-title>Gestão de Pedidos</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container fluid>
                <v-expansion-panel popout>
                    <PedidosLista :pedidos="pedidosSubmetidos" titulo="Pedidos novos" />
                </v-expansion-panel>

                <DialogoDistribuicao :distribuirFlag="distribuir"/>

                <v-expansion-panel popout>
                    <PedidosLista :pedidos="pedidosDistribuidos" titulo="Pedidos em apreciação técnica"/>
                </v-expansion-panel>

                <v-expansion-panel popout>
                    <PedidosLista :pedidos="pedidosValidados" titulo="Pedidos em validação"/>
                </v-expansion-panel>

                <v-expansion-panel popout>
                    <PedidosLista :pedidos="pedidosDevolvidos" titulo="Pedidos devolvidos"/>
                </v-expansion-panel>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

import PedidosLista from "@/components/pedidos/PedidosLista.vue"
import DialogoDistribuicao from "@/components/pedidos/DialogoDistribuicao.vue"

export default {
  components: { PedidosLista, DialogoDistribuicao },
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
    pedidos: [], 
    pedidosSubmetidos: [],
    pedidosDistribuidos: [],
    pedidosValidados: [],
    pedidosDevolvidos: []
  }),
  created: async function() {
    try {
      var response = await axios.get(lhost + "/api/pedidos");
      this.pedidos = response.data;
      this.pedidosSubmetidos = this.pedidos.filter(p => p.estado == 'Submetido')
      this.pedidosDistribuidos = this.pedidos.filter(p => p.estado == 'Distribuído')
      this.pedidosValidados = this.pedidos.filter(p => p.estado == 'Validado')
      this.pedidosDevolvidos = this.pedidos.filter(p => p.estado == 'Devolvido')
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
