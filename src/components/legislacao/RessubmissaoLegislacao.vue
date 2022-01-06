<template>
  <v-card flat class="pa-3">
    <!-- Header -->
    <v-row align="center" justify="center">
      <v-col cols="12" sm="3" align="center" justify="center">
        <Voltar />
      </v-col>
      <v-col cols="12" sm="9" align="center" justify="center">
        <p class="clav-content-title-1">Ressubmeter Diploma</p>
        <p class="clav-content-title-2">
          {{ legislacaoOriginal.tipo }} -
          {{ legislacaoOriginal.numero }}
        </p>
      </v-col>
    </v-row>

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
        class="mb-2"
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
        <PainelCLAV titulo="Entidade responsável pela publicação" icon="mdi-bank">
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
          icon="mdi-inbox-multiple-outline"
        >
          <template v-slot:conteudo
            ><DesSelProc
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
      <!-- j  -->
    </v-card-text>
    <v-snackbar v-model="snackbar" :timeout="8000" color="error" :top="true">
      {{ text }}
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>

    <!-- Painel Operações -->
    <PainelOpsLeg
      :l="legislacao"
      :original="legislacaoOriginal"
      :acao="acao"
      :pedido="l"
    />
  </v-card>
</template>

<script>
import SelecionarData from "@/components/generic/SelecionarData";
import DesSelEnt from "@/components/generic/selecao/DesSelecionarEntidades.vue";
import SelEnt from "@/components/generic/selecao/SelecionarEntidades.vue";

import DesSelProc from "@/components/generic/selecao/DesSelecionarPNs.vue";
import SelProc from "@/components/generic/selecao/SelecionarPNs.vue";

import PainelOpsLeg from "@/components/legislacao/PainelOperacoesLegislacao";
import Voltar from "@/components/generic/Voltar";
import Campo from "@/components/generic/CampoCLAV";
import PainelCLAV from "@/components/generic/PainelCLAV";
const help = require("@/config/help").help;

export default {
  props: ["l"],

  components: {
    SelecionarData,
    DesSelEnt,
    SelEnt,
    DesSelProc,
    SelProc,
    PainelOpsLeg,
    Voltar,
    Campo,
    PainelCLAV,
  },

  data() {
    return {
      myhelp: help,
      legislacao: {
        numero: "",
        sumario: "",
        tipo: "",
        data: "",
        link: "",
        dataRevogacao: "",
        entidadesSel: [],
        processosSel: [],
      },
      diplomaFonteTipo: ["Não especificada", "PGD", "PGD/LC", "RADA"],
      legislacaoOriginal: {},
      acao: "Criação",

      tiposDiploma: [],

      // Para o seletor de entidades
      entidades: [],
      entSel: [],
      entidadesReady: false,

      tipoReady: true,

      // Para o seletor de processos
      processos: [],
      procSel: [],
      processosReady: false,

      // para mostrar mensagens de erro
      snackbar: false,
      text: "",
    };
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
        this.tipoReady = false;
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
        this.entidades = response.data.map((item) => {
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
            id: item.id.split("#")[1],
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

  async created() {
    this.legislacao = JSON.parse(JSON.stringify(this.l.objeto.dados));
    this.legislacaoOriginal = JSON.parse(JSON.stringify(this.l.objeto.dados));
    this.acao = this.l.objeto.acao;

    await this.loadTipoDiploma();
    await this.loadEntidades();
    await this.loadClasses();

    try {
      if (this.legislacao.entidadesSel.length != 0) {
        this.legislacao.entidadesSel.forEach((ent) => {
          this.entSel.push(ent);

          // Remove dos selecionáveis
          let index = this.entidades.findIndex((e) => {
            return e.id === ent.id;
          });
          this.entidades.splice(index, 1);
        });
      }
    } catch (e) {
      this.text = "Erro ao carregar os dados, por favor tente novamente";
      this.snackbar = true;
    }

    try {
      if (this.legislacao.processosSel.length != 0) {
        this.legislacao.processosSel.forEach((proc) => {
          this.procSel.push(proc);

          // Remove dos selecionáveis
          let index = this.processos.findIndex((p) => p.id === proc.id);
          this.processos.splice(index, 1);
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
