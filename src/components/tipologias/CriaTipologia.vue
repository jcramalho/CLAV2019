<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="indigo darken-3" dark>
          <v-toolbar-title class="card-heading">Nova Tipologia</v-toolbar-title>
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
                color="indigo"
                single-line
                v-model="tipologia.designacao"
                maxlength="50"
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
                color="indigo"
                single-line
                v-model="tipologia.sigla"
                maxlength="10"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Blocos expansivos -->
          <v-expansion-panels>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading"
                >Entidades</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <DesSelEnt
                  :entidades="entSel"
                  tipo="tipologias"
                  @unselectEntidade="unselectEntidade($event)"
                />

                <hr style="border-top: 1px dashed #dee2f8;" />

                <SelEnt
                  :entidadesReady="entidadesReady"
                  :entidades="entidades"
                  @selectEntidade="selectEntidade($event)"
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

      <!-- Painel Operações -->
      <PainelOpsTip :t="tipologia" :acao="'Criação'" />
    </v-col>
  </v-row>
</template>

<script>
import DesSelEnt from "@/components/generic/selecao/DesSelecionarEntidades.vue";
import SelEnt from "@/components/generic/selecao/SelecionarEntidades.vue";
import PainelOpsTip from "@/components/tipologias/PainelOperacoesTipologias";

export default {
  data: () => ({
    tipologia: {
      designacao: "",
      sigla: "",
      entidadesSel: [],
      codigo: ""
    },

    // Para o seletor
    entidades: [],
    entSel: [],
    entidadesReady: false,

    snackbar: false,
    text: ""
  }),
  components: {
    DesSelEnt,
    SelEnt,
    PainelOpsTip
  },

  methods: {
    // Vai à API buscar todas as entidades
    loadEntidades: async function() {
      try {
        let response = await this.$request("get", "/entidades");
        this.entidades = response.data.map(function(item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id
          };
        });
        this.entidadesReady = true;
      } catch (error) {
        return error;
      }
    },

    unselectEntidade: function(entidade) {
      // Recoloca a entidade nos selecionáveis
      this.entidades.push(entidade);
      let index = this.entSel.findIndex(e => e.id === entidade.id);
      this.entSel.splice(index, 1);
      this.tipologia.entidadesSel = this.entSel;
    },

    selectEntidade: function(entidade) {
      this.entSel.push(entidade);
      this.tipologia.entidadesSel = this.entSel;
      // Remove dos selecionáveis
      let index = this.entidades.findIndex(e => e.id === entidade.id);
      this.entidades.splice(index, 1);
    },

    // fechar o snackbar em caso de erro
    fecharSnackbar() {
      this.snackbar = false;
    }
  },

  created: function() {
    this.loadEntidades();
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
