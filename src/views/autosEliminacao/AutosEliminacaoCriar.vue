<template>
  <CriarAuto
    v-bind:entidades="entidades"
  />
</template>

<script>
import CriarAuto from "@/components/autosEliminacao/criacao/CriarAutoEliminacao.vue";

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
      var response = await this.$request("get", "/entidades/");
      this.entidades = await this.prepararEntidade(response.data);
    } catch (e) {
      this.entidades = [];
    }
  }
};
</script>
