<template>
  <v-container grid-list-lg>
    <v-layout row wrap>
      <v-flex md4 sm6 xs12 v-for="(stat, index) in stats" v-bind:key="index">
        <v-card :class="stat.bgColor" dark>
          <v-container fluid grid-list-sm dark>
            <v-layout class="mt-0 mb-0 pa-0" row>
              <v-flex d-flex xs3 md3 lg3>
                <v-icon class="mx-0" x-large dark>{{ stat.icon }}</v-icon>
              </v-flex>
              <v-flex d-flex xs9 md9 lg9 align-self-center="">
                <div class="silver--text caption">{{ stat.title }}</div>
              </v-flex>
            </v-layout>
            <v-layout class="mt-0 mb-0 pa-0" row align-center>
              <v-flex d-flex xs6 md6 lg6>
                <div class="silver--text display-1">{{ stat.data }}</div>
              </v-flex>
              <v-flex d-flex xs6 md6 lg6>
                <v-btn
                  v-if="stat.action"
                  text
                  outlined
                  small
                  @click="irPara(stat.action.link)"
                >
                  {{ stat.action.label }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex md6 xs12>
        <v-card light>
          <DoughnutPNS/>
        </v-card>
      </v-flex>
      <v-flex md6 xs12>
        <v-card light>
          <DoughnutParticipantes/>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex md6 xs12>
        <v-card light>
          <DoughnutDF/>
        </v-card>
      </v-flex>
      <v-flex md6 xs12>
        <v-card light>
          <DoughnutCriterio :crit="criterios"/>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
import DoughnutPNS from "./chart/RelsPNsDoughnut";
import DoughnutParticipantes from "./chart/RelsPartiDoughnut";
import DoughnutDF from "./chart/RelsDFDoughnut";
import DoughnutCriterio from "./chart/RelsCriterioDoughnut";
export default {
  name: "Dashboard",
  components: {
    DoughnutPNS,
    DoughnutParticipantes,
    DoughnutDF,
    DoughnutCriterio
  },
  data() {
    return {
      criterios: [],
      stats: []
    };
  },
  async mounted() {
    await this.getNumeroClassesNivelUm();
    await this.getNumeroClassesNivelDois();
    await this.getNumeroClassesNivelTres();
    await this.getNumeroClassesNivelQuatro();
    await this.getCriteriosDeJustificacao();
  },
  methods: {
    async getCriteriosDeJustificacao() {
      await this.$request("get", "/indicadores/critstats")
        .then(res => {
          this.criterios = res.data;
          this.stats.push({
            bgColor: "indigo darken-4",
            icon: "gavel",
            title: "Número de Critérios de Justificação",
            data: res.data[0].valor
          });
        })
        .catch(error => alert(error));
    },
    async getNumeroClassesNivelUm() {
      await this.$request("get", "/indicadores/classesN1")
        .then(res => {
          this.stats.push({
            bgColor: "indigo darken-4",
            icon: "class",
            title: res.data.indicador,
            data: res.data.valor,
            action: {
              label: "Mais info",
              link: "/classes"
            }
          });
        })
        .catch(error => alert(error));
    }
    ,async getNumeroClassesNivelDois() {
      await this.$request("get", "/indicadores/classesN2")
        .then(res => {
          this.stats.push({
            bgColor: "indigo darken-4",
            icon: "class",
            title: res.data.indicador,
            data: res.data.valor,
          });
        })
        .catch(error => alert(error));
    },
    async getNumeroClassesNivelTres() {
      await this.$request("get", "/indicadores/classesN3")
        .then(res => {
          this.stats.push({
            bgColor: "indigo darken-4",
            icon: "work",
            title: res.data.indicador,
            data: res.data.valor,
          });
        })
        .catch(error => alert(error));
    },
    async getNumeroClassesNivelQuatro() {
      await this.$request("get", "/indicadores/classesN4")
        .then(res => {
          this.stats.push({
            bgColor: "indigo darken-4",
            icon: "work",
            title: res.data.indicador,
            data: res.data.valor,
          });
        })
        .catch(error => alert(error));
    },
    irPara(path) {
      this.$router.push(path);
    }
  }
};
</script>
