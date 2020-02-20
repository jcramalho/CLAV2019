<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title class="card-heading">
            Revogar Legislação: {{ legislacao.numero }}
          </v-toolbar-title>
        </v-app-bar>

        <!-- Content -->
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Número da Legislação:</div>
            </v-col>
            <v-col>
              <v-text-field
                readonly
                solo
                color="indigo"
                single-line
                v-model="legislacao.numero"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Tipo:</div>
            </v-col>
            <v-col>
              <v-text-field
                readonly
                solo
                color="indigo"
                single-line
                v-model="legislacao.tipo"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Sumário:</div>
            </v-col>
            <v-col>
              <v-text-field
                readonly
                solo
                color="indigo"
                single-line
                v-model="legislacao.sumario"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Data de Extinção:</div>
            </v-col>
            <v-col>
              <v-menu
                ref="open"
                v-model="open"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    solo
                    v-model="legislacao.dataExtincao"
                    hint="AAAA/MM/DD"
                    persistent-hint
                    @blur="date = parseDate(dateFormatted)"
                    v-on="on"
                    :rules="regraData"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  no-title
                  @input="open = false"
                  :max="date"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-snackbar
          v-model="snackbar"
          :timeout="8000"
          color="error"
          :top="true"
        >
          {{ text }}
          <v-btn text @click="fecharSnackbar">Fechar</v-btn>
        </v-snackbar>
      </v-card>
      <PainelOpsLeg :l="legislacao" :acao="'Revogação'" />
    </v-col>
  </v-row>
</template>

<script>
import PainelOpsLeg from "@/components/legislacao/PainelOperacoesLegislacao";

export default {
  props: ["l"],
  components: {
    PainelOpsLeg
  },

  data: vm => ({
    legislacao: null,
    // vuetify datepicker
    date: null,
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    open: false,

    regraData: [
      v =>
        /[0-9]+\/[0-9]+\/[0-9]+/.test(v) || "Este campo está no formato errado."
    ],

    snackbar: false,
    text: ""
  }),

  // vuetify datepicker
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    }
  },

  watch: {
    date(val) {
      this.legislacao.dataExtincao = this.formatDate(this.date);
      this.dateFormatted = this.formatDate(this.date);
    }
  },

  methods: {
    // vuetify datepicker
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${year}/${month}/${day}`;
    },

    parseDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    // fechar o snackbar em caso de erro
    fecharSnackbar() {
      this.snackbar = false;
    }
  },

  created() {
    this.date = new Date().toISOString().substr(0, 10);
    this.legislacao = this.l;
    this.legislacao.estado = "Revogado";
    this.legislacao.dataRevogacao = this.dateFormatted;
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
