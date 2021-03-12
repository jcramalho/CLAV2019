<template>
  <v-main class="px-12">
    <Loading v-if="!tipologiaReady" :message="'tipologias'" />
    <Listagem
      v-else
      :lista="tipologias"
      tipo="Tipologias de Entidade"
      :cabecalho="cabecalhos"
      :campos="campos"
    />
  </v-main>
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import Loading from "@/components/generic/Loading";

import { NIVEL_MINIMO_ALTERAR } from "@/utils/consts";

export default {
  data: () => ({
    tipologias: [],
    campos: [],
    cabecalhos: [],
    operacoes: [],
    tipologiaReady: false,
  }),

  components: {
    Listagem,
    Loading,
  },

  methods: {
    preparaOperacoes(level) {
      if (level >= NIVEL_MINIMO_ALTERAR) {
        this.operacoes = [
          { icon: "edit", descricao: "Alteração" },
          // { icon: "delete_outline", descricao: "Remoção" }
        ];
      }
    },

    preparaCabecalhos(level) {
      if (level >= NIVEL_MINIMO_ALTERAR) {
        this.cabecalhos = ["Sigla", "Designação", "Operações"];
        this.campos = ["id", "designacao", "operacoes"];
      } else {
        this.cabecalhos = ["Sigla", "Designação"];
        this.campos = ["id", "designacao"];
      }
    },

    preparaLista(listaTipologias) {
      let myTree = [];

      if (this.operacoes.length != 0) {
        for (let i = 0; i < listaTipologias.length; i++) {
          if (listaTipologias[i].estado === "Ativa")
            myTree.push({
              id: listaTipologias[i].sigla,
              designacao: listaTipologias[i].designacao,
              operacoes: this.operacoes,
            });
          else
            myTree.push({
              id: listaTipologias[i].sigla,
              designacao: listaTipologias[i].designacao,
            });
        }
      } else {
        for (let i = 0; i < listaTipologias.length; i++) {
          myTree.push({
            id: listaTipologias[i].sigla,
            designacao: listaTipologias[i].designacao,
          });
        }
      }

      return myTree;
    },
  },

  created: async function () {
    try {
      let response = await this.$request("get", "/tipologias");

      let level = this.$userLevel();

      this.preparaCabecalhos(level);

      this.preparaOperacoes(level);

      this.tipologias = await this.preparaLista(response.data);

      this.tipologiaReady = true;
    } catch (e) {
      return e;
    }
  },
};
</script>

<style scoped>
.content-table {
  background-color: #f1f6f8 !important;
  border-radius: 10px;
}

.info-content {
  padding: 5px;
  width: 100%;
  background-color: #f1f6f8 !important;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.22) !important;
  border-radius: 10px 10px 0 0;
}
</style>
