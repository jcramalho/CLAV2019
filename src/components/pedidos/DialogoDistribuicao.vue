<template>
  <v-container fluid>
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
  </v-container>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  props: ['distribuirFlag', 'pedido'],
  data: () => ({
    distribuir: distribuirFlag,
    pedidoParaDistribuir: pedido,
    despacho: "",
    usersHeaders: [
      {text: "Nome", value: "name", class:"title"},
      {text: "Entidade", value: "entidade", class:"title"}
    ],
    usersRecords: [],
    selectedUser: {}
  }),
  
  methods: {

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
