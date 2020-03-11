<template>
  <v-row class="ma-1">
    <v-col>
      <!-- HEADER -->
      <v-card v-if="semaforos.classeLoaded">
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title>
            Alteração da Classe: {{ classe.codigo }} - {{ classe.titulo }}
          </v-toolbar-title>
        </v-app-bar>

        <v-card-text>
          <v-expansion-panels>
            <!-- DESCRITIVO DA CLASSE -->
            <BlocoDescritivo :c="classe" />
          </v-expansion-panels>
        </v-card-text>

        <v-snackbar
          v-model="loginErrorSnackbar"
          :timeout="8000"
          color="error"
          :top="true"
        >
          {{ loginErrorMessage }}
          <v-btn text @click="loginErrorSnackbar = false">Fechar</v-btn>
        </v-snackbar>
      </v-card>
      <PainelOperacoes :c="classe" :o="classeCopia" :pendenteId="''" />
    </v-col>
  </v-row>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import BlocoDescritivo from "@/components/classes/criacao/BlocoDescritivo.vue";
import PainelOperacoes from "@/components/classes/edicao/PainelOperacoes.vue";

export default {
  components: {
    BlocoDescritivo,
    PainelOperacoes
  },

  props: ["idc"],

  data: () => ({
    // Objeto que guarda uma classe

    classe: {},
    classeCopia: {},

    // Estruturas auxiliares

    myhelp: help,

    codeFormats: {
      1: /^[0-9]{3}$/,
      2: /^[0-9]{3}\.[0-9]{2}$/
    },

    formatoCodigo: {
      1: "ddd (d - digito)",
      2: "ddd.dd (d - digito)"
    },

    classeNiveis: [
      { label: "Nível 1", value: "1" },
      { label: "Nível 2", value: "2" }
    ],

    classesPai: [],
    entidadesD: [],
    entidadesP: [],
    listaProcessos: [],
    listaLegislacao: [],

    semaforos: {
      classeLoaded: false,
      paisReady: false,
      classesReady: false,
      entidadesReady: false,
      legislacaoReady: false
    },

    loginErrorSnackbar: false,

    loginErrorMessage: "Precisa de fazer login para alterar a Classe!",
    mensValCodigo: ""
  }),

  created: function() {
    this.$request("get", "/classes/" + this.idc)
      .then(async response => {
        this.classe = response.data;
        this.classeCopia = JSON.parse(JSON.stringify(this.classe));
        this.semaforos.classeLoaded = true;
      })
      .catch(error => {
        return error;
      });
  }
};
</script>

<style>
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

.info-content {
  padding: 5px;
  width: 100%;
  border: 1px solid #1a237e;
}

.is-collapsed li:nth-child(n + 5) {
  display: none;
}
</style>
