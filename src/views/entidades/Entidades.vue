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
      let response = await this.$request("get", "/api/entidades");
      this.entidades = await this.preparaLista(response.data);

      await this.preparaCabecalhos();

      this.entidadesReady = true;
    } catch (e) {
      return e;
    }
  },

  methods: {
    preparaLista: async function(listaEntidades) {
      try {
        let myTree = [];
        for (let i = 0; i < listaEntidades.length; i++) {
          myTree.push({
            id: listaEntidades[i].sigla,
            designacao: listaEntidades[i].designacao
          });
        }
        return myTree;
      } catch (error) {
        return [];
      }
    },

    preparaCabecalhos: async function() {
      try {
        let userInfo = await this.$request(
          "get",
          `/api/users/listarToken/${this.$store.state.token}`
        );

        // if (userInfo.data.level >= 4) {
        //   this.cabecalhos = ["Sigla", "Designação", "Operações"];
        //   this.campos = ["id", "designacao", "edit"];
        // } else {
        this.cabecalhos = ["Sigla", "Designação"];
        this.campos = ["id", "designacao"];
        // }
      } catch (error) {
        return error;
      }
    }
  }
};
</script>
