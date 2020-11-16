<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title class="card-heading"
            >Novo Termo de Índice</v-toolbar-title
          >
        </v-app-bar>

        <!-- Content -->
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Designação:</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="indigo darken-4"
                single-line
                v-model="termoIndice.termo"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Processo Associado:</div>
            </v-col>
            <v-col v-if="this.processosReady">
              <v-autocomplete
                solo
                clearable
                color="indigo darken-4"
                label="Selecione um processo"
                :items="this.processos"
                v-model="termoIndice.idClasse"
              />
            </v-col>
            <v-col v-else style="text-align:center;">
              <p>A carregar processos...</p>
              <v-progress-circular
                indeterminate
                size="100"
                width="10"
                color="indigo accent-4"
              />
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

      <!-- Painel Operações -->
      <PainelOpsTI :ti="termoIndice" />
    </v-col>
  </v-row>
</template>

<script>
import PainelOpsTI from "@/components/termosIndice/PainelOperacoesTermoIndice";

export default {
  data: () => ({
    termoIndice: {
      termo: "",
      idClasse: "",
      codigo: ""
    },

    // Para o seletor de processos
    processos: [],
    processosReady: false,

    snackbar: false,
    text: ""
  }),
  components: {
    PainelOpsTI
  },
  methods: {
    // Vai à API buscar todas as classes de nivel 3
    loadClasses: async function() {
      try {
        let response = await this.$request("get", "/classes?nivel=3");
        this.processos = response.data.map(function(item) {
          return item.codigo;
        });
        this.processosReady = true;
      } catch (error) {
        return error;
      }
    },

    // fechar o snackbar em caso de erro
    fecharSnackbar() {
      this.snackbar = false;
    }
  },

  created: function() {
    this.loadClasses();
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
</style>
