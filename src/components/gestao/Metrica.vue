<template>
  <v-card flat class="pa-3">
    <p class="clav-content-title-1">Métricas de API</p>
    <v-row>
      <v-col cols="12" sm="6" md="3" v-for="(stat, index) in stats" :key="index">
        <v-card :class="stat.bgColor" dark>
          <v-container fluid grid-list-sm dark>
            <v-layout class="mt-0 mb-0 mx-0" row wrap>
              <v-flex sm3 hidden-xs-only>
                <v-icon class="mx-0" x-large dark>{{ stat.icon }}</v-icon>
              </v-flex>
              <v-flex sm9 xs12>
                <v-layout class="mt-0 mb-0 pa-0" row wrap>
                  <v-flex d-flex xs12>
                    <div class="silver--text subheading">{{ stat.title }}</div>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <div class="silver--text display-1">{{ stat.data }}</div>
                    <v-btn
                      outlined
                      class="darkgrey--text darken-1"
                      v-if="stat.action.label.length > 0"
                      right
                      text
                      small
                      @click="irPara(stat.action.link)"
                    >
                      {{ stat.action.label }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card flat> <doughnut></doughnut> </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card flat> <bar></bar> </v-card>
      </v-col>
    </v-row>
    <!--v-flex md6 xs12>
        <v-card light>
          <line-chart></line-chart>
        </v-card>
      </v-flex-->
  </v-card>
</template>

<script>
import Bar from "./chart/Bar";
import Doughnut from "./chart/APIUsersTypeDoughnut";
//import LineChart from "./chart/LineChart";

export default {
  name: "Dashboard",
  components: {
    Bar,
    Doughnut,
    //LineChart
  },
  data() {
    return {
      stats: [],
    };
  },
  mounted() {
    this.getNumeroUtilizadores();
    this.getNumeroEntidades();
    this.getApiCalls();
    this.getNumeroChavesApi();
  },
  methods: {
    async getNumeroEntidades() {
      await this.$request("get", "/entidades")
        .then((res) => {
          this.stats.push({
            bgColor: "primary",
            icon: "account_balance",
            title: "Número de entidades",
            data: res.data.length,
            action: {
              label: "Mais info",
              link: "/entidades",
            },
          });
        })
        .catch((error) => alert(error));
    },
    async getNumeroUtilizadores() {
      await this.$request("get", "/users")
        .then((res) => {
          this.numeroUtilizadores = res.data.length;
          this.stats.push({
            bgColor: "primary",
            icon: "person",
            title: "Número de utilizadores",
            data: res.data.length,
            action: {
              label: "Mais info",
              link: "/users/listagem",
            },
          });
        })
        .catch((error) => alert(error));
    },
    async getApiCalls() {
      await this.$request("get", "/logsAgregados/total")
        .then((res) => {
          this.stats.push({
            bgColor: "primary",
            icon: "lock",
            title: "Chamadas à API",
            data: res.data,
            action: {
              label: "",
              link: "",
            },
          });
        })
        .catch((error) => alert(error));
    },
    async getNumeroChavesApi() {
      await this.$request("get", "/chaves/")
        .then((res) => {
          this.numeroChavesApi = res.data.length;
          this.stats.push({
            bgColor: "primary",
            icon: "vpn_key",
            title: "Número de chaves API",
            data: res.data.length,
            action: {
              label: "Mais info",
              link: "/gestao/api/listagem",
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
