<template>
    <v-card class="ma-4">
      <v-card-title class="title indigo darken-4 white--text" dark>
        Lista de Trabalhos Pendentes
      </v-card-title>
      <v-card-text>
        <v-data-table 
          :headers="headers" 
          :items="pendentes" 
          class="ma-2 elevation-1"
          :footer-props="procsFooterProps"
        >
          <template v-slot:no-data>
            <v-alert :value="true" color="error" icon="warning">
              Não foi possível apresentar uma lista dos trabalhos guardados...
            </v-alert>
          </template>

          <template v-slot:item="props">
            <tr>
              <td class="subheading">
                {{ props.item.dataCriacao.split("T")[0] }}
              </td>
              <td class="subheading">
                {{ props.item.dataAtualizacao.split("T")[0] }}
              </td>
              <td class="subheading">{{ props.item.numInterv }}</td>
              <td class="subheading">{{ props.item.criadoPor }}</td>
              <td class="subheading">{{ props.item.acao }}</td>
              <td class="subheading" v-if="props.item.tipo == 'Classe'">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on">Classe</v-btn>
                  </template>
                  <span
                    >{{ props.item.objeto.codigo }}:
                    {{ props.item.objeto.titulo }}</span
                  >
                </v-tooltip>
              </td>
              <td class="subheading" v-else>{{ props.item.tipo }}</td>
              <td class="subheading">
                <v-btn
                  rounded
                  color="indigo darken-3"
                  dark
                  @click="continuarTrabalho(props.item)"
                >
                  Continuar trabalho
                </v-btn>
              </td>
            </tr>
          </template>

          <template v-slot:footer.page-text="props">
            {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
</template>

<script>
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    headers: [
      {
        text: "Criado em",
        sortable: true,
        value: "dataCriacao",
        class: "title"
      },
      {
        text: "Atualizado em",
        sortable: true,
        value: "dataAtualizacao",
        class: "title"
      },
      {
        text: "Nº interv.",
        sortable: false,
        value: "numInterv",
        class: "title"
      },
      {
        text: "Criado por",
        value: "criadoPor",
        sortable: false,
        class: "title"
      },
      {
        text: "Tipo de operação",
        value: "acao",
        sortable: false,
        class: "title"
      },
      {
        text: "Tipo de objeto",
        value: "tipo",
        sortable: false,
        class: "title"
      },
      { text: "Ações", class: "title" }
    ],
    procsFooterProps: {
        "items-per-page-text": "Processos por página",
        "items-per-page-options": [10, 20, 100, -1],
        "items-per-page-all-text": "Todos"
    },
    pendentes: []
  }),
  mounted: async function() {
    try {
      var response = await axios.get(lhost + "/api/pendentes");
      this.pendentes = response.data;
    } catch (e) {
      return e;
    }
  },
  methods: {
    rowClicked: function(item) {
      this.$emit("pendenteSelected", item);
    },
    continuarTrabalho: function(item) {
      this.$router.push("/pendentes/continuar/" + item._id);
    }
  }
};
</script>

<style></style>
