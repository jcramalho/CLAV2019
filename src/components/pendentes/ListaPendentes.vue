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
            <!--td class="subheading" v-if="props.item.tipo == 'Classe'">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
              <v-btn color="primary" dark v-on="on">Classe</v-btn>
              </template>
              <span
              >{{ props.item.objeto.codigo }}:
              {{ props.item.objeto.titulo }}</span
              >
            </v-tooltip>
            </td-->
            <td class="subheading">{{ props.item.tipo }}</td>
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
          {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    headers: [
      {
        text: "Criado em",
        sortable: true,
        value: "dataCriacao",
        class: "title indigo darken-1 white--text"
      },
      {
        text: "Atualizado em",
        sortable: true,
        value: "dataAtualizacao",
        class: "title indigo darken-1 white--text"
      },
      {
        text: "Nº interv.",
        sortable: false,
        value: "numInterv",
        class: "title indigo darken-1 white--text"
      },
      {
        text: "Criado por",
        value: "criadoPor",
        sortable: false,
        class: "title indigo darken-1 white--text"
      },
      {
        text: "Tipo de operação",
        value: "acao",
        sortable: false,
        class: "title indigo darken-1 white--text"
      },
      {
        text: "Tipo de objeto",
        value: "tipo",
        sortable: false,
        class: "title indigo darken-1 white--text"
      },
      { text: "Ações", class: "title indigo darken-1 white--text" }
    ],
    procsFooterProps: {
      "items-per-page-text": "Pendentes por página",
      "items-per-page-options": [10, 20, 100, -1],
      "items-per-page-all-text": "Todos"
    },
    pendentes: []
  }),
  mounted: async function() {
    try {
      var response = await this.$request("get", "/api/pendentes");
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
<style>
.myPanelHeader {
  color: #304ffe;
}

.info-label {
  color: #1a237e;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #dee2f8;
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
