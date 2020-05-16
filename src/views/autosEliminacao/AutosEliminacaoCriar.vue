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
        var myEntidades = [];
        for (var e of ent) {
            myEntidades.push(e.sigla + " - " + e.designacao);
        }
        return myEntidades;
      } catch (error) {
        return [];
      }
    },
    prepararLeg: async function(leg) {
      try {
        var myPortarias = [];
        for (var l of leg) {
          myPortarias.push("Portaria " + l.numero + " - " + l.sumario);
        }
        return myPortarias;
      } catch (error) {
        return [];
      }
    },
    prepararClasses: async function(classes) {
      try {
        var myClasses = [];
        for (var c of classes)
          myClasses.push(c.codigo + " - " + c.titulo);
        return myClasses;
      } catch (error) {
        return [];
      }
    },
    prepararClassesCompletas: async function(classes, nivel4) {
      try {
        var myClasses = [];
        for (var c of classes) {
          if (c.df.valor !== "NE") myClasses.push(c);
          else {
            var indexs = 0;
            for (var n of nivel4) {
              if (n.codigo.includes(c.codigo)) {
                myClasses.push(n);
                indexs++;
              } else break;
            }
            nivel4.splice(0, indexs);
          }
        }
        
        return myClasses;
      } catch (error) {
        return [];
      }
    }
  },
  created: async function() {
    try {
      var response2 = await this.$request("get", "/legislacao?fonte=PGD/LC");
      this.portarias = await this.prepararLeg(response2.data);

      var response = await this.$request("get", "/entidades/");
      this.entidades = await this.prepararEntidade(response.data);

      var response3 = await this.$request(
        "get",
        "/classes?nivel=3&info=completa"
      );
      var response4 = await this.$request(
        "get",
        "/classes?nivel=4&info=completa"
      );
      this.classesCompletas = await this.prepararClassesCompletas(
        response3.data,
        response4.data
      );
      this.classes = await this.prepararClasses(this.classesCompletas);
    } catch (e) {
      this.entidades = [];
      this.portarias = [];
      this.classes = [];
      this.classesCompletas = [];
    }
  }
};
</script>
