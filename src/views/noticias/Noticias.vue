<template>
  <div>
    <Loading v-if="!noticiasReady" :message="'notícias'" />
    <Listagem
      v-else
      :lista="noticias"
      tipo="Noticias"
      :cabecalho="cabecalhos"
      :campos="campos"
    />
  </div>
</template>

<script>
import Listagem from "@/components/generic/Listagem.vue"; // @ is an alias to /src
import Loading from "@/components/generic/Loading";

import { NIVEL_MINIMO_ALTERAR } from "@/utils/consts";

export default {
  data: () => ({
    noticias: [],
    campos: [],
    cabecalhos: [],
    operacoes: [],
    noticiasReady: false
  }),

  components: {
    Listagem,
    Loading
  },

  methods: {
    preparaOperacoes(level) {
      if (level >= NIVEL_MINIMO_ALTERAR) {
        this.operacoes = [
          { icon: "edit", descricao: "Alteração" }
          // { icon: "delete_outline", descricao: "Remoção" }
        ];
      }
    },

    preparaCabecalhos(level) {
      if (level >= NIVEL_MINIMO_ALTERAR) {
        this.cabecalhos = ["Sigla", "Designação", "Operações"];
        this.campos = ["id", "designacao", "operacoes"];
      } else {
        this.cabecalhos = ["Sigla", "Designação"];
        this.campos = ["id", "designacao"];
      }
    },

    preparaLista(listaNoticias) {
      let myTree = [];

      if (this.operacoes.length != 0) {
        for (let i = 0; i < listaNoticias.length; i++) {
          myTree.push({
            id: listaNoticias[i].sigla,
            designacao: listaNoticias[i].designacao,
            operacoes: this.operacoes
          });
        }
      } else {
        for (let i = 0; i < listaNoticias.length; i++) {
          myTree.push({
            id: listaNoticias[i].sigla,
            designacao: listaNoticias[i].designacao
          });
        }
      }

      return myTree;
    }
  },

  created: async function() {
    try {
      let response = await this.$request("get", "/noticias");

      let level = await this.$userLevel(this.$store.state.token);

      this.preparaCabecalhos(level);

      this.preparaOperacoes(level);

      this.noticias = await this.preparaLista(response.data);

      this.entidadesReady = true;
    } catch (e) {
      return e;
    }
  }
};
</script>
