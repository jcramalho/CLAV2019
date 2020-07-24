<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title class="card-heading"
            >Editar Entidade ({{ entidadeOriginal.sigla }} -
            {{ entidadeOriginal.designacao }})</v-toolbar-title
          >
        </v-app-bar>

        <!-- Content -->
        <v-card-text class="ma-0 pa-0">
          <v-stepper v-model="etapa" vertical>
            <!-- Step 1 -->
            <v-stepper-step :complete="etapa > 1" step="1" editable>
              Escolha a operação
            </v-stepper-step>

            <v-stepper-content step="1">
              <div class="ma-4">
                <v-radio-group v-model="acao" row>
                  <v-radio label="Editar" value="Alteração"></v-radio>
                  <v-radio
                    v-if="entidade.estado === 'Ativa'"
                    label="Extinguir"
                    value="Extinção"
                  ></v-radio>
                </v-radio-group>
              </div>

              <v-btn color="primary" @click="etapa = 2">
                Continuar
              </v-btn>
            </v-stepper-content>

            <!-- Step 2 -->
            <v-stepper-step :complete="etapa > 2" step="2">{{
              acao
            }}</v-stepper-step>

            <v-stepper-content step="2">
              <div v-if="acao === 'Alteração'">
                <v-row>
                  <v-col cols="2">
                    <div class="info-label">Nome da Entidade</div>
                  </v-col>
                  <v-col>
                    <v-text-field
                      filled
                      clearable
                      label="Nome da Entidade"
                      color="indigo"
                      single-line
                      v-model="entidade.designacao"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="2">
                    <div class="info-label">Internacional</div>
                  </v-col>
                  <v-col>
                    <v-select
                      filled
                      v-model="entidade.internacional"
                      :items="['Sim', 'Não']"
                      label="Selecione uma opção"
                      item-color="indigo"
                      color="indigo"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="2">
                    <div class="info-label">SIOE</div>
                  </v-col>
                  <v-col>
                    <v-text-field
                      filled
                      clearable
                      label="SIOE"
                      color="indigo"
                      single-line
                      v-model="entidade.sioe"
                      :rules="regraSIOE"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="2">
                    <div class="info-label">Data de criação</div>
                  </v-col>
                  <v-col>
                    <SelecionarData
                      :d="entidade.dataCriacao"
                      :label="'Data: AAAA-MM-DD'"
                      @dataSelecionada="entidade.dataCriacao = $event"
                    />
                  </v-col>
                </v-row>

                <!-- Blocos expansivos -->
                <v-expansion-panels>
                  <v-expansion-panel popout focusable>
                    <v-expansion-panel-header class="expansion-panel-heading">
                      <div>Tipologias de Entidade</div>

                      <template v-slot:actions>
                        <v-icon color="white">expand_more</v-icon>
                      </template>
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
              </div>

              <div v-else>
                <v-row>
                  <v-col cols="2">
                    <div class="info-label">Data de extinção</div>
                  </v-col>
                  <v-col>
                    <SelecionarData
                      :d="entidade.dataExtincao"
                      :label="'Data: AAAA-MM-DD'"
                      @dataSelecionada="entidade.dataExtincao = $event"
                    />
                  </v-col>
                </v-row>
              </div>
            </v-stepper-content>
          </v-stepper>
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

      <PainelOpsEnt
        v-if="etapa === 2"
        :e="entidade"
        :original="entidadeOriginal"
        :acao="acao"
      />
    </v-col>
  </v-row>
</template>

<script>
import DesSelTip from "@/components/generic/selecao/DesSelecionarTipologias.vue";
import SelTip from "@/components/generic/selecao/SelecionarTipologias.vue";
import PainelOpsEnt from "@/components/entidades/PainelOperacoesEntidades.vue";
import SelecionarData from "@/components/generic/SelecionarData";

export default {
  props: ["e"],
  components: {
    DesSelTip,
    SelTip,
    PainelOpsEnt,
    SelecionarData,
  },

  data() {
    return {
      etapa: 1,
      entidade: {
        designacao: "",
        sigla: "",
        internacional: "",
        sioe: "",
        codigo: "",
        dataCriacao: "",
        dataExtincao: "",
        tipologiasSel: [],
      },
      entidadeOriginal: {},
      acao: "Alteração",

      // Para o seletor de processos
      tipologias: [],
      tipSel: [],
      tipologiasReady: false,

      regraSIOE: [
        (v) => /^[0-9]*$/.test(v) || "Apenas são aceites caracteres numéricos.",
      ],

      snackbar: false,
      text: "",
    };
  },

  methods: {
    // Vai à API buscar todas as tipologias
    loadTipologias: async function() {
      try {
        let response = await this.$request("get", "/tipologias/");

        this.tipologias = response.data.map(function(item) {
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

    unselectTipologia: function(tipologia) {
      // Recoloca a tipologia nos selecionáveis
      this.tipologias.push(tipologia);
      let index = this.tipSel.findIndex((e) => e.id === tipologia.id);
      this.tipSel.splice(index, 1);
      this.entidade.tipologiasSel = this.tipSel;
    },

    selectTipologia: function(tipologia) {
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

  created: async function() {
    this.entidade = JSON.parse(JSON.stringify(this.e));
    this.entidadeOriginal = JSON.parse(JSON.stringify(this.e));

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
