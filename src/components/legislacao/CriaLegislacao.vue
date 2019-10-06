<template>
  <v-row class="ma-1">
    <v-col>
      <v-card>
        <!-- Header -->
        <v-app-bar color="green darken-4" dark>
          <v-toolbar-title class="card-heading">Novo Diploma</v-toolbar-title>
        </v-app-bar>

        <!-- Content -->
        <v-card-text>
          <v-row>
            <v-col cols="2">
              <div class="info-label">Tipo de diploma:</div>
            </v-col>
            <v-col>
              <v-select
                item-color="green"
                color="green"
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
              <div class="info-label">Número de diploma:</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="green"
                counter="11"
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
              <div class="info-label">Data:</div>
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
                <v-date-picker v-model="date" no-title @input="open = false" :max="date"></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Sumário:</div>
            </v-col>
            <v-col>
              <v-text-field
                solo
                clearable
                color="green"
                counter="150"
                single-line
                v-model="legislacao.sumario"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div class="info-label">Link:</div>
            </v-col>
            <v-col>
              <v-text-field v-model="legislacao.link" solo clearable color="green" single-line></v-text-field>
            </v-col>
          </v-row>

          <!-- Blocos expansivos -->
          <v-expansion-panels>
            <v-expansion-panel popout focusable>
              <v-expansion-panel-header
                class="expansion-panel-heading"
              >Entidade responsável pela publicação</v-expansion-panel-header>
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
              <v-expansion-panel-header
                class="expansion-panel-heading"
              >Processos de negócio que regula ou enquadra</v-expansion-panel-header>
              <v-expansion-panel-content>
                <DesSelProc :processos="procSel" @unselectProcesso="unselectProcesso($event)" />

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
        <v-snackbar v-model="snackbar" :timeout="8000" color="error" :top="true">
          {{ text }}
          <v-btn text @click="fecharSnackbar">Fechar</v-btn>
        </v-snackbar>
      </v-card>

      <!-- Botão -->
      <v-row>
        <v-col class="text-center">
          <v-btn
            class="white--text"
            medium
            rounded
            color="#388E3C"
            :disabled="!(legislacao.sumario && legislacao.numero)"
            @click="submeter()"
          >Submeter Diploma</v-btn>
        </v-col>
      </v-row>

      <!-- Painel Operações -->
      <PainelOpsLeg :l="legislacao" />
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
      entidades: [],
      processos: []
    },

    tiposDiploma: [],

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
        var response = await this.$request(
          "get",
          "/api/vocabularios/vc_tipoDiplomaLegislativo"
        );
        for (var i = 0; i < response.data.length; i++) {
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
      var index = this.entSel.findIndex(e => e.id === entidade.id);
      this.entSel.splice(index, 1);
    },

    selectEntidade: function(entidade) {
      this.entSel.push(entidade);
      // Remove dos selecionáveis
      var index = this.entidades.findIndex(e => e.id === entidade.id);
      this.entidades.splice(index, 1);
    },

    // Vai à API buscar todas as entidades
    loadEntidades: async function() {
      try {
        var response = await this.$request("get", "/api/entidades");
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
      var index = this.procSel.findIndex(e => e.id === processo.id);
      this.procSel.splice(index, 1);
    },

    selectProcesso: function(processo) {
      this.procSel.push(processo);
      // Remove dos selecionáveis
      var index = this.processos.findIndex(e => e.id === processo.id);
      this.processos.splice(index, 1);
    },

    // Vai à API buscar todas as classes de nivel 3
    loadClasses: async function() {
      try {
        var response = await this.$request("get", "/api/classes?nivel=3");
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
    },

    submeter: async function() {
      if (this.$store.state.name === "") {
        this.text = "Precisa de fazer login para criar a Legislação";
        this.snackbar = true;
        return false;
      }

      for (var i = 0; i < this.entSel.length; i++) {
        this.legislacao.entidades[i] = this.entSel[i].id;
      }

      for (var j = 0; j < this.procSel.length; j++) {
        this.legislacao.processos[j] = this.procSel[j].id;
      }

      // testes aos campos numero e data
      var parseAno = this.legislacao.numero.split("/");
      var anoDiploma = parseInt(parseAno[1]);

      if (!/[0-9]+(-\w)?\/[0-9]+$/.test(this.legislacao.numero)) {
        this.text = "O campo 'Número' está no formato errado.";
        this.snackbar = true;
        return false;
      }

      if (anoDiploma < 2000) {
        if (!/[0-9]+(-\w)?\/[0-9]\d{1}$/.test(this.legislacao.numero)) {
          this.text =
            "Anos de diploma anteriores a 2000 devem ter apenas os dois últimos dígitos!";
          this.snackbar = true;
          return false;
        }
      }

      this.legislacao.data = this.dateFormatted;

      if (!/[0-9]+\/[0-9]+\/[0-9]+/.test(this.legislacao.data)) {
        this.text = "O campo 'Data' está no formato errado.";
        this.snackbar = true;
        return false;
      }

      var date = new Date();

      var ano = parseInt(this.legislacao.data.slice(0, 4));
      var mes = parseInt(this.legislacao.data.slice(5, 7));
      var dia = parseInt(this.legislacao.data.slice(8, 10));

      var dias = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      if (mes > 12) {
        this.text = "Mês inválido!";
        this.snackbar = true;
        return false;
      }
      if (dia > dias[mes - 1]) {
        if (!(ano % 4 == 0 && mes == 2 && dia == 29)) {
          this.text = "Dia do mês inválido!";
          this.snackbar = true;
          return false;
        }
      }

      if (anoDiploma > parseInt(date.getFullYear())) {
        this.text = "Ano de Diploma inválido!";
        this.snackbar = true;
        return false;
      }
      if (ano > parseInt(date.getFullYear())) {
        this.text =
          "Ano inválido! Por favor selecione uma data anterior à atual";
        this.snackbar = true;
        return false;
      }
      if (
        ano == parseInt(date.getFullYear()) &&
        mes > parseInt(date.getMonth() + 1)
      ) {
        this.text =
          "Mês inválido! Por favor selecione uma data anterior à atual";
        this.snackbar = true;
        return false;
      }
      if (
        ano == parseInt(date.getFullYear()) &&
        mes == parseInt(date.getMonth() + 1) &&
        dia > parseInt(date.getDate())
      ) {
        this.text =
          "Dia inválido! Por favor selecione uma data anterior à atual";
        this.snackbar = true;
        return false;
      }

      if (
        !/https?:\/\/.+/.test(this.legislacao.link) &&
        this.legislacao.link != ""
      ) {
        this.legislacao.link = "http://" + this.legislacao.link;
      }

      var dataObj = this.legislacao;

      var userBD = await this.request(
        "get",
        "/api/users/listarToken/" + this.$store.state.token
      );
      var pedidoParams = {
        tipoPedido: "Criação",
        tipoObjeto: "Legislação",
        novoObjeto: dataObj,
        user: { email: userBD.data.email },
        token: this.$store.state.token
      };

      var response = await this.$request("post", "/api/pedidos", pedidoParams);
      this.$router.push("/pedidos/submissao");

      /*this.$request("post", "/api/legislacao/", dataObj)
        .then(res => {
          this.$router.push("/pedidos/submissao");
        })
        .catch(err => {
          if (err.response.status === 409) {
            this.text =
              "Já existe uma legislação com o número" + this.legislacao.numero;
            this.color = "error";
            this.snackbar = true;
          }
          if (err.response.status === 500) {
            this.text = "Ocorreu um erro na criação desta entidade";
            this.color = "error";
            this.snackbar = true;
          }
        });*/
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
