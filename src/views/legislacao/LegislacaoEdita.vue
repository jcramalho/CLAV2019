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
    Loading,
  },

  data: () => ({
    legislacao: {},
    dadosReady: false,
    entidades: null,
  }),

  methods: {
    loadEntidades: async function () {
      try {
        let response = await this.$request("get", "/entidades");
        this.entidades = response.data.map(function (item) {
          return {
            sigla: item.sigla,
            designacao: item.designacao,
            id: item.id,
          };
        });
      } catch (error) {
        return error;
      }
    },

    preparaLegislacao: async function (leg, proReg, flag) {
      try {
        let myLegislacao = {
          numero: !flag ? leg.numero : leg.numero.dados,
          sumario: !flag ? leg.sumario : leg.sumario.dados,
          tipo: !flag ? leg.tipo : leg.tipo.dados,
          data: !flag ? leg.data : leg.data.dados,
          link: !flag ? leg.link : leg.link.dados,
          diplomaFonte: !flag ? leg.fonte : leg.diplomaFonte.dados,
          entidadesSel: !flag
            ? JSON.parse(JSON.stringify(leg.entidades))
            : JSON.parse(JSON.stringify(leg.entidadesSel.dados)),
          processosSel: !flag ? proReg : proReg.dados,
          estado: !flag ? leg.estado : false,
        };
        !flag ? (myLegislacao.id = leg.id) : false;
        return myLegislacao;
      } catch (e) {
        return {};
      }
    },
  },

  created: async function () {
    if (!this.$route.params.idLegislacao.includes("leg")) {
      try {
        let infoLegislacao = await this.$request(
          "get",
          `/pedidos/${this.$route.params.idLegislacao}`
        );

        this.legislacao = await this.preparaLegislacao(
          infoLegislacao.data.historico[0],
          infoLegislacao.data.historico[0].processosSel,
          true
        );

        this.dadosReady = true;
      } catch (e) {
        return e;
      }
    } else {
      await this.loadEntidades();

      try {
        let idLegislacao = this.$route.path.split("/")[3];

        let infoLegislacao = await this.$request("get", "/legislacao/" + idLegislacao);

        let processosRegula = await this.$request(
          "get",
          "/legislacao/" + idLegislacao + "/processos"
        );

        this.legislacao = await this.preparaLegislacao(
          infoLegislacao.data,
          processosRegula.data,
          false
        );

        let newEnts = [];

        this.legislacao.entidadesSel.forEach((ent) => {
          let index = this.entidades.findIndex((e) => e.sigla === ent.sigla);
          newEnts.push(this.entidades[index]);
        });

        this.legislacao.entidadesSel = newEnts;

        this.dadosReady = true;
      } catch (e) {
        return e;
      }
    }
  },
};
</script>
