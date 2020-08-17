<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp
    }"
  >
    <Loading v-if="!dadosReady" :message="'tipologia'" />
    <EditaTipologia v-else :t="tipologia" />
  </v-content>
</template>

<script>
import EditaTipologia from "@/components/tipologias/EditaTipologia";
import Loading from "@/components/generic/Loading";

export default {
  components: {
    EditaTipologia,
    Loading
  },

  data: () => ({
    tipologia: {},
    dadosReady: false
  }),

  methods: {
    preparaTipologia: async function(tip, ent) {
      try {
        let myTipologia = {
          designacao: tip.designacao,
          sigla: tip.sigla,
          estado: tip.estado,
          entidadesSel: ent
        };
        return myTipologia;
      } catch (e) {
        return {};
      }
    }
  },

  created: async function() {
    try {
      let idTipologia = this.$route.path.split("/")[3];

      let infoTipologia = await this.$request(
        "get",
        "/tipologias/" + idTipologia
      );

      let entidadesAssociadas = await this.$request(
        "get",
        "/tipologias/" + idTipologia + "/elementos"
      );

      this.tipologia = await this.preparaTipologia(
        infoTipologia.data,
        entidadesAssociadas.data
      );

      this.dadosReady = true;
    } catch (e) {
      return e;
    }
  }
};
</script>
