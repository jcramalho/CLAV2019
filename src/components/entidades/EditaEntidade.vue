<template>
  <v-container fluid class="pa-0 ma-0" style="max-width:100%">
    <v-row>
      <!-- HEADER -->
      <v-col class="py-0 my-0">
        <v-btn
          @click="goBack"
          rounded
          class="white--text mb-6"
          :class="{
            'px-8': $vuetify.breakpoint.lgAndUp,
            'px-2': $vuetify.breakpoint.mdAndDown,
          }"
          id="default-button"
        >
          <unicon
            name="arrow-back-icon"
            width="20"
            height="20"
            viewBox="0 0 20.71 37.261"
            fill="#ffffff"
          />
          <p class="ml-2">Voltar</p>
        </v-btn>
        <v-card flat style="border-radius: 10px !important;">
          <p
            class="content-title-1 pt-5"
            style="color: #4da0d0 !important; text-align: center;  padding-bottom: 0.7rem !important;"
          >
            Alterar Entidade
          </p>
          <p
            class="content-title-2 pb-5"
            style="color: #4da0d0 !important; text-align: center;"
          >
            {{ entidadeOriginal.sigla }} -
            {{ entidadeOriginal.designacao }}
          </p>
          <!-- Content -->
          <v-card-text class="mt-0">
            <v-stepper
              v-model="etapa"
              id="stepper-card"
              class="mx-8 mt-n8 pa-4"
            >
              <v-stepper-header>
                <!--Step 1-->
                <v-stepper-step :complete="etapa > 1" step="1" editable>
                  Escolha a operação
                </v-stepper-step>
                <v-divider></v-divider>
                <!--Step 2-->
                <v-stepper-step :complete="etapa > 2" step="2">{{
                  acao
                }}</v-stepper-step>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content
                  step="1"
                  style="text-align: center !important;"
                  class="px-12"
                >
                  <v-radio-group v-model="acao" row class="ml-1 px-6">
                    <v-radio
                      class="mx-auto my-4"
                      label="Editar"
                      value="Alteração"
                    ></v-radio>
                    <v-radio
                      class="mx-auto"
                      label="Extinguir"
                      value="Extinção"
                    ></v-radio>
                  </v-radio-group>
                  <v-btn
                    @click="etapa = 2"
                    rounded
                    class="white--text mb-6"
                    :class="{
                      'px-8': $vuetify.breakpoint.lgAndUp,
                      'px-2': $vuetify.breakpoint.mdAndDown,
                    }"
                    id="default-button"
                  >
                    <unicon
                      name="continuar-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20.71 37.261"
                      fill="#ffffff"
                    />
                    <p class="ml-2">Continuar</p>
                  </v-btn>
                </v-stepper-content>
                <v-stepper-content step="2">
                  <div v-if="acao === 'Alteração'">
                    <v-row>
                      <v-col cols="12" lg="2">
                        <div class="info-label">Nome da Entidade</div>
                      </v-col>
                      <v-col cols="12" lg="10">
                        <div
                          class="info-content pt-3 pb-5 px-5"
                          style="min-height: 50px;"
                        >
                          <v-text-field
                            class="mt-n3 px-3"
                            text
                            hide-details
                            single-line
                            clearable
                            label="Nome da Entidade"
                            color="blue darken-3"
                            v-model="entidade.designacao"
                          />
                        </div>
                      </v-col>
                    </v-row>

                    <v-row
                      :class="{
                        'mt-5': $vuetify.breakpoint.smAndDown,
                        'mt-4': $vuetify.breakpoint.mdAndUp,
                      }"
                    >
                      <v-col cols="12" lg="2">
                        <div class="info-label">Internacional</div>
                      </v-col>
                      <v-col cols="12" lg="10">
                        <div
                          class="info-content pa-5"
                          style="min-height: 50px;"
                        >
                          <v-select
                            class="mt-n5 px-3"
                            v-model="entidade.internacional"
                            :items="['Sim', 'Não']"
                            label="Selecione uma opção"
                            color="blue darken-3"
                            clearable
                            hide-details
                            single-line
                          />
                        </div>
                      </v-col>
                    </v-row>
                    <v-row
                      :class="{
                        'mt-5': $vuetify.breakpoint.smAndDown,
                        'mt-4': $vuetify.breakpoint.mdAndUp,
                      }"
                    >
                      <v-col cols="12" lg="2">
                        <div class="info-label">SIOE</div>
                      </v-col>
                      <v-col cols="12" lg="10">
                        <div
                          class="info-content pt-3 pb-2 px-5"
                          style="min-height: 50px;"
                        >
                          <v-text-field
                            class="mt-n3 px-3"
                            text
                            clearable
                            single-line
                            label="SIOE"
                            color="blue darken-3"
                            v-model="entidade.sioe"
                            :rules="regraSIOE"
                          ></v-text-field>
                        </div>
                      </v-col>
                    </v-row>

                    <v-row
                      :class="{
                        'mt-5': $vuetify.breakpoint.smAndDown,
                        'mt-4': $vuetify.breakpoint.mdAndUp,
                      }"
                    >
                      <v-col cols="12" lg="2">
                        <div class="info-label">Data de criação</div>
                      </v-col>
                      <v-col cols="12" lg="10">
                        <div
                          class="info-content px-8 pb-2 mt-n1"
                          style="min-height: 50px; padding-top: 0 !important;"
                        >
                          <SelecionarData
                            :d="entidade.dataCriacao"
                            :label="'Data: AAAA-MM-DD'"
                            @dataSelecionada="entidade.dataCriacao = $event"
                          />
                        </div>
                      </v-col>
                    </v-row>

                    <!--Blocos expansivos-->
                    <v-expansion-panels flat class="mb-n4">
                      <v-expansion-panel popout class="mt-6">
                        <v-expansion-panel-header
                          style="outline: none;"
                          :class="{
                            'text-center': $vuetify.breakpoint.smAndDown,
                            'text-left': $vuetify.breakpoint.mdAndUp,
                          }"
                          class="pa-0"
                        >
                          <div
                            :class="{
                              'px-3': $vuetify.breakpoint.mdAndUp,
                            }"
                            class="separador"
                          >
                            <unicon
                              class="mt-3"
                              name="tipologia-ent-icon"
                              width="22"
                              height="22"
                              viewBox="0 0 20.711 22.48"
                              fill="#ffffff"
                            />
                            <span class="ml-3 mr-1"
                              >Tipologias de Entidade</span
                            >
                          </div>
                        </v-expansion-panel-header>

                        <v-expansion-panel-content id="expanded-content">
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
                      <v-col cols="12" lg="2">
                        <div class="info-label">Data de extinção</div>
                      </v-col>
                      <v-col cols="12" lg="10">
                        <div
                          class="info-content px-8 pb-2 mt-n1"
                          style="min-height: 50px; padding-top: 0 !important;"
                        >
                          <SelecionarData
                            :d="entidade.dataExtincao"
                            :label="'Data: AAAA-MM-DD'"
                            @dataSelecionada="entidade.dataExtincao = $event"
                          />
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-card-text>
          <v-snackbar
            v-model="snackbar"
            :timeout="8000"
            color="error"
            :top="true"
          >
            {{ text }}
            <v-btn icon color="white" @click="fecharSnackbar">
              <unicon
                name="remove-icon"
                width="15"
                height="15"
                viewBox="0 0 20.71 20.697"
                fill="#ffffff"
              />
            </v-btn>
          </v-snackbar>
        </v-card>
        <!-- Painel Operações -->
        <PainelOpsEnt
          v-if="etapa === 2"
          :e="entidade"
          :original="entidadeOriginal"
          :acao="acao"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DesSelTip from '@/components/generic/selecao/DesSelecionarTipologias.vue';
