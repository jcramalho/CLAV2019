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
            'px-2': $vuetify.breakpoint.mdAndDown
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
            Novo Diploma
          </p>
          <!-- Content -->
          <v-card-text class="px-8">
            <v-row>
              <v-col cols="12" lg="2">
                <div class="info-label">Tipo de diploma</div>
              </v-col>
              <v-col cols="12" lg="10">
                <div class="info-content pa-5" style="min-height: 50px;">
                  <v-select
                    class="mt-n5 px-3"
                    v-model="legislacao.tipo"
                    :items="tiposDiploma"
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
                'mt-4': $vuetify.breakpoint.mdAndUp
              }"
            >
              <v-col cols="12" lg="2">
                <div class="info-label">Número de diploma</div>
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
                    color="blue darken-3"
                    label="Número do diploma"
                    v-model="legislacao.numero"
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>

            <v-row
              :class="{
                'mt-5': $vuetify.breakpoint.smAndDown,
                'mt-4': $vuetify.breakpoint.mdAndUp
              }"
            >
              <v-col cols="12" lg="2">
                <div class="info-label">Data do diploma</div>
              </v-col>
              <v-col cols="12" lg="10">
                <div
                  class="info-content px-8 pb-2 mt-n1"
                  style="min-height: 50px; padding-top: 0 !important;"
                >
                  <SelecionarData
                    :d="legislacao.data"
                    :label="'Data: AAAA-MM-DD'"
                    @dataSelecionada="legislacao.data = $event"
                  />
                </div>
              </v-col>
            </v-row>

            <v-row
              :class="{
                'mt-5': $vuetify.breakpoint.smAndDown,
                'mt-4': $vuetify.breakpoint.mdAndUp
              }"
            >
              <v-col cols="12" lg="2">
                <div class="info-label">Sumário</div>
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
                    label="Sumário"
                    color="blue darken-3"
                    v-model="legislacao.sumario"
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>

            <v-row
              :class="{
                'mt-5': $vuetify.breakpoint.smAndDown,
                'mt-4': $vuetify.breakpoint.mdAndUp
              }"
            >
              <v-col cols="12" lg="2">
                <div class="info-label">Link</div>
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
                    label="Link"
                    color="blue darken-3"
                    v-model="legislacao.link"
                  ></v-text-field>
                </div>
              </v-col>
            </v-row>

            <v-row
              :class="{
                'mt-5': $vuetify.breakpoint.smAndDown,
                'mt-4': $vuetify.breakpoint.mdAndUp
              }"
            >
              <v-col cols="12" lg="2">
                <div class="info-label">Tipo de fonte de legitimação</div>
              </v-col>
              <v-col cols="12" lg="10">
                <div class="info-content pa-5" style="min-height: 50px;">
                  <v-select
                    class="mt-n5 px-3"
                    label="Selecione uma opção"
                    color="blue darken-3"
                    clearable
                    hide-details
                    single-line
                    v-model="legislacao.diplomaFonte"
                    :items="diplomaFonteTipo"
                  />
                </div>
              </v-col>
            </v-row>
            <v-row
              :class="{
                'mt-5': $vuetify.breakpoint.smAndDown,
                'mt-4': $vuetify.breakpoint.mdAndUp
              }"
            >
              <v-col cols="12" lg="2">
                <div class="info-label">Data de revogação</div>
              </v-col>
              <v-col cols="12" lg="10">
                <div
                  class="info-content px-8 pb-2 mt-n1"
                  style="min-height: 50px; padding-top: 0 !important;"
                >
                  <SelecionarData
                    :d="legislacao.dataRevogacao"
                    :label="'Data: AAAA-MM-DD'"
                    @dataSelecionada="legislacao.dataRevogacao = $event"
                  />
                </div>
              </v-col>
            </v-row>

            <!-- Blocos expansivos -->
            <v-expansion-panels flat class="mb-4">
              <v-expansion-panel popout class="mt-6">
                <v-expansion-panel-header
                  style="outline: none;"
                  :class="{
                    'text-center': $vuetify.breakpoint.smAndDown,
                    'text-left': $vuetify.breakpoint.mdAndUp
                  }"
                  class="pa-0"
                >
                  <div
                    :class="{
                      'px-3': $vuetify.breakpoint.mdAndUp
                    }"
                    class="separador"
                  >
                    <unicon
                      class="mt-3"
                      name="entidade-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20.711 21.105"
                      fill="#ffffff"
                    />
                    <span class="ml-3 mr-1">
                      Entidade responsável pela publicação</span
                    >
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content id="expanded-content">
                  <DesSelEnt
                    :entidades="entSel"
                    tipo="legislacao"
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

              <!-- Segundo bloco expansivo -->
              <v-expansion-panel popout class="mt-6">
                <v-expansion-panel-header
                  style="outline: none;"
                  :class="{
                    'text-center': $vuetify.breakpoint.smAndDown,
                    'text-left': $vuetify.breakpoint.mdAndUp
                  }"
                  class="pa-0"
                >
                  <div
                    :class="{
                      'px-3': $vuetify.breakpoint.mdAndUp
                    }"
                    class="separador"
                  >
                    <unicon
                      class="mt-3"
                      name="legislacao-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 20.71 23.668"
                      fill="#ffffff"
                    />
                    <span class="ml-3 mr-1"
                      >Processos de negócio que regula ou enquadra</span
                    >
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content id="expanded-content">
                  <DesSelProc
                    :processos="procSel"
                    @unselectProcesso="unselectProcesso($event)"
                  />

                  <hr style="border-top: 1px dashed #dee2f8;" />

                  <SelProc
                    :processosReady="processosReady"
                    :processos="processos"
                    @selectProcesso="selectProcesso($event)"
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
        <PainelOpsLeg :l="legislacao" :acao="'Criação'" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SelecionarData from "@/components/generic/SelecionarData";
