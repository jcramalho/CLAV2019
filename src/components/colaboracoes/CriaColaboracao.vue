<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="indigo darken-3" dark>
          <v-toolbar-title class="card-heading"
            >Nova Colaboração</v-toolbar-title
          >
        </v-app-bar>

        <!-- Content -->
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Nome</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="indigo"
                counter="150"
                single-line
                v-model="credito.nome"
                maxlength="150"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Filiação</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="indigo"
                counter="150"
                single-line
                v-model="credito.filiacao"
                maxlength="150"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Função</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="indigo"
                counter="150"
                single-line
                v-model="credito.funcao"
                maxlength="150"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Descrição</div>
            </v-col>
            <v-col>
              <v-textarea
                auto-grow
                solo
                clearable
                color="indigo"
                counter="3000"
                v-model="credito.desc"
                maxlength="3000"
              ></v-textarea>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Início</div>
            </v-col>
            <v-col>
              <SelecionarData
                :dataMinima="data_minima"
                :d="credito.data_inicio"
                @dataSelecionada="credito.data_inicio = $event"
                :label="'AAAA-MM-DD'"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Fim</div>
            </v-col>
            <v-col>
              <SelecionarData
                :dataMinima="data_minima"
                :d="credito.data_fim"
                @dataSelecionada="credito.data_fim = $event"
                :label="'AAAA-MM-DD'"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <!-- Painel Operações -->
        <PainelOpsCreditos :t="credito" :acao="'Criação'" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import marked from "marked";
import PainelOpsCreditos from "@/components/colaboracoes/PainelOperacoesColaboracoes.vue";
import SelecionarData from "@/components/generic/SelecionarData.vue";

export default {
  data: nt => ({
    credito: {
      nome: "",
      filiacao: "",
      funcao: "",
      desc: "",
      data_inicio: "",
      data_fim: ""
    },
    snackbar: false,
    text: "",
    data_minima: "2016-01-01"
  }),

  components: {
    PainelOpsCreditos,
    SelecionarData
  },

  methods: {
    // fechar o snackbar em caso de erro
    fecharSnackbar() {
      this.snackbar = false;
    }
  }
};
</script>

<style scoped>
.expansion-panel-heading {
  background-color: #283593 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}

.info-label {
  color: #283593; /* indigo darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8eaf6; /* indigo lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}
</style>
