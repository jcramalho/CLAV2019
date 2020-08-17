<template>
  <v-content
    :class="{
      'px-6': $vuetify.breakpoint.smAndDown,
      'px-12': $vuetify.breakpoint.mdAndUp
    }"
  >
    <Loading v-if="!dadosReady" :message="'a entidade'" />
    <EditaEntidade v-else :e="entidade" />
  </v-content>
</template>

<script>
import EditaEntidade from "@/components/entidades/EditaEntidade";
import Loading from "@/components/generic/Loading";

export default {
  components: {
    EditaEntidade,
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
          tipologiasSel: tip,
          estado: ent.estado
        };

        if (ent.dataCriacao) {
          myEntidade.dataCriacao = ent.dataCriacao;
        }

        if (ent.dataExtincao) {
          myEntidade.dataExtincao = ent.dataExtincao;
        }

        return myEntidade;
      } catch (e) {
        return {};
      }
    }
  },

  created: async function() {
    try {
      let idEntidade = this.$route.path.split("/")[3];

      let infoEntidade = await this.$request("get", "/entidades/" + idEntidade);

      let tipologias = await this.$request(
        "get",
        "/entidades/" + idEntidade + "/tipologias"
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
