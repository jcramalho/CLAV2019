<template>
  <v-card class="mt-5">
    <v-card-title style="outline: none;" class="pa-0 ma-0">
            <v-row class="separador ma-0 ml-0">
              <v-col cols=6 align="left">
                <v-icon color="white"> {{pendentesicon}} </v-icon> Lista de Trabalhos Pendentes
              </v-col>
            </v-row>
    </v-card-title>
      <v-card class="ma-0 pa-5">
        <div class="info-content">
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="pendentes"
              class="content-table"
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
                      @show="showPendente(props.item)"
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
        </div>
      </v-card>

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
import { mdiPauseOctagonOutline } from '@mdi/js';
export default {
  components: {
    PainelOperacoesPendentes
  },

  data: () => ({
    pendentesicon: mdiPauseOctagonOutline,
    headers: [
      {
        text: "Criado em",
        sortable: true,
        value: "dataCriacao",
      },
      {
        text: "Atualizado em",
        sortable: true,
        value: "dataAtualizacao",
      },
      {
        text: "Nº interv.",
        sortable: false,
        value: "numInterv",
      },
      {
        text: "Criado por",
        value: "criadoPor",
        sortable: false,
      },
      {
        text: "Tipo de operação",
        value: "acao",
        sortable: false,
      },
      {
        text: "Tipo de objeto",
        value: "tipo",
        sortable: false,
      },
      { text: "Ações" }
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

    showPendente: function(pendente) {
      this.$router.push("/pendentes/" + pendente._id);
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
<style scoped>
.content-table {
    background-color: #f1f6f8 !important;
    border-radius: 10px;
}

.info-content {
    background-color: #f1f6f8 !important;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
}

.separador {
    color: white;
    padding: 5px;
    margin: 5px;
    font-weight: 400;
    width: 100%;
    min-height: 50px;
    background: linear-gradient(to right, #19237e 0%, #0056b6 100%) !important;
    font-size: 14pt;
    font-weight: bold;
    border-radius: 10px 10px 0 0;
}
</style>
