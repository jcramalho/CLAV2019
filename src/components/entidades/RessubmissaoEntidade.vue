<template>
  <v-card flat class="pa-3">
    <!-- Header -->
    <v-row align="center" justify="center">
      <v-col cols="12" sm="3" align="center" justify="center">
        <Voltar />
      </v-col>
      <v-col cols="12" sm="9" align="center" justify="center">
        <p class="clav-content-title-1">Ressubmeter Entidade</p>
        <p class="clav-content-title-2">
          {{ entidadeOriginal.sigla }} -
          {{ entidadeOriginal.designacao }}
        </p>
      </v-col>
    </v-row>

    <!-- Content -->
    <v-card-text class="ma-0 pa-0">
      <div>
        <Campo nome="Nome da Entidade" color="neutralpurple">
          <template v-slot:conteudo>
            <v-text-field
              clearable
              label="Nome da Entidade"
              single-line
              hide-details
              dense
              v-model="entidade.designacao"
            />
          </template>
        </Campo>
        <Campo nome="Sigla" color="neutralpurple">
          <template v-slot:conteudo>
            <v-text-field
              clearable
              label="Sigla"
              single-line
              hide-details
              dense
              v-model="entidade.sigla"
            />
          </template>
        </Campo>
        <Campo nome="Internacional" color="neutralpurple">
          <template v-slot:conteudo>
            <v-select
              filled
              v-model="entidade.internacional"
              :items="['Sim', 'Não']"
              label="Selecione uma opção"
              item-color="indigo"
              hide-details
              dense
            />
          </template>
        </Campo>

        <Campo nome="SIOE" color="neutralpurple">
          <template v-slot:conteudo>
            <v-text-field
              clearable
              label="SIOE"
              single-line
              hide-details
              dense
              v-model="entidade.sioe"
              :rules="regraSIOE"
            ></v-text-field>
          </template>
        </Campo>

        <Campo nome="Data de criação" color="neutralpurple" class="mb-3">
          <template v-slot:conteudo>
            <SelecionarData
              :d="entidade.dataCriacao"
              :label="'Data: AAAA-MM-DD'"
              @dataSelecionada="entidade.dataCriacao = $event"
            />
          </template>
        </Campo>

        <Campo nome="Data de extinção" color="neutralpurple" class="mb-3">
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
          <PainelCLAV titulo="Tipologias de Entidade" icon="mdi-inbox-multiple-outline">
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
      </div>
    </v-card-text>
    <v-snackbar v-model="snackbar" :timeout="8000" color="error" :top="true">
      {{ text }}
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>

    <PainelOpsEnt :e="entidade" :original="entidadeOriginal" :pedido="e" :acao="acao" />
  </v-card>
</template>

<script>
import DesSelTip from "@/components/generic/selecao/DesSelecionarTipologias.vue";
import SelTip from "@/components/generic/selecao/SelecionarTipologias.vue";
import PainelOpsEnt from "@/components/entidades/PainelOperacoesEntidades.vue";
import SelecionarData from "@/components/generic/SelecionarData";
import PainelCLAV from "@/components/generic/PainelCLAV";
import Campo from "@/components/generic/CampoCLAV";
import Voltar from "@/components/generic/Voltar";

export default {
  props: ["e"],
  components: {
    DesSelTip,
    SelTip,
    PainelOpsEnt,
    SelecionarData,
    PainelCLAV,
    Campo,
    Voltar,
  },

  data() {
    return {
      etapa: 1,
      entidade: {
        designacao: "",
        sigla: "",
        internacional: "",
        sioe: "",
        dataCriacao: "",
        dataExtincao: "",
        tipologiasSel: [],
      },
      entidadeOriginal: {},
      acao: "Criação",

      // Para o seletor de processos
      tipologias: [],
      tipSel: [],
      tipologiasReady: false,

      regraSIOE: [(v) => /^\d+$/.test(v) || "Apenas são aceites caracteres numéricos."],

      snackbar: false,
      text: "",
    };
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

  created: async function () {
    this.entidade = JSON.parse(JSON.stringify(this.e.objeto.dados));
    this.entidadeOriginal = JSON.parse(JSON.stringify(this.e.objeto.dados));
    this.acao = this.e.objeto.acao;

    await this.loadTipologias();

    try {
      if (this.entidade.tipologiasSel.length !== 0) {
        this.entidade.tipologiasSel.forEach((tip) => {
          this.tipSel.push(tip);

          // Remove dos selecionáveis
          let index = this.tipologias.findIndex((t) => t.id === tip.id);
          this.tipologias.splice(index, 1);
        });
      }
    } catch (e) {
      this.text = "Erro ao carregar os dados, por favor tente novamente";
      this.snackbar = true;
    }
  },
};
</script>

<style scoped></style>
