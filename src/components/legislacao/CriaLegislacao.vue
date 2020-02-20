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
                maxlength="11"
                placeholder=" NNNNNN/AAAA"
                :rules="regraNumero"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Data</div>
            </v-col>
            <v-col>
              <v-menu
                ref="open"
                v-model="open"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    solo
                    v-model="legislacao.data"
                    hint="AAAA/MM/DD"
                    persistent-hint
                    @blur="date = parseDate(dateFormatted)"
                    v-on="on"
                    :rules="regraData"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  no-title
                  @input="open = false"
                  :max="date"
                ></v-date-picker>
              </v-menu>
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
              <v-expansion-panel-header class="expansion-panel-heading"
                >Entidade responsável pela publicação</v-expansion-panel-header
              >
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
              <v-expansion-panel-header class="expansion-panel-heading"
                >Processos de negócio que regula ou
                enquadra</v-expansion-panel-header
              >
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
      diplomaFonte: "Não especificada",
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

    // vuetify datepicker
    date: new Date().toISOString().substr(0, 10),
    dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    open: false,

    // Para o seletor de processos
    processos: [],
    procSel: [],
    processosReady: false,

    // regras para submissão
    regraNumero: [
      v =>
        /[0-9]+(-\w)?\/[0-9]+$/.test(v) || "Este campo está no formato errado."
    ],
    regraData: [
      v =>
        /[0-9]+\/[0-9]+\/[0-9]+/.test(v) || "Este campo está no formato errado."
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
    PainelOpsLeg
  },

  // vuetify datepicker
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    }
  },

  watch: {
    date(val) {
      this.legislacao.data = this.formatDate(this.date);
      this.dateFormatted = this.formatDate(this.date);
    }
  },

  methods: {
    // vuetify datepicker
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${year}/${month}/${day}`;
    },

    parseDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },

    // Vai a API buscar todos os tipos de diplomas legislativos
    loadTipoDiploma: async function() {
      try {
        let response = await this.$request(
          "get",
          "/api/vocabularios/vc_tipoDiplomaLegislativo"
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
        let response = await this.$request("get", "/api/entidades");
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
    this.legislacao.data = this.dateFormatted;
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
