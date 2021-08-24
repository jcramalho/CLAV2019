<template>
  <v-row class="ma-1">
    <v-col>
      <!-- HEADER -->
      <v-card>
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title class="card-heading"
            >Nova Classe (continuação do trabalho guardado)</v-toolbar-title
          >
        </v-app-bar>

        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Nível:</div>
            </v-col>
            <v-col>
              <div class="info-content">
                {{ classe.nivel }}
              </div>
            </v-col>
          </v-row>

          <!-- CÓDIGO DA NOVA CLASSE -->
          <v-row>
            <v-col cols="2">
              <div class="info-label">
                Código:
                <InfoBox header="Código da Classe" :text="myhelp.Classe.Campos.Codigo" />
              </div>
            </v-col>
            <v-col>
              <div class="info-content">
                {{ classe.codigo }}
              </div>
            </v-col>
          </v-row>

          <!-- TÍTULO -->
          <v-row>
            <v-col cols="2">
              <div class="info-label">
                Título:
                <InfoBox header="Título da Classe" :text="myhelp.Classe.Campos.Titulo" />
              </div>
            </v-col>
            <v-col>
              <v-text-field
                v-model="classe.titulo"
                label="Título"
                solo
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

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
      <!-- TODO: Corrigir este componente -->
      <PainelOperacoesCont :o="obj" />
    </v-col>
  </v-row>
</template>

<script>
const nanoid = require("nanoid");
const help = require("@/config/help").help;

import InfoBox from "@/components/generic/infoBox.vue";
import BlocoDescritivo from "@/components/classes/criacao/BlocoDescritivo.vue";
import PainelOperacoesCont from "@/components/classes/criacao/PainelOperacoesCont.vue";

export default {
  props: ["obj"],

  components: {
    BlocoDescritivo,
    InfoBox,
    PainelOperacoesCont,
  },

  data: () => ({
    // Objeto que guarda uma classe

    classe: {},
    pendenteID: "",

    // Estruturas auxiliares

    myhelp: help,

    semaforos: {
      classesReady: false,
    },

    loginErrorSnackbar: false,

    loginErrorMessage: "Precisa de fazer login para criar a Classe!",
    mensValCodigo: "",
  }),

  created: async function () {
    this.classe = this.obj.objeto;
    this.pendenteID = this.obj._id;
  },
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
