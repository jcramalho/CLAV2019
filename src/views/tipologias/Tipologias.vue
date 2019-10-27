<template>
  <div>
    <Loading v-if="!tipologiaReady" :message="'tipologias'" />
    <Listagem
      v-else
      :lista="tipologias"
      tipo="Tipologias de Entidade"
      :cabecalho="cabecalhos"
      :campos="campos"
    />
  </div>
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
    tipologiaReady: false
  }),

  components: {
    Listagem,
    Loading
  },

  methods: {
    preparaOperacoes(level) {
      if (level >= NIVEL_MINIMO_ALTERAR) {
        this.operacoes = [
          { icon: "edit", descricao: "Alteração" }
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
          myTree.push({
            id: listaTipologias[i].sigla,
            designacao: listaTipologias[i].designacao,
            operacoes: this.operacoes
          });
        }
      } else {
        for (let i = 0; i < listaTipologias.length; i++) {
          myTree.push({
            id: listaTipologias[i].sigla,
            designacao: listaTipologias[i].designacao
          });
        }
      }

      return myTree;
    }
  },

  created: async function() {
    try {
      let response = await this.$request("get", "/api/tipologias");

      let level = await this.$userLevel(this.$store.state.token);

      this.preparaCabecalhos(level);

      this.preparaOperacoes(level);

      this.tipologias = await this.preparaLista(response.data);

      this.tipologiaReady = true;
    } catch (e) {
      return e;
    }
  }
};
</script>
