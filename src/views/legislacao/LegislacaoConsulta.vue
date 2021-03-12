<template>
  <div>
    <Loading v-if="!legislacaoReady" :message="'legislação'" />
    <ConsultaLeg
      v-else
      v-bind:objeto="legislacao"
      v-bind:titulo="titulo"
      v-bind:listaReg="regulaProc"
    />
  </div>
</template>

<script>
import ConsultaLeg from "@/components/legislacao/consulta/ConsultaLeg";
import Loading from "@/components/generic/Loading";

export default {
  components: {
    ConsultaLeg,
    Loading
  },
  data: () => ({
    idLegislacao: "",
    legislacao: {},
    titulo: "",
    regulaProc: [],
    legislacaoReady: false
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
            campo: "Data do diploma",
            text: leg.data
          },
          sumario: {
            campo: "Sumário",
            text: leg.sumario
          },
          fonte: {
            campo: "Fonte de legitimação",
            text: leg.fonte
          },
          link: {
            campo: "Link",
            text: leg.link
          },
          entidades: {
            campo: "Entidades",
            // text: await this.parseEntidades(leg.entidades)
            text: leg.entidades
          }
        };
        if (leg.estado == "Ativo") {
          myLegislacao.estado = {
            campo: "Estado",
            text: "Em vigor"
          };
        } else {
          myLegislacao.estado = {
            campo: "Estado",
            text: leg.estado
          };

          if (leg.dataRevogacao)
            myLegislacao.dataRevogacao = {
              campo: "Data de revogação",
              text: leg.dataRevogacao
            };
        }

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
        "/legislacao/" + this.idLegislacao
      );
      this.legislacao = await this.preparaLegislacao(response.data);
      this.titulo = `${response.data.tipo}  ${response.data.numero}`;

      // Processos de negócio que são regulados pela legislação em causa
      var regulaProc = await this.$request(
        "get",
        "/legislacao/" + this.idLegislacao + "/processos"
      );
      this.regulaProc = regulaProc.data;
      this.legislacaoReady = true;
    } catch (e) {
      return e;
    }
  }
};
</script>
