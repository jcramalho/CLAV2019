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
                    <PedidosLista :pedidos="pedidosSubmetidos" 
                                  titulo="Pedidos novos" 
                                  @distribuir="distribuiPedido($event)"
                                  @show="showPedido($event)"
                    />               
                </v-expansion-panel>

                <v-expansion-panel popout>
                    <PedidosLista :pedidos="pedidosDistribuidos" 
                                  titulo="Pedidos em apreciação técnica"
                                  @analisar="analisaPedido($event)"
                                  @show="showPedido($event)"/>
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

    <v-layout row wrap ma-2>
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
            hide-actions
          >
            <template v-slot:items="props">
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

    <!-- Show do pedido ................................................-->
    <v-layout row wrap ma-2>
      <v-dialog v-model="show" width="80%" >
      <v-card>
        <v-card-title class="headline">Dados do pedido</v-card-title>
        <v-card-text>
          <v-layout row wrap ma-2>
            <v-flex xs2>
              <div class="info-label">Código</div>
            </v-flex>
            <v-flex xs10>
              <div class="info-content">{{pedido.codigo}}</div>
            </v-flex>
          </v-layout>
          <v-layout row wrap ma-2>
            <v-flex xs2>
              <div class="info-label">Estado</div>
            </v-flex>
            <v-flex xs10>
              <div class="info-content">{{pedido.estado}}</div>
            </v-flex>
          </v-layout>
          <v-layout row wrap ma-2>
            <v-flex xs2>
              <div class="info-label">Data</div>
            </v-flex>
            <v-flex xs10>
              <div class="info-content">{{pedido.data}}</div>
            </v-flex>
          </v-layout>
          <v-layout row wrap ma-2>
            <v-flex xs2>
              <div class="info-label">Criado Por</div>
            </v-flex>
            <v-flex xs10>
              <div class="info-content">{{pedido.criadoPor}}</div>
            </v-flex>
          </v-layout>
          <div class="info-label title">Distribuição</div>
          <v-data-table
            :headers="distHeaders"
            :items="pedido.distribuicao"
            class="elevation-1"
            hide-actions
          >
            <template v-slot:items="props">
              <tr>
                <td class="subheading">{{ props.item.estado }}</td>
                <td class="subheading">{{ props.item.data }}</td>
                <td class="subheading">{{ props.item.responsavel }}</td>
                <td class="subheading">{{ props.item.despacho }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="red darken-4"
            round dark
            @click="closePedido"
          >
            Fechar
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

import PedidosLista from "@/components/pedidos/PedidosLista.vue"

export default {
  components: { PedidosLista },
  data: () => ({
    pedidoParaDistribuir: {},
    distribuir: false,
    show: false,
    pedido: {},
    distHeaders: [
      {text: "Estado", value: "estado", class:"title"},
      {text: "Data", value: "data", class:"title"},
      {text: "Responsável", value: "responsavel", class:"title"},
      {text: "Despacho", value: "despacho", class:"title"}
    ],
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
      this.pedido = item
      this.show = true
    },

    closePedido: function(item) {
      this.show = false
    },

    distribuiPedido: async function(pedido){
      try {
        var response = await axios.get(lhost + "/api/users");
        this.usersRecords = response.data;
        this.pedidoParaDistribuir = pedido
        this.distribuir = true
      } catch (e) {
        return e;
      }
    },

    analisaPedido: function(pedido){
      this.$router.push("/pedidos/analisar/"+pedido.codigo);
    },

    cancelarDistribuicao: function(){
      this.distribuir = false
      this.selectedUser = {}
      this.despacho = ""
    },

    guardarDistribuicao: async function(){
        var novaDistribuicao = {
          estado: 'Distribuído',
          responsavel: this.selectedUser.email,
          data: new Date(),
          despacho: this.despacho
        }
        this.pedidoParaDistribuir.estado = "Distribuído"
        this.pedidoParaDistribuir.token = this.$store.state.token

        axios.put(lhost + '/api/pedidos', 
            { pedido: this.pedidoParaDistribuir, distribuicao: novaDistribuicao})
            .then(response => {
              var index = this.pedidosSubmetidos.findIndex( p => p.codigo == this.pedidoParaDistribuir.codigo )
              if(index != -1){
                this.pedidosSubmetidos.splice(index,1)
              }
              this.pedidosDistribuidos.push(this.pedidoParaDistribuir)

              this.distribuir = false
              this.selectedUser = {}
              this.despacho = ""

              return response.data
            })
            .catch(e => {return e})
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
