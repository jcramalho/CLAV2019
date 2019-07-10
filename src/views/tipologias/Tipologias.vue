<template>
  <Listagem
    v-bind:lista="tipologias"
    tipo="Tipologias de Entidade"
    v-bind:cabecalho="['Sigla', 'Designação']"
    v-bind:campos="['id', 'designacao']"
  />
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    tipologias: [],
    campos: []
  }),
  components: {
    Listagem
  },

  mounted: async function() {
    try {
      var response = await axios.get(lhost + "/api/tipologias");
      this.tipologias = await this.preparaLista(response.data);
    } catch (e) {
      return e;
    }
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
        return myTree;
      } catch (error) {
        return [];
      }
    }
  }
};
</script>
