<template>
  <Listagem
    v-bind:lista="autosEliminacao"
    tipo="Autos de Eliminação"
    v-bind:cabecalho="['Identificação','Entidade Responsável', 'Fonte de Legitimação', 'Fundo', 'Data']"
    v-bind:campos="['id','entidade', 'fonte', 'fundo', 'data']"
  />
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    autosEliminacao: [],
    campos: []
  }),
  components: {
    Listagem
  },

  mounted: async function() {
    try {
      var response = await axios.get(lhost + "/api/autosEliminacao");
      this.autosEliminacao = await this.preparaLista(response.data);
    } catch (e) {
      return e;
    }
  },

  methods: {
    preparaLista: async function(listaAutosEliminacao) {
      try {
        var myTree = [];
        for (var i = 0; i < listaAutosEliminacao.length; i++) {
          myTree.push({
            id: listaAutosEliminacao[i].id.split("#")[1].replace('ae_',''),
            entidade: listaAutosEliminacao[i].entidade.split("#")[1].replace('ent_',''),
            fonte: listaAutosEliminacao[i].tipo +" "+listaAutosEliminacao[i].num,
            fundo: listaAutosEliminacao[i].fundo,
            data: listaAutosEliminacao[i].data
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