import DesSelEnt from "@/components/generic/selecao/DesSelecionarEntidades.vue";
import SelEnt from "@/components/generic/selecao/SelecionarEntidades.vue";

import DesSelProc from "@/components/generic/selecao/DesSelecionarPNs.vue";
import SelProc from "@/components/generic/selecao/SelecionarPNs.vue";

import PainelOpsLeg from "@/components/legislacao/PainelOperacoesLegislacao";

export default {
  data() {
    return {
      legislacao: {
        numero: "",
        sumario: "",
        tipo: "",
        data: "",
        link: "",
        diplomaFonte: "Não especificada",
        dataRevogacao: "",
        estado: "Ativo",
        entidadesSel: [],
        processosSel: []
      },

      tiposDiploma: [],

      diplomaFonteTipo: ["Não especificada", "PGD", "PGD/LC", "RADA"],

      // Para o seletor de entidades
      entidades: [],
      entSel: [],
      entidadesReady: false,

      // Para o seletor de processos
      processos: [],
      procSel: [],
      processosReady: false,

      // regras para submissão
      regraNumero: [
        v =>
          /[0-9]+(-\w)?\/[0-9]+$/.test(v) ||
          "Este campo está no formato errado."
      ],

      // para mostrar mensagens de erro
      snackbar: false,
      text: ""
    };
  },

  components: {
    DesSelEnt,
    SelEnt,
    DesSelProc,
    SelProc,
    PainelOpsLeg,
    SelecionarData
  },

  methods: {
    goBack() {
      this.$router.push("/legislacao");
    },
    // Vai a API buscar todos os tipos de diplomas legislativos
    loadTipoDiploma: async function() {
      try {
        let response = await this.$request(
          "get",
          "/vocabularios/vc_tipoDiplomaLegislativo"
        );
        for (let i = 0; i < response.data.length; i++) {
          this.tiposDiploma[i] = response.data[i].termo;
        }
        this.tiposDiploma.sort();
      } catch (error) {
        return error;
      }
    },

    unselectEntidade: function(entidade) {
      // Recoloca a entidade nos selecionáveis
      this.entidades.push(entidade);
      let index = this.entSel.findIndex(e => e.id === entidade.id);
      this.entSel.splice(index, 1);
      this.legislacao.entidadesSel = this.entSel;
    },

    selectEntidade: function(entidade) {
      this.entSel.push(entidade);
      this.legislacao.entidadesSel = this.entSel;
      // Remove dos selecionáveis
      let index = this.entidades.findIndex(e => e.id === entidade.id);
      this.entidades.splice(index, 1);
    },

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

    unselectProcesso: function(processo) {
      // Recoloca o processo nos selecionáveis
      this.processos.push(processo);
      let index = this.procSel.findIndex(e => e.id === processo.id);
      this.procSel.splice(index, 1);
      this.legislacao.processosSel = this.procSel;
    },

    selectProcesso: function(processo) {
      this.procSel.push(processo);
      this.legislacao.processosSel = this.procSel;
      // Remove dos selecionáveis
      let index = this.processos.findIndex(e => e.id === processo.id);
      this.processos.splice(index, 1);
    },

    // Vai à API buscar todas as classes de nivel 3
    loadClasses: async function() {
      try {
        let response = await this.$request("get", "/classes?nivel=3");
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
    this.loadTipoDiploma();
    this.loadEntidades();
    this.loadClasses();
  }
};
</script>

<style scoped>
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
