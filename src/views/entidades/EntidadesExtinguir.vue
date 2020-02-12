<template>
  <div>
    <Loading v-if="!dadosReady" :message="'a entidade'" />
    <ExtinguirEntidade v-else :e="entidade" />
  </div>
</template>

<script>
import ExtinguirEntidade from "@/components/entidades/ExtinguirEntidade";
import Loading from "@/components/generic/Loading";

export default {
  components: {
    ExtinguirEntidade,
    Loading
  },

  data: () => ({
    entidade: {},
    dadosReady: false
  }),

  methods: {
    preparaEntidade: async function(ent, tip) {
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
      let idEntidade = this.$route.path.split("/")[3];

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
