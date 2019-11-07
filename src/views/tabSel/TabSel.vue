<template>
  <div>
    <Loading v-if="!fontesReady" :message="'fontes de legitimação'" />
    <Listagem v-else :lista="fontes" tipo="Fontes de Legitimação" :cabecalho="cabecalhos" :campos="campos" />
  </div>
</template>
<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import Loading from "@/components/generic/Loading";

import { NIVEL_MINIMO_ALTERAR } from "@/utils/consts";

export default {
  data: () => ({
    fontes: [],
    campos: [],
    cabecalhos: [],
    fontesReady: false
  }),

  components: {
    Listagem,
    Loading
  },

  created: async function() {
    try {
      let response = await this.$request("get", "/api/legislacao?fonte=PGD");

      this.cabecalhos = ["Data", "Tipo", "Número", "Sumário", "Acesso"];
      this.campos = ["data", "tipo", "numero", "sumario", "link"];

      this.fontes = response.data
      this.fontesReady = true;
    } 
    catch (e) {
      return e;
    }
  }
};
</script>
