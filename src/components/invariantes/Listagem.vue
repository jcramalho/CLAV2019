<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 v-if="erro == ''">
        <v-card>
          <v-toolbar color="indigo darken-4" dark>
            <v-toolbar-title>Invariantes</v-toolbar-title>
          </v-toolbar>
          <v-list>
            <v-list-group v-for="rel in invariantes" :key="rel.idRel">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title v-text="rel.desc"></v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>

              <v-list-tile
                v-for="inv in rel.invs"
                :key="inv.idInv"
                @click="goToInvariante(rel.idRel, inv.idInv)"
              >
                <v-list-tile-content>
                  <div v-html="inv.desc"></div>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group>
          </v-list>
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
import axios from "axios";
const lhost = require("@/config/global").host;

export default {
  data: () => ({
    invariantes: [],
    erro: ""
  }),

  mounted: async function() {
    try {
      var response = await axios.get(lhost + "/api/invariantes");
      this.invariantes = response.data;
    } catch (e) {
      this.erro = "Não foi possível obter os invariantes... Tente novamente mais tarde.";
    }
  },

  methods: {
    goToInvariante: function(idRel, idInv) {
      this.$router.push("/invariantes?" + idRel + "&" + idInv);
    }
  }
};
</script>
