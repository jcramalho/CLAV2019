<template>
  <ConsultarTS v-bind:ts="ts" />
</template>

<script>
import ConsultarTS from "@/components/tabSel/consulta/ConsultarTS.vue";

export default {
  components: {
    ConsultarTS
  },
  data: () => ({
    id: "",
    ts: {}
  }),
  created: async function() {
    try {
      this.id = window.location.pathname.split("/")[2];

      // Informações sobre o Auto de Eliminação
      var response = await this.$request(
        "get",
        "/tabelasSelecao/" + this.id
      );
      this.ts = response.data;
    } catch (e) {
      return e;
    }
  }
};
</script>