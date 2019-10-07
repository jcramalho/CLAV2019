<template>
  <CriarAuto 
    v-bind:entidades="entidades"
    v-bind:portarias="portarias"
  />
</template>

<script>
import CriarAuto from "@/components/autosEliminacao/CriarAutoEliminacao.vue";

export default {
  components: {
    CriarAuto
  },
  data: () => ({
    entidades: [],
    portarias: []
  }),
  methods: {
    prepararEntidade: async function(ent) {
      try {
        var myEntidades = []
        for(var e of ent) {
          myEntidades.push(e.sigla+" - "+e.designacao)
        }
        return myEntidades
      }
      catch (error) {
        return []
      }
    },
    prepararLeg: async function(leg) {
      try {
        var myPortarias = []
        for(var l of leg) {
          myPortarias.push("Portaria "+l.numero+" \n "+l.sumario)
        }
        return myPortarias
      }
      catch (error) {
        return []
      }
    }
  },
  created: async function() {
    try {
      var response = await this.$request("get", "/api/entidades/")
      this.entidades = await this.prepararEntidade(response.data)
      
      var response2 = await this.$request("get", "/api/legislacao/portarias")
      this.portarias = await this.prepararLeg(response2.data)
    }
    catch (e) {
      this.entidades = ["WTF"]
      this.portarias = ["WTF"]
    }
  }
};
</script>
