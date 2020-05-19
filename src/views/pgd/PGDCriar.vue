<template>
  <CriarPGD
    :entidades="entidades"
  />
</template>

<script>
import CriarPGD from "@/components/pgd/criacao/CriarPGD.vue";

export default {
  components: {
    CriarPGD
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
      var response = await this.$request("get", "/entidades/");
      this.entidades = await this.prepararEntidade(response.data);
    } catch (e) {
      this.entidades = [];
    }
  }
}
</script>
