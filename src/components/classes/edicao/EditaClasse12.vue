<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp
    }"
  >
    <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
      <v-row>
        <v-col class="py-0 my-0">
          <v-btn
            @click="$router.go(-1)"
            rounded
            class="white--text mb-6"
            :class="{
              'px-8': $vuetify.breakpoint.lgAndUp,
              'px-2': $vuetify.breakpoint.mdAndDown
            }"
            id="default-button"
          >
            <unicon
              name="arrow-back-icon"
              width="20"
              height="20"
              viewBox="0 0 20.71 37.261"
              fill="#ffffff"
            />
            <p class="ml-2">Voltar</p>
          </v-btn>
          <!-- HEADER -->
          <v-card flat style="border-radius: 10px !important;">
            <p
              class="content-title-1 pt-5"
              style="color: #4da0d0 !important; text-align: center;  padding-bottom: 0.7rem !important;"
            >
              Alterar Classe
            </p>
            <p
              class="content-title-2 pb-5"
              style="color: #4da0d0 !important; text-align: center;"
            >
              {{ classe.codigo }} -
              {{ classe.titulo }}
            </p>
            <v-card-text>
              <!-- IDENTIFICAÇÃO DA CLASSE -->
              <BlocoIdentificativo :c="classe" />

              <v-expansion-panels flat class="mt-6">
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
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import BlocoIdentificativo from "@/components/classes/edicao/BlocoIdentificativo.vue";
import BlocoDescritivo from "@/components/classes/criacao/BlocoDescritivo.vue";
import PainelOperacoes from "@/components/classes/edicao/PainelOperacoes.vue";

export default {
  components: {
    BlocoIdentificativo,
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
