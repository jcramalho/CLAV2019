<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="indigo darken-4" dark>
          <v-toolbar-title class="card-heading">Novo Diploma</v-toolbar-title>
        </v-app-bar>

        <!-- Content -->
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Tipo de diploma</div>
            </v-col>
            <v-col>
              <v-select
                item-color="indigo"
                color="indigo"
                v-model="legislacao.tipo"
                :items="tiposDiploma"
                label="Selecione uma opção"
                solo
                dense
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Número de diploma</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="indigo"
                single-line
                v-model="legislacao.numero"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Data do diploma</div>
            </v-col>
            <v-col>
              <SelecionarData
                :d="legislacao.data"
                @dataSelecionada="legislacao.data = $event"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Sumário</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="indigo"
                single-line
                v-model="legislacao.sumario"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Link</div>
            </v-col>
            <v-col>
              <v-text-field
                v-model="legislacao.link"
                solo
                clearable
                color="indigo"
                single-line
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Tipo de fonte de legitimação</div>
            </v-col>
            <v-col>
              <v-select
                item-color="indigo"
                color="indigo"
                v-model="legislacao.diplomaFonte"
                :items="diplomaFonteTipo"
                solo
                dense
              />
            </v-col>
          </v-row>

          <!-- Blocos expansivos -->
          <v-expansion-panels>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <div>
                  Entidade responsável pela publicação
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
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
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header class="expansion-panel-heading">
                <div>
                  Processos de negócio que regula ou enquadra
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
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
          <v-btn text @click="fecharSnackbar">Fechar</v-btn>
        </v-snackbar>
      </v-card>

      <!-- Painel Operações -->
      <PainelOpsLeg :l="legislacao" :acao="'Criação'" />
    </v-col>
  </v-row>
</template>

<script>
import SelecionarData from "@/components/generic/SelecionarData";
import DesSelEnt from "@/components/generic/selecao/DesSelecionarEntidades.vue";
import SelEnt from "@/components/generic/selecao/SelecionarEntidades.vue";

import DesSelProc from "@/components/generic/selecao/DesSelecionarPNs.vue";
import SelProc from "@/components/generic/selecao/SelecionarPNs.vue";

import PainelOpsLeg from "@/components/legislacao/PainelOperacoesLegislacao";

export default {
  data: vm => ({
    legislacao: {
      numero: "",
      sumario: "",
      tipo: "",
      data: "",
      link: "",
      diplomaFonte: "Não aplicável",
      entidadesSel: [],
      processosSel: [],
      codigo: ""
    },

    tiposDiploma: [],

    diplomaFonteTipo: ["Não aplicável", "PGD", "PGD/LC", "RADA"],

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
        /[0-9]+(-\w)?\/[0-9]+$/.test(v) || "Este campo está no formato errado."
    ],

    // para mostrar mensagens de erro
    snackbar: false,
    text: ""
  }),

  components: {
    DesSelEnt,
    SelEnt,
    DesSelProc,
    SelProc,
    PainelOpsLeg,
    SelecionarData
  },

  methods: {
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
