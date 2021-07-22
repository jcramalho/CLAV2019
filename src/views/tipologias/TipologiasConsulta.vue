<template>
  <div>
    <Loading v-if="!tipologiaReady" :message="'a tipologia'" />
    <Consulta
      v-else
      tipo="Tipologias"
      :objeto="tipologia"
      :titulo="titulo"
      :listaProcD="processosDono"
      :listaEnt="entidades"
      :listaProcP="processosParticipa"
      :parts="partsReady"
    />
  </div>
</template>

<script>
import Consulta from "@/components/generic/Consulta.vue";
import Loading from "@/components/generic/Loading";

import {
  comparaSigla
} from "@/utils/utils";

export default {
  components: {
    Consulta,
    Loading,
  },

  data() {
    return {
      tipologia: {},
      titulo: "",
      processosDono: [],
      processosParticipa: {
        Apreciador: [],
        Assessor: [],
        Comunicador: [],
        Decisor: [],
        Executor: [],
        Iniciador: [],
      },
      partsReady: false,
      entidades: [],
      tipologiaReady: false,
    };
  },

  async created() {
    try {
      const idTipologia = this.$route.params.idTipologia;

      // Informações sobre a tipologia
      const { data } = await this.$request("get", `/tipologias/${idTipologia}`);

      this.titulo = data.designacao;
      this.tipologia = this.preparaTipologia(data);

      // Processos cuja tipologia em questão é dona de
      const processosDono = await this.$request(
        "get",
        `/tipologias/${idTipologia}/intervencao/dono`
      );

      this.processosDono = processosDono.data;

      // Procesos em que a tipologia participa
      const processosParticipa = await this.$request(
        "get",
        `/tipologias/${idTipologia}/intervencao/participante`
      );

      await this.parseParticipacoes(processosParticipa.data);

      // Entidades que pertencem à tipologia em questão
      const entidades = await this.$request(
        "get",
        `/tipologias/${idTipologia}/elementos`
      );

      this.entidades = entidades.data;
      this.entidades.sort(comparaSigla);

      this.processosDono.sort((a, b) => (a.codigo > b.codigo ? 1 : -1));
      this.processosParticipa.Apreciador.sort((a, b) =>
        a.codigo > b.codigo ? 1 : -1
      );
      this.processosParticipa.Assessor.sort((a, b) =>
        a.codigo > b.codigo ? 1 : -1
      );
      this.processosParticipa.Comunicador.sort((a, b) =>
        a.codigo > b.codigo ? 1 : -1
      );
      this.processosParticipa.Decisor.sort((a, b) =>
        a.codigo > b.codigo ? 1 : -1
      );
      this.processosParticipa.Executor.sort((a, b) =>
        a.codigo > b.codigo ? 1 : -1
      );
      this.processosParticipa.Iniciador.sort((a, b) =>
        a.codigo > b.codigo ? 1 : -1
      );

      this.tipologiaReady = true;
    } catch (e) {
      return e;
    }
  },

  methods: {
    preparaTipologia(tip) {
      try {
        let myTipologia = {
          nome: {
            campo: "Designação",
            text: tip.designacao,
          },
          sigla: {
            campo: "Sigla",
            text: tip.sigla,
          },
        };

        return myTipologia;
      } catch (e) {
        return {};
      }
    },

    async parseParticipacoes(proc) {
      try {
        let tipoPar = "";
        let participa = false;

        for (var i = 0; i < proc.length; i++) {
          tipoPar = proc[i].tipoPar.replace(/.*temParticipante(.*)/, "$1");

          this.processosParticipa[tipoPar].push({
            titulo: proc[i].titulo,
            codigo: proc[i].codigo,
          });

          participa = true;
        }

        if (participa) this.partsReady = true;
      } catch (e) {
        return e;
      }
    },
  },
};
</script>
