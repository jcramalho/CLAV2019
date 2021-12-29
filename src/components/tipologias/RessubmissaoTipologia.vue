<template>
  <v-card flat class="pa-3">
    <!-- Header -->
    <v-row align="center" justify="center">
      <v-col cols="12" sm="3" align="center" justify="center">
        <Voltar />
      </v-col>
      <v-col cols="12" sm="9" align="center" justify="center">
        <p class="clav-content-title-1">Ressubmeter Tipologia de Entidade</p>
        <p class="clav-content-title-2">
          {{ tipologiaOriginal.sigla }} -
          {{ tipologiaOriginal.designacao }}
        </p>
      </v-col>
    </v-row>

    <!-- Content -->
    <v-card-text>
      <Campo nome="Nome da Tipologia" color="neutralpurple" class="mb-3">
        <template v-slot:conteudo>
          <v-text-field
            filled
            clearable
            color="indigo"
            hide-details
            dense
            v-model="tipologia.designacao"
          ></v-text-field>
        </template>
      </Campo>

      <Campo nome="Sigla" color="neutralpurple" class="mb-3">
        <template v-slot:conteudo>
          <v-text-field
            filled
            clearable
            color="indigo"
            hide-details
            dense
            v-model="tipologia.sigla"
          ></v-text-field>
        </template>
      </Campo>

      <!-- Blocos expansivos -->
      <v-expansion-panels>
        <PainelCLAV titulo="Entidades" icon="mdi-home-city-outline">
          <template v-slot:conteudo>
            <DesSelEnt
              :entidades="entSel"
              tipo="tipologias"
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
      </v-expansion-panels>
    </v-card-text>
    <v-snackbar v-model="snackbar" :timeout="8000" color="error" :top="true">
      {{ text }}
      <v-btn text @click="fecharSnackbar">Fechar</v-btn>
    </v-snackbar>
    <!-- Painel Operações -->
    <PainelOpsTip :t="tipologia" :original="tipologiaOriginal" :pedido="t" :acao="acao" />
  </v-card>
</template>

<script>
import DesSelEnt from "@/components/generic/selecao/DesSelecionarEntidades.vue";
import SelEnt from "@/components/generic/selecao/SelecionarEntidades.vue";
import PainelOpsTip from "@/components/tipologias/PainelOperacoesTipologias";
import PainelCLAV from "@/components/generic/PainelCLAV";
import Campo from "@/components/generic/CampoCLAV";
import Voltar from "@/components/generic/Voltar";

export default {
  props: ["t"],

  data: () => ({
    tipologia: {
      designacao: "",
      sigla: "",
      entidadesSel: [],
    },
    tipologiaOriginal: {},
    acao: "Criação",

    // Para o seletor
    entidades: [],
    entSel: [],
    entidadesReady: false,

    snackbar: false,
    text: "",
  }),
  components: {
    DesSelEnt,
    SelEnt,
    PainelOpsTip,
    PainelCLAV,
    Campo,
    Voltar,
  },

  methods: {
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

    unselectEntidade: function (entidade) {
      // Recoloca a entidade nos selecionáveis
      this.entidades.push(entidade);
      let index = this.entSel.findIndex((e) => e.id === entidade.id);
      this.entSel.splice(index, 1);
      this.tipologia.entidadesSel = this.entSel;
    },

    selectEntidade: function (entidade) {
      this.entSel.push(entidade);
      this.tipologia.entidadesSel = this.entSel;
      // Remove dos selecionáveis
      let index = this.entidades.findIndex((e) => e.id === entidade.id);
      this.entidades.splice(index, 1);
    },

    // fechar o snackbar em caso de erro
    fecharSnackbar() {
      this.snackbar = false;
    },
  },

  created: async function () {
    this.tipologia = JSON.parse(JSON.stringify(this.t.objeto.dados));
    this.tipologiaOriginal = JSON.parse(JSON.stringify(this.t.objeto.dados));
    this.acao = this.t.objeto.acao;

    await this.loadEntidades();

    try {
      if (this.tipologia.entidadesSel.length !== 0) {
        this.tipologia.entidadesSel.forEach((ent) => {
          this.entSel.push(ent);

          // Remove dos selecionáveis
          let index = this.entidades.findIndex((e) => e.id === ent.id);
          this.entidades.splice(index, 1);
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
