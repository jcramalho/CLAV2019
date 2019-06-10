<template>
  <v-container fluid grid-list-lg class="mx-0 pa-2">
    <v-layout row wrap>
      <v-flex md3 sm6 xs12 v-for="(stat,index) in stats" v-bind:key="index">
        <v-card :class="stat.bgColor" dark>
          <v-container fluid grid-list-sm dark>
            <v-layout class="mt-0 mb-0 mx-0" row wrap>
              <v-flex sm3 hidden-xs-only>
                <v-icon class="mx-0" x-large dark>{{stat.icon}}</v-icon>
              </v-flex>
              <v-flex sm9 xs12>
                <v-layout class="mt-0 mb-0 pa-0" row wrap>
                  <v-flex d-flex xs12>
                    <div class="silver--text subheading">{{stat.title}}</div>
                  </v-flex>
                  <v-flex d-flex xs12>
                    <div class="silver--text display-1">{{stat.data}}</div>
                    <v-btn outline class="darkgrey--text darken-1" v-if="stat.action.label.length>0" right flat small @click="irPara(stat.action.link)">{{stat.action.label}}</v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout class="" row wrap>
      <v-flex md4 xs12>
        <v-card light>
          <doughnut></doughnut>
        </v-card>
      </v-flex>
      <v-flex md4 xs12>
        <v-card light>
          <bar></bar>
        </v-card>
      </v-flex>
      <v-flex md4 xs12>
        <v-card light >
          <line-chart></line-chart>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const lhost = require("@/config/global").host;
import axios from "axios";
import Bar from "../chart/Bar";
import Doughnut from "../chart/Doughnut";
import LineChart from "../chart/LineChart";

export default {
  name: "Dashboard",
  components: {
    Bar,
    Doughnut,
    LineChart
  },
  data() {
    return {
      stats: []
    };
  },
  mounted(){
    this.getNumeroUtilizadores();
    this.getNumeroEntidades();
    this.getApiCalls();
  },
  methods: {
    async getNumeroEntidades() {
      await axios.get(lhost + "/api/entidades").then(res => {
        this.stats.push({
          bgColor: "primary",
          icon: "account_balance",
          title: "Número de entidades",
          data: res.data.length,
          action: {
            label: "Mais info",
            link: "/entidades"
          },
        });
      }).catch(error => alert(error));
    },
    async getNumeroUtilizadores() {
      await axios.get(lhost + "/api/users").then(res => {
        this.numeroUtilizadores = res.data.length
        this.stats.push({
          bgColor: "primary",
          icon: "person",
          title: "Número de utilizadores",
          data: res.data.length,
          action: {
            label: "Mais info",
            link: "/users/listagem"
          },
        });
      }).catch(error => alert(error));
    },
    async getApiCalls() {
      await axios.get(lhost + "/api/users/contarChamadasApi").then(res => {
        this.stats.push({
          bgColor: "primary",
          icon: "lock",
          title: "Chamadas à API",
          data: res.data,
          action: {
            label: "",
            link: ""
          },
        });
      }).catch(error => alert(error));
    },
    irPara(path){
      this.$router.push(path)
    }
  }
};
</script>