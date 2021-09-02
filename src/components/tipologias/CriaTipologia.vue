<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">Nova tipologia de entidade</p>

    <!-- Content -->
    <v-card-text>
      <Campo
        nome="Nome da Tipologia"
        infoHeader="Nome da Tipologia"
        :infoBody="myhelp.Tipologias.Campos.Nome"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-text-field
            filled
            clearable
            color="primary"
            single-line
            v-model="tipologia.designacao"
            label="Nome da Tipologia"
            hide-details
            dense
          ></v-text-field>
        </template>
      </Campo>

      <Campo
        nome="Sigla"
        infoHeader="Sigla"
        :infoBody="myhelp.Tipologias.Campos.Sigla"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-text-field
            filled
            clearable
            color="indigo"
            single-line
            v-model="tipologia.sigla"
            label="Sigla"
            hide-details
            dense
          ></v-text-field>
        </template>
      </Campo>

      <!-- Blocos expansivos -->
      <v-expansion-panels>
        <PainelCLAV
          titulo="Entidades"
          icon="mdi-bank"
          infoHeader="Selecionar entidades"
          :infoBody="myhelp.Tipologias.Campos.Entidades"
        >
          <template v-slot:conteudo>
            <DesSelEnt
              :entidades="entSel"
              tipo="tipologias"
              @unselectEntidade="unselectEntidade($event)"
            />

            <hr style="border-top: 1px dashed #dee2f8" />

            <SelEnt
              :entidadesReady="entidadesReady"
              :entidades="entidades"
              @selectEntidade="selectEntidade($event)"
            />
          </template>
        </PainelCLAV>
      </v-expansion-panels>
      <!-- Painel Operações -->
      <PainelOpsTip :t="tipologia" :acao="'Criação'" />
    </v-card-text>
    <v-snackbar v-model="snackbar" :timeout="8000" color="error" :top="true">
      {{ text }}
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import DesSelEnt from "@/components/generic/selecao/DesSelecionarEntidades.vue";
import SelEnt from "@/components/generic/selecao/SelecionarEntidades.vue";
import PainelOpsTip from "@/components/tipologias/PainelOperacoesTipologias";
import Campo from "@/components/generic/Campo.vue";
import PainelCLAV from "@/components/generic/PainelCLAV.vue";

const help = require("@/config/help").help;

export default {
  data: () => ({
    myhelp: help,
    tipologia: {
      designacao: "",
      sigla: "",
      estado: "Ativa",
      entidadesSel: [],
    },

    // Para o seletor
    entidades: [],
    entSel: [],
    entidadesReady: false,

    snackbar: false,
    text: "",
  }),

  components: {
    DesSelEnt,
    SelEnt,
    PainelOpsTip,
    Campo,
    PainelCLAV,
  },

  methods: {
    // Vai à API buscar todas as entidades
    loadEntidades: async function () {
      try {
        let response = await this.$request("get", "/entidades");
        this.entidades = response.data.map(function (item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
          };
        });
        this.entidadesReady = true;
      } catch (error) {
        return error;
      }
    },

    unselectEntidade: function (entidade) {
      // Recoloca a entidade nos selecionáveis
      this.entidades.push(entidade);
      let index = this.entSel.findIndex((e) => e.id === entidade.id);
      this.entSel.splice(index, 1);
      this.tipologia.entidadesSel = this.entSel;
    },

    selectEntidade: function (entidade) {
      this.entSel.push(entidade);
      this.tipologia.entidadesSel = this.entSel;
      // Remove dos selecionáveis
      let index = this.entidades.findIndex((e) => e.id === entidade.id);
      this.entidades.splice(index, 1);
    },

    // fechar o snackbar em caso de erro
    fecharSnackbar() {
      this.snackbar = false;
    },
  },

  created: function () {
    this.loadEntidades();
  },
};
</script>

<style scoped>
.separador {
  color: white;
  padding: 5px;
  font-weight: 400;
  width: 100%;
  background-color: #1a237e;
  font-size: 14pt;
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
