<template>
  <Consulta
    tipo="Legislação"
    v-bind:objeto="legislacao"
    v-bind:titulo="titulo"
    v-bind:listaReg="regulaProc"
  />
</template>

<script>
import Consulta from "@/components/generic/Consulta.vue";

export default {
  components: {
    Consulta
  },
  data: () => ({
    idLegislacao: "",
    legislacao: {},
    titulo: "",
    regulaProc: []
  }),
  methods: {
    parseEntidades: async function(ent) {
      try {
        var entidades = "";
        for (var i = 0; i < ent.length; i++) {
          entidades = entidades + ent[i] + " ";
        }
        return entidades;
      } catch (e) {
        return {};
      }
    },
    preparaLegislacao: async function(leg) {
      try {
        var myLegislacao = {
          data: {
            campo: "Data",
            text: leg.data
          },
          sumario: {
            campo: "Sumário",
            text: leg.sumario
          },
          link: {
            campo: "Link",
            text: leg.link
          },
          entidades: {
            campo: "Entidades",
            text: await this.parseEntidades(leg.entidades)
          }
        };
        return myLegislacao;
      } catch (e) {
        return {};
      }
    }
  },
  created: async function() {
    try {
      this.idLegislacao = window.location.pathname.split("/")[2];

      // Informação sobre a legislação
      var response = await this.$request(
        "get",
        "/api/legislacao/" + this.idLegislacao
      );
      this.legislacao = await this.preparaLegislacao(response.data);
      this.titulo =
        response.data.tipo +
        " " +
        (await this.parseEntidades(response.data.entidades)) +
        " " +
        response.data.numero;

      // Processos de negócio que são regulados pela legislação em causa
      var regulaProc = await this.$request(
        "get",
        "/api/legislacao/" + this.idLegislacao + "/regula"
      );
      this.regulaProc = regulaProc.data;
    } catch (e) {
      return e;
    }
  }
};
</script>