import SelTip from '@/components/generic/selecao/SelecionarTipologias.vue';
import PainelOpsEnt from '@/components/entidades/PainelOperacoesEntidades.vue';
import SelecionarData from '@/components/generic/SelecionarData';

export default {
  props: ['e'],
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
        designacao: '',
        sigla: '',
        internacional: '',
        sioe: '',
        dataCriacao: '',
        dataExtincao: '',
        tipologiasSel: [],
      },
      entidadeOriginal: {},
      acao: 'Alteração',

      // Para o seletor de processos
      tipologias: [],
      tipSel: [],
      tipologiasReady: false,

      regraSIOE: [
        (v) => /^\d+$/.test(v) || 'Apenas são aceites caracteres numéricos.',
      ],

      snackbar: false,
      text: '',
    };
  },

  methods: {
    goBack() {
      this.$router.push('/entidades');
    },
    // Vai à API buscar todas as tipologias
    loadTipologias: async function() {
      try {
        let response = await this.$request('get', '/tipologias/');

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
      this.text = 'Erro ao carregar os dados, por favor tente novamente';
      this.snackbar = true;
    }
  },
};
</script>

<style scoped>
#stepper-card {
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22);
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
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px;
}

.separador {
  color: white;
  padding: 5px;
  margin: 5px;
  font-weight: 400;
  width: 100%;
  min-height: 50px;
  background: linear-gradient(to right, #19237e 0%, #0056b6 100%) !important;
  font-size: 14pt;
  font-weight: bold;
  border-radius: 10px 10px 0 0;
}

#expanded-content {
  margin-left: 0.3rem;
  margin-top: -1.1rem;
  border: 1px solid #dee2f8;
  border-radius: 0 0 10px 10px;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.12);
}
</style>
