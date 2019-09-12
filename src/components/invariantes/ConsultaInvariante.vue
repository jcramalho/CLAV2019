<template>
  <v-container grid-list-md fluid>
    <v-row row wrap justify-center>
      <v-col cols="11" v-if="erro == '' && inv != null">
        <TabelaErros :inv="inv" />
      </v-col>
      <v-col v-else>
        <v-alert :value="erro != ''" type="error">
          {{ erro }}
        </v-alert>
      </v-col>
    </v-row>
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
