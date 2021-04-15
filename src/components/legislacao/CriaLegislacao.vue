<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">Novo Diploma</p>

    <!-- Content -->
    <v-card-text>
      <Campo
        nome="Tipo de diploma"
        infoHeader="Tipo de diploma"
        :infoBody="myhelp.Legislacao.Campos.Tipo"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-select
            filled
            item-color="indigo"
            color="indigo"
            v-model="legislacao.tipo"
            :items="tiposDiploma"
            label="Selecione uma opção"
            hide-details
            dense
          />
        </template>
      </Campo>

      <Campo
        nome="Número de diploma"
        infoHeader="Número de diploma"
        :infoBody="myhelp.Legislacao.Campos.Numero"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-text-field
            filled
            label="Número do diploma"
            clearable
            color="indigo"
            single-line
            v-model="legislacao.numero"
            dense
            hide-details
          ></v-text-field>
        </template>
      </Campo>

      <Campo
        nome="Data do diploma"
        infoHeader="Data do diploma"
        :infoBody="myhelp.Legislacao.Campos.Data"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <SelecionarData
            :d="legislacao.data"
            :label="'Data: AAAA-MM-DD'"
            @dataSelecionada="legislacao.data = $event"
          />
        </template>
      </Campo>

      <Campo
        nome="Sumário"
        infoHeader="Sumário"
        :infoBody="myhelp.Legislacao.Campos.Sumário"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-text-field
            filled
            label="Sumário"
            clearable
            color="indigo"
            single-line
            v-model="legislacao.sumario"
            hide-details
            dense
          ></v-text-field>
        </template>
      </Campo>

      <Campo
        nome="Link"
        infoHeader="Link"
        :infoBody="myhelp.Legislacao.Campos.Link"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-text-field
            v-model="legislacao.link"
            filled
            label="Link"
            clearable
            color="indigo"
            single-line
            hide-details
            dense
          ></v-text-field>
        </template>
      </Campo>

      <Campo
        nome="Tipo de fonte de legitimação"
        infoHeader="Tipo de fonte de legitimação"
        :infoBody="myhelp.Legislacao.Campos.FonteLegitimacao"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <v-select
            filled
            label="Selecione uma opção"
            item-color="indigo"
            color="indigo"
            v-model="legislacao.diplomaFonte"
            :items="diplomaFonteTipo"
            dense
            hide-details
          />
        </template>
      </Campo>

      <Campo
        nome="Data de revogação"
        infoHeader="Data de revogação"
        :infoBody="myhelp.Legislacao.Campos.DataRevogacao"
        color="neutralpurple"
      >
        <template v-slot:conteudo>
          <SelecionarData
            :d="legislacao.dataRevogacao"
            :label="'Data: AAAA-MM-DD'"
            @dataSelecionada="legislacao.dataRevogacao = $event"
          />
        </template>
      </Campo>

      <!-- Blocos expansivos -->
      <v-expansion-panels>
        <PainelCLAV
          titulo="Entidade responsável pela publicação"
          icon="mdi-bank"
          infoHeader="Selecionar entidades"
          :infoBody="myhelp.Tipologias.Campos.Entidades"
        >
          <template v-slot:conteudo>
            <DesSelEnt
              :entidades="entSel"
              tipo="legislacao"
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

        <!-- Segundo bloco expansivo -->

        <PainelCLAV
          titulo="Processos de negócio que regula ou enquadra"
          icon="mdi-file-multiple"
          infoHeader="Selecionar processos"
          :infoBody="myhelp.Tipologias.Campos.ProcessosRegulados"
        >
          <template v-slot:conteudo>
            <DesSelProc
              :processos="procSel"
              @unselectProcesso="unselectProcesso($event)"
            />

            <hr style="border-top: 1px dashed #dee2f8" />

            <SelProc
              :processosReady="processosReady"
              :processos="processos"
              @selectProcesso="selectProcesso($event)"
            />
          </template>
        </PainelCLAV>
      </v-expansion-panels>
      <!-- Painel Operações -->
      <PainelOpsLeg :l="legislacao" :acao="'Criação'" />
    </v-card-text>
    <v-snackbar v-model="snackbar" :timeout="8000" color="error" :top="true">
      {{ text }}
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import SelecionarData from "@/components/generic/SelecionarData";
import DesSelEnt from "@/components/generic/selecao/DesSelecionarEntidades.vue";
import SelEnt from "@/components/generic/selecao/SelecionarEntidades.vue";

import DesSelProc from "@/components/generic/selecao/DesSelecionarPNs.vue";
import SelProc from "@/components/generic/selecao/SelecionarPNs.vue";

import PainelOpsLeg from "@/components/legislacao/PainelOperacoesLegislacao";

import InfoBox from "@/components/generic/infoBox.vue";
import Campo from "@/components/generic/Campo.vue";
import PainelCLAV from "@/components/generic/PainelCLAV.vue";
const help = require("@/config/help").help;

export default {
  data() {
    return {
      myhelp: help,
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
        processosSel: [],
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
        (v) => /[0-9]+(-\w)?\/[0-9]+$/.test(v) || "Este campo está no formato errado.",
      ],

      // para mostrar mensagens de erro
      snackbar: false,
      text: "",
    };
  },

  components: {
    DesSelEnt,
    SelEnt,
    DesSelProc,
    SelProc,
    PainelOpsLeg,
    SelecionarData,
    InfoBox,
    Campo,
    PainelCLAV,
  },

  methods: {
    // Vai a API buscar todos os tipos de diplomas legislativos
    loadTipoDiploma: async function () {
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

    unselectEntidade: function (entidade) {
      // Recoloca a entidade nos selecionáveis
      this.entidades.push(entidade);
      let index = this.entSel.findIndex((e) => e.id === entidade.id);
      this.entSel.splice(index, 1);
      this.legislacao.entidadesSel = this.entSel;
    },

    selectEntidade: function (entidade) {
      this.entSel.push(entidade);
      this.legislacao.entidadesSel = this.entSel;
      // Remove dos selecionáveis
      let index = this.entidades.findIndex((e) => e.id === entidade.id);
      this.entidades.splice(index, 1);
    },

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

    unselectProcesso: function (processo) {
      // Recoloca o processo nos selecionáveis
      this.processos.push(processo);
      let index = this.procSel.findIndex((e) => e.id === processo.id);
      this.procSel.splice(index, 1);
      this.legislacao.processosSel = this.procSel;
    },

    selectProcesso: function (processo) {
      this.procSel.push(processo);
      this.legislacao.processosSel = this.procSel;
      // Remove dos selecionáveis
      let index = this.processos.findIndex((e) => e.id === processo.id);
      this.processos.splice(index, 1);
    },

    // Vai à API buscar todas as classes de nivel 3
    loadClasses: async function () {
      try {
        let response = await this.$request("get", "/classes?nivel=3");
        this.processos = response.data.map(function (item) {
          return {
            codigo: item.codigo,
            titulo: item.titulo,
            id: item.codigo,
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
  },

  created: function () {
    this.loadTipoDiploma();
    this.loadEntidades();
    this.loadClasses();
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
