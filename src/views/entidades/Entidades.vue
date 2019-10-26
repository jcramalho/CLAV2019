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

const NIVEL_MINIMO = 4;
const OPERACOES = [
  { icon: "edit", descricao: "Alteração" }
  // { icon: "delete_outline", descricao: "Remoção" }
];

export default {
  data: () => ({
    entidades: [],
    campos: "",
    cabecalhos: "",
    entidadesReady: false
  }),

  components: {
    Listagem,
    Loading
  },

  created: async function() {
    try {
      let level = await this.verificaNivel();

      let response = await this.$request("get", "/api/entidades");
      this.entidades = await this.preparaLista(response.data, level);

      await this.preparaCabecalhos(level);

      this.entidadesReady = true;
    } catch (e) {
      return e;
    }
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

    preparaLista: async function(listaEntidades, level) {
      try {
        let myTree = [];

        if (level >= NIVEL_MINIMO) {
          for (let i = 0; i < listaEntidades.length; i++) {
            myTree.push({
              id: listaEntidades[i].sigla,
              designacao: listaEntidades[i].designacao,
              operacoes: OPERACOES
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
      } catch (error) {
        return [];
      }
    },

    preparaCabecalhos: async function(level) {
      if (level >= NIVEL_MINIMO) {
        this.cabecalhos = ["Sigla", "Designação", "Operações"];
        this.campos = ["id", "designacao", "operacoes"];
      } else {
        this.cabecalhos = ["Sigla", "Designação"];
        this.campos = ["id", "designacao"];
      }
    }
  }
};
</script>
