<template>
  <ConsultarTS v-bind:ts="ts" />
</template>

<script>
import ConsultarTS from "@/components/tabSel/consulta/ConsultarTS.vue";

export default {
  components: {
    ConsultarTS,
  },
  data: () => ({
    id: "",
    ts: {},
  }),
  created: async function () {
    try {
      this.id = window.location.pathname.split("/")[2];

      // Informações sobre o Auto de Eliminação
      var response = await this.$request("get", "/tabelasSelecao/" + this.id);
      this.ts = response.data;
      this.ts.classes = response.data.classes.map((c) => {
        if (c.nivel < 3) {
          c.pca.valores = "";
          c.df.valor = "";
        }
        return c;
      });
    } catch (e) {
      return e;
    }
  },
};
</script>
