<template>
  <div>
    <Loading v-if="!legislacaoReady" :message="'legislações'" />
    <Listagem
      v-else
      v-bind:lista="legislacao"
      tipo="Legislação"
      v-bind:cabecalho="['Data', 'Tipo', 'Entidade(s)', 'Número', 'Sumário']"
      v-bind:campos="['data', 'tipo', 'entidades', 'numero', 'sumario']"
      v-bind:ids="ids"
    />
  </div>
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import Loading from "@/components/generic/Loading";

export default {
  data: () => ({
    legislacao: [],
    campos: [],
    ids: [],
    legislacaoReady: false
  }),
  components: {
    Listagem,
    Loading
  },

  mounted: async function() {
    try {
      var response = await this.$request("get", "/api/legislacao");
      this.legislacao = await this.preparaLista(response.data);
      this.ids = await this.preparaIds(response.data);
    } catch (e) {
      return e;
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
        this.legislacaoReady = true;
        return ids;
      } catch (e) {
        return e;
      }
    }
  }
};
</script>
