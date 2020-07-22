<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp
    }"
  >
    <v-container fluid class="pa-0 ma-0" style="max-width:100%;">
      <v-row>
        <v-col class="pt-0">
          <!-- HEADER -->
          <v-card flat style="border-radius: 10px !important;">
            <p
              class="content-title-1 py-5"
              style="color: #4da0d0 !important;  text-align:center;"
            >
              Nova Classe (continuação do trabalho guardado)
            </p>

            <v-card-text>
              <v-row>
                <v-col cols="12" lg="2">
                  <div class="info-label">Nível:</div>
                </v-col>
                <v-col cols="12" lg="10">
                  <div class="info-content pa-4" style="min-height: 50px;">
                    {{ classe.nivel }}
                  </div>
                </v-col>
              </v-row>

              <!-- CÓDIGO DA NOVA CLASSE -->
              <v-row
                :class="{
                  'mt-7': $vuetify.breakpoint.smAndDown,
                  'mt-6': $vuetify.breakpoint.mdAndUp
                }"
              >
                <v-col cols="12" lg="2">
                  <div class="info-label">
                    Código:
                    <InfoBox
                      header="Código da Classe"
                      :text="myhelp.Classe.Campos.Codigo"
                      helpColor="info"
                    />
                  </div>
                </v-col>
                <v-col cols="12" lg="10">
                  <div class="info-content pa-4">
                    {{ classe.codigo }}
                  </div>
                </v-col>
              </v-row>

              <!-- TÍTULO -->
              <v-row
                :class="{
                  'mt-7': $vuetify.breakpoint.smAndDown,
                  'mt-6': $vuetify.breakpoint.mdAndUp
                }"
              >
                <v-col cols="12" lg="2">
                  <div class="info-label">
                    Título:
                    <InfoBox
                      header="Título da Classe"
                      :text="myhelp.Classe.Campos.Titulo"
                      helpColor="info"
                    />
                  </div>
                </v-col>
                <v-col cols="12" lg="10">
                  <div
                    class="info-content pa-4 px-8 pb-6"
                    style="min-height: 50px;"
                  >
                    <v-text-field
                      class="mt-n4"
                      v-model="classe.titulo"
                      label="Título"
                      text
                      hide-details
                      single-line
                      clearable
                      color="blue darken-3"
                    ></v-text-field>
                  </div>
                </v-col>
              </v-row>

              <v-expansion-panels flat class="mt-6">
                <!-- DESCRITIVO DA CLASSE -->
                <BlocoDescritivo :c="classe" class="mt-6" />
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
            <!-- TODO: Corrigir este componente -->
            <PainelOperacoesCont :o="obj" />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
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
    PainelOperacoesCont
  },

  data: () => ({
    // Objeto que guarda uma classe

    classe: {},
    pendenteID: "",

    // Estruturas auxiliares

    myhelp: help,

    semaforos: {
      classesReady: false
    },

    loginErrorSnackbar: false,

    loginErrorMessage: "Precisa de fazer login para criar a Classe!",
    mensValCodigo: ""
  }),

  created: async function() {
    this.classe = this.obj.objeto;
    this.pendenteID = this.obj._id;
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
