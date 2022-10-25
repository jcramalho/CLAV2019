<template>
  <CriarAuto
    v-bind:entidades="entidades"
  />
</template>

<script>
// import CriarAuto from "@/components/autosEliminacao/criacao/CriarAutoEliminacao.vue";
import CriarAuto from "@/components/autosEliminacao/criacao/CriarAE.vue";

export default {
  components: {
    CriarAuto
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
    },
    prepararEntidade2: async function(ent) {
      try {
        var myEntidades = [];
        for (var e of ent) {
            myEntidades.push(
              {
					      "entidade" : e.sigla,
					      "designacao" : e.designacao
				      });
        }
        return myEntidades;
      } catch (error) {
        return [];
      }
    }
  },
  created: async function() {
    try {
      var response = await this.$request("get", "/entidades/");
      this.entidades = await this.prepararEntidade2(response.data);
    } catch (e) {
      //... Ativar um diálogo de erro
      this.entidades = [];
    }
  }
};
</script>
