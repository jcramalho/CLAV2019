<template>
  <ImportarCSVAuto 
    v-bind:entidades="entidades"
  />
</template>

<script>
import ImportarCSVAuto from "@/components/autosEliminacao/importacao/ImportarCSVAutoEliminacao.vue";

export default {
  components: {
    ImportarCSVAuto
  },
  data: () => ({
    entidades: []
  }),
  methods: {
    prepararEntidade: async function(ent) {
      try {
        var myEntidades = [];
        for (var e of ent) {
            myEntidades.push(e.sigla + " - " + e.designacao);
        }
        return myEntidades;
      } catch (error) {
        return [];
      }
    }
  },
  created: async function() {
    try {
      var response2 = await this.$request("get", "/entidades/");
      this.entidades = await this.prepararEntidade(response2.data);
    } catch (e) {
      this.entidades = [];
    }
  }
};
</script>
