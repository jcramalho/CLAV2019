<template>
  <div>
    <Loading v-if="!entidadesReady" :message="'entidades'" />
    <Listagem
      v-if="entidadesReady"
      v-bind:lista="entidades"
      tipo="Entidades"
      v-bind:cabecalho="['Sigla', 'Designação']"
      v-bind:campos="['id', 'designacao']"
    />
  </div>
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import Loading from "@/components/generic/Loading";

export default {
  data: () => ({
    entidades: [],
    campos: [],
    entidadesReady: false
  }),

  components: {
    Listagem,
    Loading
  },

  mounted: async function() {
    try {
      var response = await this.$request("get", "/api/entidades");
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

        this.entidadesReady = true;
        return myTree;
      } catch (error) {
        return [];
      }
    }
  }
};
</script>
