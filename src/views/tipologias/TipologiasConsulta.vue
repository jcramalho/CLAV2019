<template>
  <Consulta
    tipo="Tipologias"
    v-bind:objeto="tipologia"
    v-bind:titulo="titulo"
    v-bind:listaProcD="processosDono"
    v-bind:listaEnt="entidades"
    v-bind:listaProcP="processosParticipa"
    v-bind:parts="partsReady"
  />
</template>

<script>
import Consulta from "@/components/generic/Consulta.vue";

export default {
  components: {
    Consulta
  },
  data: () => ({
    idTipologia: "",
    tipologia: {},
    titulo: "",
    processosDono: [],
    processosParticipa: {
      Apreciador: [],
      Assessor: [],
      Comunicador: [],
      Decisor: [],
      Executor: [],
      Iniciador: []
    },
    partsReady: false,
    entidades: []
  }),
  methods: {
    preparaTipologia: async function(tip) {
      try {
        var myTipologia = {
          nome: {
            campo: "Nome",
            text: tip.designacao
          },
          sigla: {
            campo: "Sigla",
            text: tip.sigla
          }
        };
        return myTipologia;
      } catch (e) {
        return {};
      }
    },
    parseParticipacoes: async function(proc) {
      try {
        var tipoPar = "";
        var participa = false;

        for (var i = 0; i < proc.length; i++) {
          tipoPar = proc[i].tipoPar.replace(/.*temParticipante(.*)/, "$1");

          this.processosParticipa[tipoPar].push({
            titulo: proc[i].titulo,
            codigo: proc[i].codigo
          });
          participa = true;
        }
        if (participa) this.partsReady = true;
      } catch (e) {
        return e;
      }
    }
  },
  created: async function() {
    try {
      this.idTipologia = window.location.pathname.split("/")[2];

      // Informações sobre a tipologia
      var response = await this.$request(
        "get",
        "/api/tipologias/" + this.idTipologia
      );
      this.titulo = response.data.designacao;
      this.tipologia = await this.preparaTipologia(response.data);

      // Processos cuja tipologia em questão é dona de
      var processosDono = await this.$request(
        "get",
        "/api/tipologias/" + this.idTipologia + "/intervencao/dono"
      );
      this.processosDono = processosDono.data;

      // Procesos em que a entidade participa
      var processosParticipa = await this.$request(
        "get",
        "/api/entidades/" + this.idTipologia + "/intervencao/participante"
      );
      await this.parseParticipacoes(processosParticipa.data);

      // Entidades que pertencem à tipologia em questão
      var entidades = await this.$request(
        "get",
        "/api/tipologias/" + this.idTipologia + "/elementos"
      );
      this.entidades = entidades.data;
    } catch (e) {
      return e;
    }
  }
};
</script>
