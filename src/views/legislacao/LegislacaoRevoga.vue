<template>
  <div>
    <Loading v-if="!dadosReady" :message="'a entidade'" />
    <RevogarLegislacao v-else :l="legislacao" />
  </div>
</template>

<script>
import RevogarLegislacao from "@/components/entidades/RevogarLegislacao";
import Loading from "@/components/generic/Loading";

export default {
  components: { RevogarLegislacao, Loading },

  data: () => ({
    legislacao: {},
    dadosReady: false
  }),

  methods: {
    preparaLegislacao: async function(ent, tip) {
      try {
        let myEntidade = {
          designacao: ent.designacao,
          sigla: ent.sigla,
          sioe: ent.sioe,
          internacional: ent.internacional,
          tipologiasSel: tip
        };
        return myEntidade;
      } catch (e) {
        return {};
      }
    }
  },

  created: async function() {
    try {
      let idLegislacao = this.$route.path.split("/")[3];

      console.log("idLegislacao :", idLegislacao);

      let infoEntidade = await this.$request(
        "get",
        "/api/entidades/" + idEntidade
      );

      let tipologias = await this.$request(
        "get",
        "/api/entidades/" + idEntidade + "/tipologias"
      );

      this.entidade = await this.preparaEntidade(
        infoEntidade.data,
        tipologias.data
      );

      this.dadosReady = true;
    } catch (e) {
      return e;
    }
  }
};
</script>
