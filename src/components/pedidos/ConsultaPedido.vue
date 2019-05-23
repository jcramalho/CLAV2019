<template>
  <v-container>
    <v-layout row wrap justify-center>
      <v-flex xs12 sm10>
        <v-card v-if="pedidoLoaded">
          <v-toolbar color="blue" dark>
            <v-toolbar-title
              >Consulta do pedido: {{ this.pedido.codigo }}</v-toolbar-title
            >
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-container>
                <v-layout row wrap>
                  <v-flex xs12 sm10>
                    <v-text-field
                      :value="
                        this.pedido.objeto.acao +
                          ' de ' +
                          this.pedido.objeto.tipo
                      "
                      label="Tipo de Pedido"
                      readonly
                    ></v-text-field>
                    <v-text-field
                      :value="this.pedido.data.split('T')[0]"
                      label="Data"
                      readonly
                    ></v-text-field>
                    <v-text-field
                      :value="this.pedido.estado"
                      label="Estado"
                      readonly
                    ></v-text-field>
                    <v-text-field
                      :value="this.pedido.criadoPor"
                      label="Autor"
                      readonly
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm10>
                    <v-data-table
                      :headers="headers"
                      :items="etapas"
                      class="elevation-1"
                    >
                      <template v-slot:items="props">
                        <td>{{ props.item.estado }}</td>
                        <td>{{ props.item.data.split("T")[0] }}</td>
                        <td>{{ props.item.responsavel }}</td>
                        <td>{{ props.item.despacho }}</td>
                      </template>

                      <template v-slot:no-data>
                        <v-alert :value="true" color="error" icon="warning">
                          Sem informação disponível.
                        </v-alert>
                      </template>
                    </v-data-table>
                  </v-flex>

                  <v-flex xs12 sm10>
                    <pre>{{ this.pedido }}</pre>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>

        <p v-else>Loading...</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  props: ["idp"],
  data: () => ({
    pedido: {},
    pedidoLoaded: false,
    headers: [
      { text: "Estado", align: "left", sortable: false, value: "estado" },
      { text: "Data", value: "data" },
      { text: "Responsável", value: "responsavel" },
      { text: "Despacho", value: "despacho" },
      { text: "Objeto", value: "objeto" }
    ],
    etapas: []
  }),
  watch: {
    pedidoLoaded: function() {
      this.etapas = this.pedido.distribuicao;
    }
  },
  mounted: function() {
    axios
      .get(lhost + "/api/pedidos/" + this.idp)
      .then(response => {
        this.pedido = response.data;
        this.pedidoLoaded = true;
      })
      .catch(error => {
        return error;
      });
  }
};
</script>

<style></style>
