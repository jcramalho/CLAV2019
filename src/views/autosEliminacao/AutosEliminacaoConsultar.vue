<template>
  <v-container>
    <ConsultarAE v-bind:auto="autoEliminacao" />
  </v-container>
</template>

<script>
import ConsultarAE from "@/components/autosEliminacao/ConsultarAutoEliminacao.vue";

export default {
  components: {
    ConsultarAE
  },
  data: () => ({
    idAE: "",
    autoEliminacao: {}
  }),
  created: async function() {
    try {
      this.idAE = window.location.pathname.split("/")[2];

      // Informações sobre o Auto de Eliminação
      var response = await this.$request(
        "get",
        "/api/autosEliminacao/" + this.idAE
      );
      this.autoEliminacao = response.data;
    } catch (e) {
      return e;
    }
  }
};
</script>
