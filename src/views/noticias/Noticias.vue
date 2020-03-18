<template>
  <div>
    <Loading v-if="!noticiasReady" :message="'notícias'" />
    <Listagem
      v-else
      :lista="noticias"
      tipo="Notícias"
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
        this.operacoes = [{ icon: "edit", descricao: "Alteração" }];
      }
    },

    preparaCabecalhos(level) {
      if (level >= NIVEL_MINIMO_ALTERAR) {
        this.cabecalhos = ["Título", "Data", "Visível", "Operações"];
        this.campos = ["titulo", "data", "ativa", "operacoes"];
      } else {
        this.cabecalhos = ["Título", "Data", ""];
        this.campos = ["titulo", "data"];
      }
    },

    preparaLista(level, listaNoticias) {
      let myTree = [];

      if (this.operacoes.length != 0) {
        for (let i = 0; i < listaNoticias.length; i++) {
          if (level >= NIVEL_MINIMO_ALTERAR) {
            myTree.push({
              titulo: listaNoticias[i].titulo,
              data: listaNoticias[i].data,
              ativa: listaNoticias[i].ativa,
              operacoes: this.operacoes,
              id: listaNoticias[i]._id
            });
          } else {
            myTree.push({
              titulo: listaNoticias[i].titulo,
              data: listaNoticias[i].data,
              operacoes: this.operacoes,
              id: listaNoticias[i]._id
            });
          }
        }
      } else {
        for (let i = 0; i < listaNoticias.length; i++) {
          if (listaNoticias[i].ativa == true) {
            myTree.push({
              titulo: listaNoticias[i].titulo,
              data: listaNoticias[i].data,
              id: listaNoticias[i]._id
            });
          }
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

      this.noticias = await this.preparaLista(level, response.data);

      this.noticiasReady = true;
    } catch (e) {
      return e;
    }
  }
};
</script>
