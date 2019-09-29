<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="green darken-4" dark>
          <v-toolbar-title class="card-heading">Nova Entidade</v-toolbar-title>
        </v-app-bar>

        <!-- Content -->
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Nome da Entidade:</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="green"
                counter="150"
                single-line
                v-model="entidade.designacao"
                maxlength="150"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Sigla:</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="green"
                counter="10"
                single-line
                v-model="entidade.sigla"
                maxlength="10"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Internacional:</div>
            </v-col>
            <v-col>
              <v-select
                v-model="entidade.internacional"
                :items="['Sim', 'Não']"
                label="Selecione uma opção"
                item-color="green"
                color="green"
                solo
                dense
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">SIOE:</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="green"
                counter="12"
                single-line
                v-model="entidade.sioe"
                maxlength="12"
                :rules="regraSIOE"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Blocos expansivos -->
          <v-expansion-panels>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                Tipologias de Entidade
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <DesSelTip
                  :tipologias="tipSel"
                  @unselectTipologia="unselectTipologia($event)"
                />

                <hr style="border-top: 1px dashed #dee2f8;" />

                <SelTip
                  :tipologiasReady="tipologiasReady"
                  :tipologias="tipologias"
                  @selectTipologia="selectTipologia($event)"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
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
      <PainelOpsEnt :e="entidade" />
    </v-col>
  </v-row>
</template>

<script>
import DesSelTip from "@/components/generic/selecao/DesSelecionarTipologias.vue";
import SelTip from "@/components/generic/selecao/SelecionarTipologias.vue";
import PainelOpsEnt from "@/components/entidades/PainelOperacoesEntidades.vue";

export default {
  data: () => ({
    entidade: {
      designacao: "",
      sigla: "",
      internacional: "",
      sioe: "",
      tipologiasSel: [],
      codigo: ""
    },

    // Para o seletor de processos
    tipologias: [],
    tipSel: [],
    tipologiasReady: false,

    regraSIOE: [
      v => /^[0-9]*$/.test(v) || "Apenas são aceites caracteres numéricos."
    ],

    snackbar: false,
    text: ""
  }),
  components: {
    DesSelTip,
    SelTip,
    PainelOpsEnt
  },
  methods: {
    // Vai à API buscar todas as tipologias
    loadTipologias: async function() {
      try {
        var response = await this.$request("get", "/api/tipologias/");
        this.tipologias = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id
          };
        });
        this.tipologiasReady = true;
      } catch (error) {
        return error;
      }
    },
    unselectTipologia: function(tipologia) {
      // Recoloca a tipologia nos selecionáveis
      this.tipologias.push(tipologia);
      var index = this.tipSel.findIndex(e => e.id === tipologia.id);
      this.tipSel.splice(index, 1);
    },
    selectTipologia: function(tipologia) {
      this.tipSel.push(tipologia);
      // Remove dos selecionáveis
      var index = this.tipologias.findIndex(e => e.id === tipologia.id);
      this.tipologias.splice(index, 1);
    },
    // fechar o snackbar em caso de erro
    fecharSnackbar() {
      this.snackbar = false;
    }
  },
  created: function() {
    this.loadTipologias();
  }
};
</script>

<style scoped>
.expansion-panel-heading {
  background-color: #1b5e20 !important;
  color: #fff;
  font-size: large;
  font-weight: bold;
}

.card-heading {
  font-size: x-large;
  font-weight: bold;
}

.info-label {
  color: #2e7d32; /* green darken-3 */
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #e8f5e9; /* green lighten-5 */
  font-weight: bold;
  margin: 5px;
  border-radius: 3px;
}
</style>
