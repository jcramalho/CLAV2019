<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title class="card-heading">Novo Termo de Índice</v-toolbar-title>
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
                counter="50"
                single-line
                v-model="termoIndice.termo"
                maxlength="50"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Blocos expansivos -->
          <v-expansion-panels>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header
                class="expansion-panel-heading"
              >Processos de negócio que regula ou enquadra</v-expansion-panel-header>
              <v-expansion-panel-content>
                <DesSelProc :processos="procSel" @unselectProcesso="unselectProcesso($event)" />

                <hr v-if="!termoIndice.idClasse" style="border-top: 1px dashed #dee2f8;" />

                <SelProc
                  v-if="!termoIndice.idClasse"
                  :processosReady="processosReady"
                  :processos="processos"
                  @selectProcesso="selectProcesso($event)"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-snackbar v-model="snackbar" :timeout="8000" color="error" :top="true">
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
import DesSelProc from "@/components/generic/selecao/DesSelecionarPNs";
import SelProc from "@/components/generic/selecao/SelecionarPNs";
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
    procSel: [],
    processosReady: false,

    snackbar: false,
    text: ""
  }),
  components: {
    DesSelProc,
    SelProc,
    PainelOpsTI
  },
  methods: {
    unselectProcesso: function(processo) {
      // Recoloca o processo nos selecionáveis
      this.processos.push(processo);
      let index = this.procSel.findIndex(e => e.id === processo.id);
      this.procSel.splice(index, 1);
      this.termoIndice.idClasse = "";
    },

    selectProcesso: function(processo) {
      this.procSel.push(processo);
      this.termoIndice.idClasse = processo.id;
      // Remove dos selecionáveis
      let index = this.processos.findIndex(e => e.id === processo.id);
      this.processos.splice(index, 1);
    },

    // Vai à API buscar todas as classes de nivel 3
    loadClasses: async function() {
      try {
        let response = await this.$request("get", "/api/classes?nivel=3");
        this.processos = response.data.map(function(item) {
          return {
            codigo: item.codigo,
            titulo: item.titulo,
            id: item.codigo
          };
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
