<template>
  <v-container grid-list-md fluid>
    <v-layout row wrap justify-center>
      <v-flex xs11 v-if="erro == '' && inv != null">
        <TabelaErros :inv="inv" />
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
import TabelaErros from "@/components/invariantes/TabelaErros.vue";
const lhost = require("@/config/global").host;
import axios from "axios";

export default {
  props: ["idRel", "idInv"],
  data: () => ({
    inv: null,
    erro: ""
  }),
  components: {
    TabelaErros
  },

  mounted: function() {
    axios
      .get(
        lhost + "/api/invariantes?idRel=" + this.idRel + "&idInv=" + this.idInv
      )
      .then(response => {
        this.inv = response.data;
      })
      .catch(error => {
        this.erro =
          "Não foi possível testar o invariante... Tente novamente mais tarde.";
      });
  }
};
</script>
