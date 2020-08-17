<template>
<<<<<<< HEAD
  <ImportarAuto v-bind:entidades="entidades" v-bind:classes="classes" />
=======
  <ImportarAuto 
    v-bind:entidades="entidades"
  />
>>>>>>> 19aa347ffbebc7de3f58077a61af422fc80a45a0
</template>

<script>
import ImportarAuto from "@/components/autosEliminacao/importacao/ImportarAutoEliminacao.vue";

export default {
  components: {
    ImportarAuto
  },
  data: () => ({
    entidades: []
  }),
  methods: {
<<<<<<< HEAD
    prepararEntidade: async function(ent, user) {
      try {
        var myEntidades = [];
        for (var e of ent) {
          if (e.id != user.entidade)
=======
    prepararEntidade: async function(ent) {
      try {
        var myEntidades = [];
        for (var e of ent) {
>>>>>>> 19aa347ffbebc7de3f58077a61af422fc80a45a0
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
