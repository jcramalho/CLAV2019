<template>
  <v-main class="px-12">
    <Loading v-if="!termosReady" :message="'os termos de índice'" />
    <Listagem
      v-else
      v-bind:lista="termosIndice"
      tipo="Termos de Índice"
      v-bind:cabecalho="['Termo', 'Classe', 'Título da Classe']"
      v-bind:campos="['termo', 'idClasse', 'tituloClasse']"
    />
  </v-main>
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import Loading from "@/components/generic/Loading";

export default {
  data: () => ({
    termosIndice: [],
    campos: [],
    termosReady: false,
  }),
  components: {
    Listagem,
    Loading,
  },

  mounted: async function () {
    try {
      var response = await this.$request("get", "/termosIndice");
      this.termosIndice = await this.preparaLista(response.data);
    } catch (e) {
      return e;
    }
  },

  methods: {
    preparaLista: async function (listaTermos) {
      try {
        var myTree = [];
        for (var i = 0; i < listaTermos.length; i++) {
          myTree.push({
            termo: listaTermos[i].termo,
            idClasse: listaTermos[i].idClasse,
            tituloClasse: listaTermos[i].tituloClasse,
          });
        }
        this.termosReady = true;
        return myTree;
      } catch (error) {
        return [];
      }
    },
  },
};
</script>
