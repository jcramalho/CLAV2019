<template>
  <div>
    <Loading v-if="!dadosReady" :message="'a entidade'" />
    <EditaEntidade v-else :e="entidade" />
  </div>
</template>

<script>
import EditaEntidade from "@/components/entidades/EditaEntidade";
import Loading from "@/components/generic/Loading";

export default {
  components: {
    EditaEntidade,
    Loading,
  },

  data: () => ({
    entidade: {},
    dadosReady: false,
  }),

  methods: {
    preparaEntidade: async function (ent, tip, flag) {
      try {
        let myEntidade = {
          designacao: !flag ? ent.designacao : ent.designacao.dados,
          sigla: !flag ? ent.sigla : ent.sigla.dados,
          sioe: !flag ? ent.sioe : ent.sioe.dados,
          internacional: !flag ? ent.internacional : ent.internacional.dados,
          tipologiasSel: !flag ? tip : tip.dados,
          estado: !flag ? ent.estado : false,
        };
        console.log(myEntidade);
        if (ent.dataCriacao) {
          myEntidade.dataCriacao = !flag ? ent.dataCriacao : ent.dataCriacao.dados;
        }

        if (ent.dataExtincao) {
          myEntidade.dataExtincao = !flag ? ent.dataExtincao : ent.dataExtincao.dados;
        }

        return myEntidade;
      } catch (e) {
        return {};
      }
    },
  },

  created: async function () {
    if (this.$route.params.idEntidade.includes("-")) {
      try {
        let infoEntidade = await this.$request(
          "get",
          `/pedidos/${this.$route.params.idEntidade}`
        );
        this.entidade = await this.preparaEntidade(
          infoEntidade.data.historico[0],
          infoEntidade.data.historico[0].tipologiasSel,
          true
        );
        this.dadosReady = true;
      } catch (e) {
        return e;
      }
    } else {
      try {
        let idEntidade = this.$route.path.split("/")[3];
        let infoEntidade = await this.$request("get", "/entidades/" + idEntidade);

        let tipologias = await this.$request(
          "get",
          "/entidades/" + idEntidade + "/tipologias"
        );

        this.entidade = await this.preparaEntidade(
          infoEntidade.data,
          tipologias.data,
          false
        );

        this.dadosReady = true;
      } catch (e) {
        return e;
      }
    }
  },
};
</script>
