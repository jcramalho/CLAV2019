<template>
  <div>
    <div>
      <Loading v-if="!fontesPGDReady" :message="'fontes de legitimação'" />
      <Listagem v-else :lista="fontesPGD" tipo="Fontes de Legitimação (PGD)" :cabecalho="cabecalhos" :campos="campos" />
    </div>
    <div>
      <Loading v-if="!fontesPGDLCReady" :message="'fontes de legitimação'" />
      <Listagem v-else :lista="fontesPGDLC" tipo="Fontes de Legitimação (PGD/LC)" :cabecalho="cabecalhos" :campos="campos" />
    </div>
  </div>
</template>
<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import Loading from "@/components/generic/Loading";

import { NIVEL_MINIMO_ALTERAR } from "@/utils/consts";

export default {
  data: () => ({
    fontesPGD: [],
    fontesPGDLC: [],
    campos: [],
    cabecalhos: [],
    fontesPGDReady: false,
    fontesPGDLCReady: false
  }),

  components: {
    Listagem,
    Loading
  },

  created: async function() {
    this.cabecalhos = ["Data", "Tipo", "Número", "Sumário", "Acesso"];
    this.campos = ["data", "tipo", "numero", "sumario", "link"];

    this.$request("get", "/api/legislacao?fonte=PGD/LC")
      .then(response2 => {
        this.fontesPGDLC = response2.data.map(f => { return {data: f.data, tipo: f.tipo, numero: f.numero, sumario: f.sumario, link: f.link}})
        this.fontesPGDLCReady = true;
      })
      .catch(e => console.log('Erro no carregamento da legislação PGD/LC: ' + e))

    this.$request("get", "/api/legislacao?fonte=PGD")
      .then(response => {
        this.fontesPGD = response.data.map(f => { return {data: f.data, tipo: f.tipo, numero: f.numero, sumario: f.sumario, link: f.link}})
        this.fontesPGDReady = true;
      })
      .catch(e2 => console.log('Erro no carregamento da legislação PGD: ' + e2))
  }
};
</script>
