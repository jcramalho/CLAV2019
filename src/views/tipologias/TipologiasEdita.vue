<template>
  <div>
    <Loading v-if="!dadosReady" :message="'tipologia'" />
    <EditaTipologia v-else :t="tipologia" />
  </div>
</template>

<script>
import EditaTipologia from "@/components/tipologias/EditaTipologia";
import Loading from "@/components/generic/Loading";

export default {
  components: {
    EditaTipologia,
    Loading,
  },

  data: () => ({
    tipologia: {},
    dadosReady: false,
  }),

  methods: {
    preparaTipologia: async function (tip, ent, flag) {
      try {
        let myTipologia = {
          designacao: !flag ? tip.designacao : tip.designacao.dados,
          sigla: !flag ? tip.sigla : tip.sigla.dados,
          estado: !flag ? tip.estado : false,
          entidadesSel: !flag ? ent : ent.dados,
        };
        return myTipologia;
      } catch (e) {
        return {};
      }
    },
  },

  created: async function () {
    if (this.$route.params.idTipologia.includes("-")) {
      try {
        let infoTipologia = await this.$request(
          "get",
          `/pedidos/${this.$route.params.idTipologia}`
        );
        console.log(infoTipologia.data);
        this.tipologia = await this.preparaTipologia(
          infoTipologia.data.historico[0],
          infoTipologia.data.historico[0].entidadesSel,
          true
        );

        this.dadosReady = true;
      } catch (e) {
        return e;
      }
    } else {
      try {
        let idTipologia = this.$route.path.split("/")[3];

        let infoTipologia = await this.$request("get", "/tipologias/" + idTipologia);

        let entidadesAssociadas = await this.$request(
          "get",
          "/tipologias/" + idTipologia + "/elementos"
        );

        this.tipologia = await this.preparaTipologia(
          infoTipologia.data,
          entidadesAssociadas.data,
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
