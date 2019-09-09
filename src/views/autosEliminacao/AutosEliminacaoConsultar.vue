<template>
  <Consulta
    tipo="Auto de Eliminação"
    v-bind:objeto="autoEliminacao"
    v-bind:titulo="titulo"
    v-bind:listaProcD="processosDono"
    v-bind:listaEnt="entidades"
    v-bind:listaProcP="processosParticipa"
    v-bind:parts="partsReady"
  />
</template>

<script>
import Consulta from "@/components/generic/Consulta.vue";
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  components: {
    Consulta
  },
  data: () => ({
    idAE: "",
    autoEliminacao: {},
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
    preparaAutos: async function(auto) {
      try {
        var myAuto = {
          numero: {
            campo: "Numero do Auto",
            text: auto.id.replace('ae_','').replace(/_/g,'/')
          },
          data: {
            campo: "Data de Autenticação",
            text: auto.data
          },
          entidade: {
            campo: "Entidades",
            text: auto.entidade.split("#")[1].replace('ent_','')
          },
          responsavel: {
            campo: "Identificação dos responsáveis",
            text: auto.responsavel
          },
          legislacao: {
            campo: "Fonte de Legitimação",
            text: auto.legislacao
          },
          fundo: {
            campo: "Fundo",
            text: auto.fundo
          },
          zonaControlo: {
            campo: "Zonas de Identificação e Controlo",
            text: auto.zonaControlo
          }
        };
        return myAuto;
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
      this.idAE = window.location.pathname.split("/")[2];

      // Informações sobre o Auto de Eliminação
      var response = await axios.get(
        lhost + "/api/autosEliminacao/" + this.idAE
      );
      this.titulo = response.data.id.replace('ae_','').replace(/_/g,'/');
      this.autoEliminacao = await this.preparaAutos(response.data);
      console.log(response)
    } catch (e) {
      return e;
    }
  }
};
</script>
