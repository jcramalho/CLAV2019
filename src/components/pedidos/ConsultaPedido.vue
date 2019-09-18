<template>
  <div>
        <v-card v-if="pedidoLoaded" class="ma-8">
          <v-card-title class="pa-2 indigo darken-4 title white--text" dark>Consulta do pedido: {{ this.pedido.codigo }}</v-card-title>
          <v-card-text>
            <v-row class="ma-1">
              <v-col cols="2">
                <div class="info-label">Estado</div>
              </v-col>
              <v-col>
                <div class="info-content">{{pedido.estado}}</div>
              </v-col>
            </v-row>
            <v-row class="ma-1">
              <v-col cols="2">
                <div class="info-label">Data</div>
              </v-col>
              <v-col>
                <div class="info-content">{{pedido.data.split('T')[0]}}</div>
              </v-col>
            </v-row>
            <v-row class="ma-1">
              <v-col cols="2">
                <div class="info-label">Entidade</div>
              </v-col>
              <v-col>
                <div class="info-content">{{pedido.entidade}}</div>
              </v-col>
            </v-row>
            <v-row class="ma-1">
              <v-col cols="2">
                <div class="info-label">Criado Por</div>
              </v-col>
              <v-col>
                <div class="info-content">{{pedido.criadoPor}}</div>
              </v-col>
            </v-row>
            <v-row class="ma-1">
              <v-col cols="2">
                <div class="info-label">Entidade</div>
              </v-col>
              <v-col>
                <div class="info-content">{{pedido.entidade}}</div>
              </v-col>
            </v-row>

            <v-card>
              <v-card-title class="info-label title" dark>Distribuição</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="distHeaders"
                  :items="pedido.distribuicao"
                  class="elevation-1"
                  hide-default-footer
                >
                  <template v-slot:item="props">
                    <tr>
                      <td class="subheading">{{ props.item.estado }}</td>
                      <td class="subheading">{{ props.item.data }}</td>
                      <td class="subheading">{{ props.item.responsavel }}</td>
                      <td class="subheading">{{ props.item.despacho }}</td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>

            <v-card class="mt-4" v-if="pedido.tipo='TS Organizacional'">
              <v-card-title class="info-label title" dark>
                Tabela de Seleção para a entidade {{ pedido.objeto.dados.ts.entidade }}
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="tsHeaders"
                  :items="pedido.objeto.dados.ts.processos"
                  class="elevation-1"
                  :footer-props="tsFooterProps"
                >
                  <template v-slot:no-data>
                    <v-alert :value="true" color="error" icon="warning">
                      Não existem processos para mostrar...
                    </v-alert>
                  </template>

                  <template v-slot:footer.page-text="props">
                    {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                  </template>

                  <template v-slot:item="props">
                    <tr>
                      <td>{{ props.item.codigo }}</td>
                      <td>{{ props.item.titulo }}</td>
                      <td v-if="props.item.dono">X</td>
                      <td v-if="props.item.participante">X</td>
                    </tr>
                  </template>

                  <template v-slot:pageText="props">
                    Processos {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
            
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="indigo darken-4"
              rounded dark
              @click="voltar"
            > Voltar
            </v-btn>
          </v-card-actions>
        </v-card>

        <p v-else>A carregar informação...</p>
  </div>
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
    distHeaders: [
      {text: "Estado", value: "estado", class:"subtitle-1"},
      {text: "Data", value: "data", class:"subtitle-1"},
      {text: "Responsável", value: "responsavel", class:"subtitle-1"},
      {text: "Despacho", value: "despacho", class:"subtitle-1"}
    ],
    tsHeaders: [
      {text: "Código", value: "codigo", class:"subtitle-1"},
      {text: "Título", value: "titulo", class:"subtitle-1"},
      {text: "Dono", value: "dono", class:"subtitle-1"},
      {text: "Participante", value: "participante", class:"subtitle-1"}
    ],
    tsFooterProps: {
        "items-per-page-text": "Processos por página",
        "items-per-page-options": [5, 10, -1],
        "items-per-page-all-text": "Todos"
      },
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
  },

  methods: {
    voltar: function(){
      this.$router.go(-1)
    }
  }
};
</script>

<style></style>
