<template>
  <div>
    <Loading v-if="!entidadesReady" :message="'entidades'" />
    <Listagem
      v-if="entidadesReady"
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

const NIVEL_MINIMO_ALTERAR = 4;
// const NIVEL_MINIMO_REMOVER = "X"; // restantes restrições

export default {
  data: () => ({
    entidades: [],
    campos: "",
    cabecalhos: "",
    operacoes: [],
    entidadesReady: false
  }),

  components: {
    Listagem,
    Loading
  },

  methods: {
    verificaNivel: async function() {
      try {
        let userInfo = await this.$request(
          "get",
          `/api/users/listarToken/${this.$store.state.token}`
        );
        return userInfo.data.level;
      } catch (e) {
        return e;
      }
    },

    preparaOperacoes(level) {
      if (level >= NIVEL_MINIMO_ALTERAR) {
        this.operacoes = [
          { icon: "edit", descricao: "Alteração" }
          // { icon: "delete_outline", descricao: "Remoção" }
        ];
      }
    },

    preparaLista(listaEntidades) {
      let myTree = [];

      if (this.operacoes.length != 0) {
        for (let i = 0; i < listaEntidades.length; i++) {
          myTree.push({
            id: listaEntidades[i].sigla,
            designacao: listaEntidades[i].designacao,
            operacoes: this.operacoes
          });
        }
      } else {
        for (let i = 0; i < listaEntidades.length; i++) {
          myTree.push({
            id: listaEntidades[i].sigla,
            designacao: listaEntidades[i].designacao
          });
        }
      }

      return myTree;
    },

    preparaCabecalhos(level) {
      if (level >= NIVEL_MINIMO_ALTERAR) {
        this.cabecalhos = ["Sigla", "Designação", "Operações"];
        this.campos = ["id", "designacao", "operacoes"];
      } else {
        this.cabecalhos = ["Sigla", "Designação"];
        this.campos = ["id", "designacao"];
      }
    }
  },

  created: async function() {
    try {
      let response = await this.$request("get", "/api/entidades");

      let level = await this.verificaNivel();

      this.preparaCabecalhos(level);

      this.preparaOperacoes(level);

      this.entidades = await this.preparaLista(response.data);

      this.entidadesReady = true;
    } catch (e) {
      return e;
    }
  }
};
</script>
