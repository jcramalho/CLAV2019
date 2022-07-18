<template>
  <v-card flat class="pa-3">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="3" align="center" justify="center">
        <Voltar />
      </v-col>
      <v-col cols="12" sm="9" align="center" justify="center">
        <p class="clav-content-title-1">Alterar Classe</p>
        <p class="clav-content-title-2">
          {{ classe.codigo }} -
          {{ classe.titulo }}
        </p>
      </v-col>
    </v-row>
    <BlocoIdentificativo :c="classe" />

    <v-expansion-panels flat class="mt-6">
      <!-- DESCRITIVO DA CLASSE -->
      <BlocoDescritivo :c="classe" />
    </v-expansion-panels>

    <v-snackbar v-model="loginErrorSnackbar" :timeout="8000" color="error" :top="true">
      {{ loginErrorMessage }}
      <v-btn icon color="white" @click="loginErrorSnackbar = false">
        <unicon
          name="remove-icon"
          width="15"
          height="15"
          viewBox="0 0 20.71 20.697"
          fill="#ffffff"
        />
      </v-btn>
    </v-snackbar>
    <PainelOperacoes :c="classe" :o="classeCopia" :pendenteId="''" />
  </v-card>
</template>

<script>
import { nanoid } from 'nanoid'
const help = require("@/config/help").help;

import BlocoIdentificativo from "@/components/classes/edicao/BlocoIdentificativo.vue";
import BlocoDescritivo from "@/components/classes/criacao/BlocoDescritivo.vue";
import PainelOperacoes from "@/components/classes/edicao/PainelOperacoes.vue";
import Voltar from "@/components/generic/Voltar";

export default {
  components: {
    BlocoIdentificativo,
    BlocoDescritivo,
    PainelOperacoes,
    Voltar,
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
      2: /^[0-9]{3}\.[0-9]{2}$/,
    },

    formatoCodigo: {
      1: "ddd (d - digito)",
      2: "ddd.dd (d - digito)",
    },

    classeNiveis: [
      { label: "Nível 1", value: "1" },
      { label: "Nível 2", value: "2" },
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
      legislacaoReady: false,
    },

    loginErrorSnackbar: false,

    loginErrorMessage: "Precisa de fazer login para alterar a Classe!",
    mensValCodigo: "",
  }),

  created: function () {
    if (this.$route.params.idClasse.includes("-"))
      this.$request("get", `/pedidos/${this.$route.params.idClasse}`)
        .then((data) => {
          this.classe = data.data.objeto.dados;
          this.classeCopia = { ...this.classe };
          this.semaforos.classeLoaded = true;
        })
        .catch((err) => console.log(err));
    else
      this.$request("get", "/classes/" + this.idc)
        .then(async (response) => {
          this.classe = response.data;
          this.classeCopia = JSON.parse(JSON.stringify(this.classe));
          this.semaforos.classeLoaded = true;
        })
        .catch((error) => {
          return error;
        });
  },
};
</script>

<style scoped>
.separador {
  color: white;
  font-weight: 400;
  padding: 5px;
  margin: 5px;
  width: 100%;
  min-height: 55px;
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%) !important;
  font-size: 14pt;
  font-weight: bold;
  border-radius: 10px 10px 0 0;
}
.info-label {
  color: #1a237e !important;
  padding: 8px;
  width: 100%;
  background-color: #dee2f8;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12) !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 6px;
  text-align: center;
}
.info-content {
  padding: 8px;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}
#expanded-content {
  margin-left: 5px;
  margin-top: -1.1rem;
  border: 1px solid #dee2f8;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.12);
}
</style>
