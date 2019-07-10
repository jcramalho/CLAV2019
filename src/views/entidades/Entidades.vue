<template>
  <Listagem
    v-bind:lista="entidades"
    tipo="Entidades"
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
    entidades: [],
    campos: []
  }),
  components: {
    Listagem
  },

  mounted: async function() {
    try {
      var response = await axios.get(lhost + "/api/entidades");
      this.entidades = await this.preparaLista(response.data);
    } catch (e) {
      return e;
    }
  },

  methods: {
    preparaLista: async function(listaEntidades) {
      try {
        var myTree = [];
        for (var i = 0; i < listaEntidades.length; i++) {
          myTree.push({
            id: listaEntidades[i].sigla,
            designacao: listaEntidades[i].designacao
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
