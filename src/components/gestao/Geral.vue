<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">Métricas Gerais</p>
    <v-row>
      <v-col cols="12" sm="6" md="3" v-for="(stat, index) in stats" :key="index">
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
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card flat>
          <DoughnutEntidades />
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card flat>
          <DoughnutDocs />
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import DoughnutEntidades from "./chart/GeralEntsDoughnut";
import DoughnutDocs from "./chart/GeralDocsDoughnut";
export default {
  name: "Dashboard",
  components: {
    DoughnutEntidades,
    DoughnutDocs,
  },
  data() {
    return {
      stats: [],
    };
  },
  async mounted() {
    await this.getNumeroEntidades();
    await this.getNumeroTipologias();
    await this.getNumeroDocsLegislativos();
  },
  methods: {
    async getNumeroTipologias() {
      await this.$request("get", "/indicadores/tipologias")
        .then((res) => {
          this.stats.push({
            bgColor: "indigo darken-4",
            icon: "class",
            title: res.data.indicador,
            data: res.data.valor,
            action: {
              label: "Mais info",
              link: "/tipologias",
            },
          });
        })
        .catch((error) => alert(error));
    },
    async getNumeroEntidades() {
      await this.$request("get", "/indicadores/entidades")
        .then((res) => {
          this.stats.push({
            bgColor: "indigo darken-4",
            icon: "class",
            title: res.data.indicador,
            data: res.data.valor,
            action: {
              label: "Mais info",
              link: "/entidades",
            },
          });
        })
        .catch((error) => alert(error));
    },
    async getNumeroDocsLegislativos() {
      await this.$request("get", "/indicadores/leg")
        .then((res) => {
          this.stats.push({
            bgColor: "indigo darken-4",
            icon: "work",
            title: res.data.indicador,
            data: res.data.valor,
            action: {
              label: "Mais info",
              link: "/legislacao",
            },
          });
        })
        .catch((error) => alert(error));
    },
    irPara(path) {
      this.$router.push(path);
    },
  },
};
</script>
