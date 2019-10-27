<template>
  <div>
    <Loading v-if="!tipologiaReady" :message="'tipologias'" />
    <Listagem
      v-else
      v-bind:lista="tipologias"
      tipo="Tipologias de Entidade"
      v-bind:cabecalho="['Sigla', 'Designação']"
      v-bind:campos="['id', 'designacao']"
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
    campos: "",
    cabecalhos: "",
    operacoes: [],
    tipologiaReady: false
  }),

  components: {
    Listagem,
    Loading
  },

  methods: {
    preparaLista: async function(listaTipologias) {
      try {
        var myTree = [];
        for (var i = 0; i < listaTipologias.length; i++) {
          myTree.push({
            id: listaTipologias[i].sigla,
            designacao: listaTipologias[i].designacao
          });
        }
        this.tipologiaReady = true;
        return myTree;
      } catch (error) {
        return [];
      }
    }
  },

  mounted: async function() {
    try {
      var response = await this.$request("get", "/api/tipologias");
      this.tipologias = await this.preparaLista(response.data);
    } catch (e) {
      return e;
    }
  }
};
</script>
