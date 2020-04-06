<template>
  <ImportarAuto 
    v-bind:entidades="entidades"
    v-bind:classes="classes"
  />
</template>

<script>
import ImportarAuto from "@/components/autosEliminacao/ImportarAutoEliminacao.vue";

export default {
  components: {
    ImportarAuto
  },
  data: () => ({
    entidades: [],
    classes: []
  }),
  methods: {
    prepararEntidade: async function(ent,user) {
      try {
        var myEntidades = [];
        for (var e of ent) {
          if(e.id!=user.entidade)
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
          myPortarias.push("Portaria " + l.numero + " \n " + l.sumario);
        }
        return myPortarias;
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
      var user = await this.$request("get", "/users/token");
      var response2 = await this.$request("get", "/entidades/");
      this.entidades = await this.prepararEntidade(response2.data, user.data);
      var response3 = await this.$request(
        "get",
        "/classes?nivel=3&info=completa"
      );
      var response4 = await this.$request(
        "get",
        "/classes?nivel=4&info=completa"
      );
      this.classes = await this.prepararClassesCompletas(
        response3.data,
        response4.data
      );
    } catch (e) {
      this.entidades = [];
      this.classes = [];
    }
  }
};
</script>
