<template>
  <div>
    <Loading v-if="!dadosReady" :message="'a legislação'" />
    <EditaLegislacao v-else :l="legislacao" />
  </div>
</template>

<script>
import EditaLegislacao from "@/components/legislacao/EditaLegislacao";
import Loading from "@/components/generic/Loading";

export default {
  components: {
    EditaLegislacao,
    Loading
  },

  data: () => ({
    legislacao: {},
    dadosReady: false
  }),

  methods: {
    preparaLegislacao: async function(leg, proReg) {
      try {
        let myLegislacao = {
          numero: leg.numero,
          sumario: leg.sumario,
          tipo: leg.tipo,
          data: leg.data,
          link: leg.link,
          entidadesSel: leg.entidades,
          processosSel: proReg
        };
        return myLegislacao;
      } catch (e) {
        return {};
      }
    }
  },

  created: async function() {
    try {
      let idLegislacao = this.$route.path.split("/")[3];

      let infoLegislacao = await this.$request(
        "get",
        "/api/legislacao/" + idLegislacao
      );

      let processosRegula = await this.$request(
        "get",
        "/api/legislacao/" + idLegislacao + "/regula"
      );

      this.legislacao = await this.preparaLegislacao(
        infoLegislacao.data,
        processosRegula.data
      );

      this.dadosReady = true;
    } catch (e) {
      return e;
    }
  }
};
</script>
