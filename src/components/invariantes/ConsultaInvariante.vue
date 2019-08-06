<template>
  <v-container grid-list-md fluid>
    <v-layout row wrap justify-center>
      <v-flex xs11 v-if="erro == ''">
        <v-card>
          <v-card-title class="indigo darken-2 white--text" fill-height>
            <div>
              <h2>{{ inv.descRel }}</h2>
              <h4 v-html="inv.descInv"></h4>
            </div>
          </v-card-title>

          <v-toolbar flat color="white">
            <v-toolbar-title>PNs que não cumprem o invariante:</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <div v-if="inv.results.length != 0">
            <v-data-table :headers="headers" :items="inv.results">
              <template v-slot:items="erros">
                <tr>
                  <td
                    v-for="v in Object.keys(erros.item)"
                    :key="v"
                    class="text-xs-center"
                  >
                    {{ erros.item[v] }}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </div>
          <div v-else>
            <v-alert :value="true" color="success">
              Não há PNs a apresentar...
            </v-alert>
          </div>

          <v-btn color="indigo darken-2" @click="goBack()" dark>
            Voltar à lista de invariantes
          </v-btn>
        </v-card>
      </v-flex>
      <v-flex v-else>
        <v-alert :value="erro != ''" type="error">
          {{ erro }}
        </v-alert>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
const lhost = require("@/config/global").host;
const help = require("@/config/help").help;
import axios from "axios";

export default {
  props: ["idRel", "idInv"],
  data: () => ({
    inv: {},
    headers: [],
    erro: ""
  }),

  methods: {
    goBack: function() {
      this.$router.push("/invariantes");
    }
  },

  mounted: function() {
    axios
      .get(
        lhost + "/api/invariantes?idRel=" + this.idRel + "&idInv=" + this.idInv
      )
      .then(response => {
        this.inv = response.data;
        if (this.inv.results.length > 0) {
          Object.keys(this.inv.results[0]).forEach(key => {
            this.headers.push({ text: key, align: "center", value: key });
          });
        }
      })
      .catch(error => {
        this.erro =
          "Não foi possível testar o invariante... Tente novamente mais tarde.";
      });
  }
};
</script>
