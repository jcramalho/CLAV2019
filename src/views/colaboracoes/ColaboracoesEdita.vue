<template>
  <div>
    <Loading v-if="!dadosReady" :message="'a colaboração'" />
    <EditaCredito v-else :t="credito" />
  </div>
</template>

<script>
import EditaCredito from "@/components/colaboracoes/EditaColaboracao.vue";
import Loading from "@/components/generic/Loading";

export default {
  components: {
    EditaCredito,
    Loading
  },

  data: () => ({
    credito: {},
    dadosReady: false
  }),

  methods: {
    preparaCredito: async function(not) {
      try {
        let myCredito = {
          nome: not.nome,
          filiacao: not.filiacao,
          funcao: not.funcao,
          desc: not.desc
        };
        return myCredito;
      } catch (e) {
        return {};
      }
    }
  },

  created: async function() {
    try {
      let idCredito = this.$route.path.split("/")[3];

      let infoCredito = await this.$request("get", "/colaboracoes/" + idCredito);

      this.credito = await this.preparaCredito(infoCredito.data);

      this.dadosReady = true;
    } catch (e) {
      return e;
    }
  }
};
</script>
