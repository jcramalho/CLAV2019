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
        :sort-by="['dataAtualizacao']"
        :sort-desc="[true]"
      >
        <template v-slot:no-data>
          <br />
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
            <td class="subheading">{{ props.item.tipo }}</td>
            <td class="subheading">
              <PainelOperacoesPendentes 
                @continuar="continuarTrabalho(props.item)"
                @apagar="apagarTrabalho(props.item)"
              />
            </td>
          </tr>
        </template>

        <template v-slot:footer.page-text="props">
          {{ props.pageStart }} - {{ props.pageStop }} de
          {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-card-text>

    <v-dialog v-model="pendenteRemovido" width="50%">
        <v-card>
          <v-card-title>Eliminação do trabalho</v-card-title>
          <v-card-text>
            <p>O seu pedido de eliminação foi processado com sucesso.</p>
            <p>Toda a informação associada foi eliminada.</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="indigo darken-4" dark @click="pendenteRemovido = false">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-card>
</template>

<script>
import PainelOperacoesPendentes from "@/components/pendentes/PainelOperacoesPendentes";
export default {
  components: {
    PainelOperacoesPendentes
  },

  data: () => ({
    headers: [
      {
        text: "Criado em",
        sortable: true,
        value: "dataCriacao",
        class: "title indigo lighten-5 indigo--text"
      },
      {
        text: "Atualizado em",
        sortable: true,
        value: "dataAtualizacao",
        class: "title indigo lighten-5 indigo--text"
      },
      {
        text: "Nº interv.",
        sortable: false,
        value: "numInterv",
        class: "title indigo lighten-5 indigo--text"
      },
      {
        text: "Criado por",
        value: "criadoPor",
        sortable: false,
        class: "title indigo lighten-5 indigo--text"
      },
      {
        text: "Tipo de operação",
        value: "acao",
        sortable: false,
        class: "title indigo lighten-5 indigo--text"
      },
      {
        text: "Tipo de objeto",
        value: "tipo",
        sortable: false,
        class: "title indigo lighten-5 indigo--text"
      },
      { text: "Ações", class: "title indigo lighten-5 indigo--text" }
    ],
    procsFooterProps: {
      "items-per-page-text": "Pendentes por página",
      "items-per-page-options": [10, 20, 100, -1],
      "items-per-page-all-text": "Todos"
    },
    pendentes: [],
    pendenteRemovido: false
  }),

  created: async function() {
    try {
      var response = await this.$request("get", "/pendentes");
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
    },
    apagarTrabalho: async function(item) {
      // Apagar da BD e apagar da lista carregada
      try {
        var response = await this.$request("delete", "/pendentes/" + item._id);
        if(response.status == 200){
          this.pendenteRemovido = true;
          var index = this.pendentes.findIndex(p => p._id === item._id);
          this.pendentes.splice(index, 1);
        } 
      } 
      catch (e) {
        return e;
      }
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
