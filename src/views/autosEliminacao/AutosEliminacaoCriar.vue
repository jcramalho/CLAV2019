<template>
  <CriarAuto 
    v-bind:entidades="entidades"
    v-bind:portarias="portarias"
    v-bind:classes="classes"
    v-bind:classesCompletas="classesCompletas"
  />
</template>

<script>
import CriarAuto from "@/components/autosEliminacao/criacao/CriarAutoEliminacao.vue";

export default {
  components: {
    CriarAuto
  },
  data: () => ({
    entidades: [],
    portarias: [],
    classes: [],
    classesCompletas: []
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
    },
    prepararClasses: async function(classes) {
      try {
        var myClasses = []
        for(var c of classes) {
          myClasses.push(c.codigo+" - "+c.titulo)
        }
        return myClasses
      }
      catch (error) {
        return []
      }
    }
  },
  created: async function() {
    try {

      var response2 = await this.$request("get", "/api/legislacao?fonte=PGD/LC")
      this.portarias = await this.prepararLeg(response2.data)
      
      var response = await this.$request("get", "/api/entidades/")
      this.entidades = await this.prepararEntidade(response.data)

      var response3 = await this.$request("get", "/api/classes?nivel=3&info=completa")
      this.classes = await this.prepararClasses(response3.data)
      this.classesCompletas = response3.data
    }
    catch (e) {
      this.entidades = []
      this.portarias = []
      this.classes = []
      this.classesCompletas = []
    }
  }
};
</script>
