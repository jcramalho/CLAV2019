<template>
  <div>
    <Loading v-if="!entidadesReady" :message="'entidades'" />
    <Listagem
      v-else
      :lista="entidades"
      tipo="Entidades"
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
    entidades: [],
    campos: [],
    cabecalhos: [],
    operacoes: [],
    entidadesReady: false,
  }),

  components: {
    Listagem,
    Loading,
  },

  methods: {
    preparaOperacoes(level) {
      if (level >= NIVEL_MINIMO_ALTERAR) {
        this.operacoes = [
          { icon: "edit", descricao: "Alteração" },
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

    preparaLista(listaEntidades) {
      let myTree = [];

      if (this.operacoes.length != 0) {
        for (let i = 0; i < listaEntidades.length; i++) {
          if (listaEntidades[i].estado === "Ativa")
            myTree.push({
              id: listaEntidades[i].sigla,
              designacao: listaEntidades[i].designacao,
              operacoes: this.operacoes,
            });
          else
            myTree.push({
              id: listaEntidades[i].sigla,
              designacao: listaEntidades[i].designacao,
            });
        }
      } else {
        for (let i = 0; i < listaEntidades.length; i++) {
          myTree.push({
            id: listaEntidades[i].sigla,
            designacao: listaEntidades[i].designacao,
          });
        }
      }

      return myTree;
    },
  },

  created: async function () {
    try {
      let response = await this.$request("get", "/entidades");

      let level = this.$userLevel();

      this.preparaCabecalhos(level);

      this.preparaOperacoes(level);

      this.entidades = await this.preparaLista(response.data);

      this.entidadesReady = true;
    } catch (e) {
      return e;
    }
  },
};
</script>
