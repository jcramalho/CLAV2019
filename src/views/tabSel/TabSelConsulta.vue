<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp,
    }"
  >
    <ConsultarTS v-bind:ts="ts" />
  </v-content>
</template>

<script>
import ConsultarTS from '@/components/tabSel/consulta/ConsultarTS.vue';

export default {
  components: {
    ConsultarTS,
  },
  data: () => ({
    id: '',
    ts: {},
  }),
  created: async function() {
    try {
      this.id = window.location.pathname.split('/')[2];

      // Informações sobre o Auto de Eliminação
      var response = await this.$request('get', '/tabelasSelecao/' + this.id);
      this.ts = response.data;
      this.ts.classes = response.data.classes.map((c) => {
        if (c.nivel < 3) {
          c.pca.valores = '';
          c.df.valor = '';
        }
        return c;
      });
    } catch (e) {
      return e;
    }
  },
};
</script>
