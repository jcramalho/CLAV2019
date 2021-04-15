<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">Nova Entidade</p>

    <!-- Content -->
    <v-card-text>
      <Campo
        nome="Nome da entidade"
        infoHeader="Nome da entidade"
        :infoBody="myhelp.Entidade.Campos.Nome"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-text-field
            filled
            clearable
            color="primary"
            single-line
            dense
            hide-details
            v-model="entidade.designacao"
            label="Nome da Entidade"
          ></v-text-field>
        </template>
      </Campo>

      <Campo
        nome="Sigla"
        infoHeader="Sigla"
        :infoBody="myhelp.Entidade.Campos.Sigla"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-text-field
            filled
            clearable
            color="primary"
            dense
            hide-details
            single-line
            v-model="entidade.sigla"
            label="Sigla"
          ></v-text-field>
        </template>
      </Campo>

      <Campo
        nome="Internacional"
        infoHeader="Internacional"
        :infoBody="myhelp.Entidade.Campos.Internacional"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-select
            v-model="entidade.internacional"
            :items="['Sim', 'Não']"
            label="Selecione uma opção"
            item-color="primary"
            color="primary"
            filled
            dense
            hide-details
          />
        </template>
      </Campo>

      <Campo
        nome="SIOE"
        infoHeader="Código SIOE"
        :infoBody="myhelp.Entidade.Campos.SIOE"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-text-field
            filled
            clearable
            color="indigo"
            single-line
            dense
            hide-details
            v-model="entidade.sioe"
            :rules="regraSIOE"
            label="SIOE"
          ></v-text-field>
        </template>
      </Campo>

      <Campo
        nome="Data de criação"
        infoHeader="Data de criação"
        :infoBody="myhelp.Entidade.Campos.DataCriacao"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <SelecionarData
            :d="entidade.dataCriacao"
            :label="'Data: AAAA-MM-DD'"
            @dataSelecionada="entidade.dataCriacao = $event"
          />
        </template>
      </Campo>

      <Campo
        nome="Data de extinção"
        infoHeader="Data de extinção"
        :infoBody="myhelp.Entidade.Campos.DataExtincao"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <SelecionarData
            :d="entidade.dataExtincao"
            :label="'Data: AAAA-MM-DD'"
            @dataSelecionada="entidade.dataExtincao = $event"
          />
        </template>
      </Campo>

      <!-- Blocos expansivos -->
      <v-expansion-panels>
        <PainelCLAV
          titulo="Tipologias de Entidade"
          icon="mdi-set-merge"
          infoHeader="Selecionar tipologias de entidades"
          :infoBody="myhelp.Entidade.Campos.Tipologias"
        >
          <template v-slot:conteudo>
            <DesSelTip
              :tipologias="tipSel"
              @unselectTipologia="unselectTipologia($event)"
            />

            <hr style="border-top: 1px dashed #dee2f8" />

            <SelTip
              :tipologiasReady="tipologiasReady"
              :tipologias="tipologias"
              @selectTipologia="selectTipologia($event)"
            />
          </template>
        </PainelCLAV>
      </v-expansion-panels>
      <PainelOpsEnt :e="entidade" :acao="'Criação'" />
    </v-card-text>
    <v-snackbar v-model="snackbar" :timeout="8000" color="error" :top="true">
      {{ text }}
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import DesSelTip from "@/components/generic/selecao/DesSelecionarTipologias.vue";
import SelTip from "@/components/generic/selecao/SelecionarTipologias.vue";
import PainelOpsEnt from "@/components/entidades/PainelOperacoesEntidades.vue";
import SelecionarData from "@/components/generic/SelecionarData";
import Campo from "@/components/generic/Campo.vue";
import PainelCLAV from "@/components/generic/PainelCLAV.vue";

const help = require("@/config/help").help;

export default {
  data: () => ({
    myhelp: help,
    entidade: {
      designacao: "",
      sigla: "",
      internacional: "",
      sioe: "",
      dataCriacao: "",
      dataExtincao: "",
      estado: "Ativa",
      tipologiasSel: [],
    },

    // Para o seletor de processos
    tipologias: [],
    tipSel: [],
    tipologiasReady: false,

    regraSIOE: [(v) => /^\d+$/.test(v) || "Apenas são aceites caracteres numéricos."],

    snackbar: false,
    text: "",
  }),

  components: {
    DesSelTip,
    SelTip,
    PainelOpsEnt,
    SelecionarData,
    Campo,
    PainelCLAV,
  },

  methods: {
    // Vai à API buscar todas as tipologias
    loadTipologias: async function () {
      try {
        let response = await this.$request("get", "/tipologias/");
        this.tipologias = response.data.map(function (item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
          };
        });
        this.tipologiasReady = true;
      } catch (error) {
        return error;
      }
    },

    unselectTipologia: function (tipologia) {
      // Recoloca a tipologia nos selecionáveis
      this.tipologias.push(tipologia);
      let index = this.tipSel.findIndex((e) => e.id === tipologia.id);
      this.tipSel.splice(index, 1);
      this.entidade.tipologiasSel = this.tipSel;
    },

    selectTipologia: function (tipologia) {
      this.tipSel.push(tipologia);
      this.entidade.tipologiasSel = this.tipSel;
      // Remove dos selecionáveis
      let index = this.tipologias.findIndex((e) => e.id === tipologia.id);
      this.tipologias.splice(index, 1);
    },

    // fechar o snackbar em caso de erro
    fecharSnackbar() {
      this.snackbar = false;
    },
  },

  created: function () {
    this.loadTipologias();
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
