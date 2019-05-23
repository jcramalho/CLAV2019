<template>
  <Listagem
    v-bind:lista="legislacao"
    tipo="Legislação"
    v-bind:cabecalho="['Data', 'Tipo', 'Entidade(s)', 'Número', 'Sumário']"
    v-bind:campos="['data', 'tipo', 'entidades', 'numero', 'sumario']"
    v-bind:ids="ids"
  />
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    legislacao: [],
    campos: [],
    ids: []
  }),
  components: {
    Listagem
  },

  mounted: async function() {
    try {
      var response = await axios.get(lhost + "/api/legislacao");
      this.legislacao = await this.preparaLista(response.data);
      this.ids = await this.preparaIds(response.data);
    } catch (e) {
      console.log(e);
    }
  },

  methods: {
    preparaLista: async function(listaLegislacao) {
      try {
        var myTree = [];
        for (var i = 0; i < listaLegislacao.length; i++) {
          var temp = "";
          for (var j = 0; j < listaLegislacao[i].entidades.length; j++) {
            if (temp === "") {
              temp = listaLegislacao[i].entidades[j].sigla;
            } else {
              temp = temp + "," + listaLegislacao[i].entidades[j].sigla;
            }
          }
          listaLegislacao[i].entidades = temp;
          myTree.push({
            data: listaLegislacao[i].data,
            tipo: listaLegislacao[i].tipo,
            entidades: listaLegislacao[i].entidades,
            numero: listaLegislacao[i].numero,
            sumario: listaLegislacao[i].sumario
            //id: listaLegislacao[i].id
          });
        }
        return myTree;
      } catch (error) {
        return [];
      }
    },
    preparaIds: async function(listaLegislacao) {
      try {
        var ids = [];
        for (var i = 0; i < listaLegislacao.length; i++) {
          ids.push({
            numero: listaLegislacao[i].numero,
            id: listaLegislacao[i].id
          });
        }
        return ids;
      } catch (e) {}
    }
  }
};
</script>
