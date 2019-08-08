<template>
  <v-container fluid>
    <v-layout row wrap justify-center>
      <v-flex xs11 v-if="erro == ''">
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

              <template v-for="inv in rel.invs">
                <v-card
                  flat
                  hover
                  :key="inv.idInv"
                  @click="goToInvariante(rel.idRel, inv.idInv)"
                  class="ml-5 mr-4 elevation-2"
                >
                  <v-layout row wrap ma-1 pa-2 align-center>
                    <v-flex xs11>
                      <span v-html="inv.desc"></span>
                    </v-flex>
                    <v-flex xs1>
                      <DialogQuery
                        :title="rel.desc"
                        :subtitle="inv.desc"
                        :query="inv.query"
                        :idRel="rel.idRel"
                        :idInv="inv.idInv"
                      />
                    </v-flex>
                  </v-layout>
                </v-card>
              </template>
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
import DialogQuery from "@/components/invariantes/DialogQuery.vue";

export default {
  data: () => ({
    invariantes: [],
    erro: ""
  }),

  components: {
    DialogQuery
  },

  mounted: async function() {
    try {
      var response = await axios.get(lhost + "/api/invariantes");
      this.invariantes = response.data;
    } catch (e) {
      this.erro =
        "Não foi possível obter os invariantes... Tente novamente mais tarde.";
    }
  },

  methods: {
    goToInvariante: function(idRel, idInv) {
      this.$router.push("/invariantes?idRel=" + idRel + "&idInv=" + idInv);
    }
  }
};
</script>

<style scoped>
.v-card:hover {
  background-color: grey;
  color: white;
}
</style>
