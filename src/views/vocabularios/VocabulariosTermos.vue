<template>
  <Listagem
    v-bind:lista="vocabulariosControladosContinuacao"
    tipo="Termos de Vocabulários Controlados"
    v-bind:cabecalho="['Termo', 'Descrição', 'Identificador']"
    v-bind:campos="['termo', 'desc', 'idtermo']"
  />
</template>

<script>
import Listagem from "@/components/vocabularios/ListagemTermos.vue"; // @ is an alias to /src

export default {
  data: () => ({
    vocabulariosControladosContinuacao: [],
    campos: []
  }),
  components: {
    Listagem
  },

  mounted: async function() {
    try {
      var response = await this.$request(
        "get",
        "/api/vocabularios/" + this.$route.params.idVC
      );
      this.vocabulariosControladosContinuacao = await this.preparaLista(
        response.data
      );
    } catch (e) {
      return e;
    }
  },

  methods: {
    preparaLista: async function(listaTermos) {
      try {
        var myTree = [];
        for (var i = 0; i < listaTermos.length; i++) {
          myTree.push({
            termo: listaTermos[i].termo,
            desc: listaTermos[i].desc,
            idtermo: listaTermos[i].idtermo.split("#")[1]
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
